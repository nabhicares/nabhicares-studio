# Restore builder DB from a plain .sql dump (from backup-builder.ps1).
# WARNING: overwrites nabhicares_builder.
param(
  [Parameter(Mandatory = $true)][string]$File
)
if (-not (Test-Path $File)) { throw "File not found: $File" }
$container = if ($env:POSTGRES_CONTAINER) { $env:POSTGRES_CONTAINER } else { "nabhicares-postgres-builder" }
Write-Host "Restoring $File into $container …"
Get-Content -Raw $File | docker exec -i $container psql -U builder -d nabhicares_builder -v ON_ERROR_STOP=1
Write-Host "Done. Verify: docker exec $container psql -U builder -d nabhicares_builder -c `"SELECT count(*) FROM \`"Hospital\`";`""
