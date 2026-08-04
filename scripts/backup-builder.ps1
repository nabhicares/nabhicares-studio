# Backup builder Postgres (Windows). RPO: schedule via Task Scheduler.
# Restore example:
#   Get-Content backups\builder-....sql.gz -Encoding Byte | ... (prefer WSL/bash restore)
#   or: docker exec -i nabhicares-postgres-builder psql -U builder -d nabhicares_builder < dump.sql
param(
  [string]$OutDir = (Join-Path $PSScriptRoot "..\backups")
)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$stamp = Get-Date -Format "yyyyMMddTHHmmssZ"
$file = Join-Path $OutDir "builder-$stamp.sql"
docker exec nabhicares-postgres-builder pg_dump -U builder -d nabhicares_builder | Set-Content -Path $file -Encoding utf8
Write-Host "Wrote $file"
Get-ChildItem $OutDir -Filter "builder-*.sql" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-14) } |
  Remove-Item -Force
