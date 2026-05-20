$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$controlRoot = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\_smartops_control"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$snapshotRoot = Join-Path $controlRoot "final_milestone_snapshot_$timestamp"
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
Write-Host " SMARTOPS FINAL MILESTONE SNAPSHOT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host "Project root : $projectRoot" -ForegroundColor Cyan
Write-Host "Snapshot root: $snapshotRoot" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backing up project..." -ForegroundColor Yellow
Copy-LightProject -SourcePath $projectRoot -DestinationPath (Join-Path $backupRoot "smartops-platform")

Write-Host "Capturing reports..." -ForegroundColor Yellow

$packageJsonPath = Join-Path $projectRoot "package.json"
$packageSummary = @()

if (Test-Path -LiteralPath $packageJsonPath) {
    try {
        $pkg = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
        $packageSummary += "Name    : $($pkg.name)"
        $packageSummary += "Version : $($pkg.version)"
        $packageSummary += "Private : $($pkg.private)"
        $packageSummary += ""
        $packageSummary += "Scripts:"
        $pkg.scripts.PSObject.Properties |
            Sort-Object Name |
            ForEach-Object { $packageSummary += " - $($_.Name): $($_.Value)" }
    }
    catch {
        $packageSummary += "package.json could not be parsed."
    }
}

$notes = @"
SmartOps Final Milestone Snapshot
Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Confirmed state:
- Frontend foundation complete
- Backend auth mock server working
- Login works
- Dashboard works
- Inventory foundation works
- Warehouse/tasks foundation works
- Orders/procurement foundation works
- Reports foundation works
- AI assistant placeholder works
- CI/CD hardening starter files exist

Project root:
$projectRoot
"@

Write-Utf8NoBomFile -Path (Join-Path $reportsRoot "milestone-notes.txt") -Content $notes
Write-Utf8NoBomFile -Path (Join-Path $reportsRoot "package-summary.txt") -Content ($packageSummary -join [Environment]::NewLine)

cmd /c tree "$projectRoot\src" /F /A > (Join-Path $reportsRoot "src-tree.txt")

Write-Host ""
Write-Host "Final milestone snapshot saved successfully." -ForegroundColor Green
Write-Host "Snapshot folder: $snapshotRoot" -ForegroundColor Cyan