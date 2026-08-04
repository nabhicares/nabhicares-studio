# Drill: backup → restore into a scratch database → count rows → drop scratch.
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$backupDir = Join-Path $root "backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

Write-Host "== 1. Backup =="
& (Join-Path $PSScriptRoot "backup-builder.ps1") -OutDir $backupDir
$latest = Get-ChildItem $backupDir -Filter "builder-*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $latest) { throw "No backup file produced" }
Write-Host "Backup: $($latest.FullName)"

Write-Host "== 2. Create scratch DB =="
docker exec nabhicares-postgres-builder psql -U builder -d postgres -c "DROP DATABASE IF EXISTS nabhicares_builder_restore_drill;"
docker exec nabhicares-postgres-builder psql -U builder -d postgres -c "CREATE DATABASE nabhicares_builder_restore_drill OWNER builder;"

Write-Host "== 3. Restore into scratch =="
Get-Content -Raw $latest.FullName | docker exec -i nabhicares-postgres-builder psql -U builder -d nabhicares_builder_restore_drill -v ON_ERROR_STOP=1

Write-Host "== 4. Verify counts =="
$sql = 'SELECT count(*) FROM "Hospital";'
$liveN = ($sql | docker exec -i nabhicares-postgres-builder psql -U builder -d nabhicares_builder -tA | Out-String).Trim()
$drillN = ($sql | docker exec -i nabhicares-postgres-builder psql -U builder -d nabhicares_builder_restore_drill -tA | Out-String).Trim()
Write-Host "Live Hospital count: $liveN"
Write-Host "Drill Hospital count: $drillN"
if ($liveN -ne $drillN -or $liveN -eq '') {
  throw "Restore drill mismatch: live=$liveN drill=$drillN"
}

Write-Host "== 5. Drop scratch =="
docker exec nabhicares-postgres-builder psql -U builder -d postgres -c "DROP DATABASE nabhicares_builder_restore_drill;"

Write-Host "OK Backup restore drill passed. Stated local RPO = last successful dump."
