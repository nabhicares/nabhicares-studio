# Fix nabhilabs.info DNS in Cloudflare so Vercel domains resolve publicly.
# Root cause we observed: A records for @ / studio / wildcards pointing at 127.0.0.1
# instead of Vercel (76.76.21.21).
#
# Prerequisites (Cloudflare dashboard → My Profile → API Tokens):
#   Create token with Zone.DNS Edit for zone nabhilabs.info
#
# Usage (PowerShell):
#   $env:CLOUDFLARE_API_TOKEN = "..."
#   $env:CLOUDFLARE_ZONE_ID = "..."   # optional; script looks up zone by name
#   .\scripts\ops\fix-nabhilabs-cloudflare-dns.ps1

$ErrorActionPreference = "Stop"
$token = $env:CLOUDFLARE_API_TOKEN
if (-not $token) {
  Write-Error "Set CLOUDFLARE_API_TOKEN (Zone.DNS Edit for nabhilabs.info)"
}

$headers = @{
  Authorization = "Bearer $token"
  "Content-Type" = "application/json"
}

$zoneId = $env:CLOUDFLARE_ZONE_ID
if (-not $zoneId) {
  $zones = Invoke-RestMethod -Headers $headers -Uri "https://api.cloudflare.com/client/v4/zones?name=nabhilabs.info"
  if (-not $zones.success -or $zones.result.Count -lt 1) {
    Write-Error "Zone nabhilabs.info not found for this token"
  }
  $zoneId = $zones.result[0].id
  Write-Host "Zone ID: $zoneId"
}

$VERCEL_A = "76.76.21.21"
# Desired records: DNS-only (proxied=false) until Vercel shows Valid, then optional proxy.
$desired = @(
  @{ type = "A"; name = "nabhilabs.info"; content = $VERCEL_A; note = "apex" },
  @{ type = "A"; name = "www.nabhilabs.info"; content = $VERCEL_A; note = "www" },
  @{ type = "A"; name = "studio.nabhilabs.info"; content = $VERCEL_A; note = "Studio" },
  @{ type = "A"; name = "*.nabhilabs.info"; content = $VERCEL_A; note = "hospital subdomains" }
)

$existing = Invoke-RestMethod -Headers $headers -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?per_page=100"
Write-Host "`nCurrent A/CNAME records:"
$existing.result | Where-Object { $_.type -in @("A", "AAAA", "CNAME") } | ForEach-Object {
  Write-Host ("  {0,-6} {1,-40} -> {2}  proxied={3}" -f $_.type, $_.name, $_.content, $_.proxied)
}

function Upsert-Record($spec) {
  $name = $spec.name
  $type = $spec.type
  $content = $spec.content
  $matches = @($existing.result | Where-Object { $_.name -eq $name -and $_.type -in @("A", "AAAA", "CNAME") })
  foreach ($m in $matches) {
    if ($m.type -ne $type -or $m.content -ne $content -or $m.proxied -ne $false) {
      Write-Host "Deleting conflicting $($m.type) $($m.name) -> $($m.content)"
      Invoke-RestMethod -Method DELETE -Headers $headers -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records/$($m.id)" | Out-Null
    } else {
      Write-Host "OK already $($m.type) $($m.name) -> $($m.content)"
      return
    }
  }
  $body = @{
    type    = $type
    name    = $name
    content = $content
    ttl     = 1
    proxied = $false
  } | ConvertTo-Json
  Write-Host "Creating $type $name -> $content (DNS only)  [$($spec.note)]"
  Invoke-RestMethod -Method POST -Headers $headers -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" -Body $body | Out-Null
}

Write-Host "`nApplying Vercel targets..."
foreach ($d in $desired) { Upsert-Record $d }

Write-Host "`nDone. Wait 1–5 minutes, then in Vercel Domains click Refresh."
Write-Host "Check: Resolve-DnsName studio.nabhilabs.info -Server 1.1.1.1"
Write-Host "Expect A 76.76.21.21 (NOT 127.0.0.1)."
