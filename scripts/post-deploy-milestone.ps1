$ErrorActionPreference = "Stop"

$frontendRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\smartops-supply-web\backend"
$controlRoot = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\_smartops_control"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$snapshotRoot = Join-Path $controlRoot "post_deploy_milestone_$timestamp"
$backupRoot = Join-Path $snapshotRoot "backup"
$reportsRoot = Join-Path $snapshotRoot "reports"

function Ensure-Dir {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Write-Utf8NoBomFile {
    param(
        [string]$Path,
        [string]$Content
    )
    $dir = Split-Path -Parent $Path
    Ensure-Dir $dir
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Copy-LightProject {
    param(
        [string]$SourcePath,
        [string]$DestinationPath
    )

    if (-not (Test-Path -LiteralPath $SourcePath)) {
        return
    }

    Ensure-Dir $DestinationPath

    $args = @(
        $SourcePath,
        $DestinationPath,
        "/E",
        "/R:1",
        "/W:1",
        "/NFL",
        "/NDL",
        "/NJH",
        "/NJS",
        "/NP",
        "/XD", (Join-Path $SourcePath "node_modules"),
        "/XD", (Join-Path $SourcePath ".next"),
        "/XD", (Join-Path $SourcePath ".git"),
        "/XD", (Join-Path $SourcePath "dist"),
        "/XD", (Join-Path $SourcePath "coverage"),
        "/XF", "*.log"
    )

    & robocopy @args | Out-Null
    if ($LASTEXITCODE -gt 7) {
        throw "Robocopy failed with exit code $LASTEXITCODE"
    }
}

Ensure-Dir $controlRoot
Ensure-Dir $snapshotRoot
Ensure-Dir $backupRoot
Ensure-Dir $reportsRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host " SMARTOPS POST-DEPLOY MILESTONE SNAPSHOT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host "Frontend root: $frontendRoot" -ForegroundColor Cyan
Write-Host "Backend root : $backendRoot" -ForegroundColor Cyan
Write-Host "Snapshot root: $snapshotRoot" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backing up frontend..." -ForegroundColor Yellow
Copy-LightProject -SourcePath $frontendRoot -DestinationPath (Join-Path $backupRoot "smartops-platform")

Write-Host "Backing up backend..." -ForegroundColor Yellow
Copy-LightProject -SourcePath $backendRoot -DestinationPath (Join-Path $backupRoot "backend")

$notes = @"
SmartOps Post-Deploy Milestone Snapshot
Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Confirmed state:
- Frontend deployed on Vercel
- Backend deployed on Render
- Public login working
- Protected routes working
- AppShell working
- Inventory / Warehouse / Tasks / Orders / Reports / AI foundations working

Frontend URL:
https://smartops-platform.vercel.app

Backend URL:
https://smartops-platform-backend.onrender.com/api
"@

Write-Utf8NoBomFile -Path (Join-Path $reportsRoot "post-deploy-notes.txt") -Content $notes

cmd /c tree "$frontendRoot\src" /F /A > (Join-Path $reportsRoot "frontend-src-tree.txt")
cmd /c tree "$backendRoot\src" /F /A > (Join-Path $reportsRoot "backend-src-tree.txt")

Write-Host ""
Write-Host "Post-deploy milestone snapshot saved successfully." -ForegroundColor Green
Write-Host "Snapshot folder: $snapshotRoot" -ForegroundColor Cyan