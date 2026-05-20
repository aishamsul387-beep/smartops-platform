$ErrorActionPreference = "Stop"

$frontendRoot = Split-Path -Parent $PSScriptRoot
$backendRoot  = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\smartops-supply-web\backend"
$controlRoot  = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\_smartops_control"
$timestamp    = Get-Date -Format "yyyyMMdd_HHmmss"
$reportRoot   = Join-Path $controlRoot "final_release_readiness_$timestamp"
$tempRoot     = Join-Path $reportRoot "temp"

function Ensure-Dir {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Write-TextFile {
    param(
        [string]$Path,
        [string]$Content
    )
    $dir = Split-Path -Parent $Path
    Ensure-Dir $dir
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Stop-ProcessesOnPort {
    param([int[]]$Ports)

    foreach ($port in $Ports) {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($connections) {
            $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($processId in $processIds) {
                try {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "Stopped process on port $port (PID $processId)" -ForegroundColor Yellow
                }
                catch {
                    Write-Host "Could not stop PID $processId on port $port" -ForegroundColor DarkYellow
                }
            }
        }
    }
}

function Reset-NextBuildCache {
    param([string]$ProjectRoot)

    $nextPath = Join-Path $ProjectRoot ".next"

    if (-not (Test-Path -LiteralPath $nextPath)) {
        Write-Host ".next folder not found. No cleanup needed." -ForegroundColor Green
        return
    }

    try {
        Remove-Item -LiteralPath $nextPath -Recurse -Force -ErrorAction Stop
        Write-Host ".next folder removed successfully." -ForegroundColor Green
        return
    }
    catch {
        Write-Host ".next could not be fully removed. Trying rename fallback..." -ForegroundColor Yellow
    }

    try {
        $renameLeaf = ".next_old_" + (Get-Date -Format "yyyyMMdd_HHmmss")
        Rename-Item -LiteralPath $nextPath -NewName $renameLeaf -ErrorAction Stop
        Write-Host ".next folder renamed successfully." -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to reset .next folder." -ForegroundColor Red
        throw
    }
}

function Run-NativeStep {
    param(
        [string]$Name,
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string]$Arguments
    )

    Write-Host ""
    Write-Host ">>> $Name" -ForegroundColor Yellow
    Write-Host "    Dir : $WorkingDirectory" -ForegroundColor DarkYellow
    Write-Host "    Cmd : $FilePath $Arguments" -ForegroundColor DarkYellow

    Ensure-Dir $tempRoot

    $safeName = ($Name -replace '[^a-zA-Z0-9_-]', '_')
    $stdoutPath = Join-Path $tempRoot "${safeName}_stdout.txt"
    $stderrPath = Join-Path $tempRoot "${safeName}_stderr.txt"

    if (Test-Path -LiteralPath $stdoutPath) { Remove-Item $stdoutPath -Force }
    if (Test-Path -LiteralPath $stderrPath) { Remove-Item $stderrPath -Force }

    $process = Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $WorkingDirectory `
        -NoNewWindow `
        -Wait `
        -PassThru `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath

    $stdout = if (Test-Path -LiteralPath $stdoutPath) { Get-Content -LiteralPath $stdoutPath -Raw } else { "" }
    $stderr = if (Test-Path -LiteralPath $stderrPath) { Get-Content -LiteralPath $stderrPath -Raw } else { "" }

    $combined = ($stdout + [Environment]::NewLine + $stderr).Trim()
    $status = if ($process.ExitCode -eq 0) { "PASS" } else { "FAIL" }

    if ($status -eq "FAIL") {
        Write-Host "Step failed: $Name" -ForegroundColor Red
        Write-Host "----- BEGIN FAILURE OUTPUT -----" -ForegroundColor Red
        Write-Host $combined -ForegroundColor Yellow
        Write-Host "----- END FAILURE OUTPUT -----" -ForegroundColor Red
    }

    [pscustomobject]@{
        Name = $Name
        WorkingDirectory = $WorkingDirectory
        Command = "$FilePath $Arguments"
        ExitCode = $process.ExitCode
        Status = $status
        Output = $combined
    }
}

function Test-HttpEndpoint {
    param(
        [string]$Name,
        [string]$Url
    )

    Write-Host ""
    Write-Host ">>> $Name" -ForegroundColor Yellow
    Write-Host "    Url : $Url" -ForegroundColor DarkYellow

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
        return [pscustomobject]@{
            Name = $Name
            WorkingDirectory = "-"
            Command = "GET $Url"
            ExitCode = 0
            Status = "PASS"
            Output = "StatusCode: $($response.StatusCode)"
        }
    }
    catch {
        return [pscustomobject]@{
            Name = $Name
            WorkingDirectory = "-"
            Command = "GET $Url"
            ExitCode = 1
            Status = "FAIL"
            Output = $_.Exception.Message
        }
    }
}

function Get-PackageSummary {
    param([string]$ProjectRoot)

    $packagePath = Join-Path $ProjectRoot "package.json"
    if (-not (Test-Path -LiteralPath $packagePath)) {
        return "package.json not found."
    }

    try {
        $pkg = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
        $lines = @()
        $lines += "Name    : $($pkg.name)"
        $lines += "Version : $($pkg.version)"
        $lines += "Private : $($pkg.private)"
        $lines += ""
        $lines += "Scripts:"
        if ($pkg.scripts) {
            $pkg.scripts.PSObject.Properties |
                Sort-Object Name |
                ForEach-Object { $lines += " - $($_.Name): $($_.Value)" }
        } else {
            $lines += " - none"
        }
        return ($lines -join [Environment]::NewLine)
    }
    catch {
        return "package.json exists but could not be parsed."
    }
}

Ensure-Dir $controlRoot
Ensure-Dir $reportRoot
Ensure-Dir $tempRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host " SMARTOPS FINAL RELEASE READINESS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host "Frontend root: $frontendRoot" -ForegroundColor Cyan
Write-Host "Backend root : $backendRoot" -ForegroundColor Cyan
Write-Host "Report root  : $reportRoot" -ForegroundColor Cyan
Write-Host ""

Write-Host "Preparing frontend build environment..." -ForegroundColor Cyan
Stop-ProcessesOnPort -Ports @(3000, 3001)
Reset-NextBuildCache -ProjectRoot $frontendRoot

$results = @()

$results += Run-NativeStep -Name "Frontend env validation" -WorkingDirectory $frontendRoot -FilePath "npm.cmd" -Arguments "run validate-env"
$results += Run-NativeStep -Name "Frontend typecheck" -WorkingDirectory $frontendRoot -FilePath "npm.cmd" -Arguments "run typecheck"
$results += Run-NativeStep -Name "Frontend build" -WorkingDirectory $frontendRoot -FilePath "npm.cmd" -Arguments "run build"

if (Test-Path -LiteralPath $backendRoot) {
    $results += Run-NativeStep -Name "Backend typecheck" -WorkingDirectory $backendRoot -FilePath "npm.cmd" -Arguments "run typecheck"
    $results += Run-NativeStep -Name "Backend build" -WorkingDirectory $backendRoot -FilePath "npm.cmd" -Arguments "run build"
} else {
    $results += [pscustomobject]@{
        Name = "Backend path exists"
        WorkingDirectory = $backendRoot
        Command = "-"
        ExitCode = 1
        Status = "FAIL"
        Output = "Backend root not found."
    }
}

$results += Test-HttpEndpoint -Name "Backend health endpoint" -Url "http://localhost:4000/api/health"
$results += Test-HttpEndpoint -Name "Backend demo accounts endpoint" -Url "http://localhost:4000/api/auth/demo-accounts"

$summaryLines = @()
$summaryLines += "SMARTOPS FINAL RELEASE READINESS REPORT"
$summaryLines += "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$summaryLines += "Frontend root: $frontendRoot"
$summaryLines += "Backend root : $backendRoot"
$summaryLines += ""
$summaryLines += "===== STEP RESULTS ====="

foreach ($item in $results) {
    $summaryLines += ""
    $summaryLines += "----------------------------------------"
    $summaryLines += "Name   : $($item.Name)"
    $summaryLines += "Status : $($item.Status)"
    $summaryLines += "Code   : $($item.ExitCode)"
    $summaryLines += "Dir    : $($item.WorkingDirectory)"
    $summaryLines += "Cmd    : $($item.Command)"
    $summaryLines += "Output :"
    $summaryLines += $item.Output
}

$summaryLines += ""
$summaryLines += "===== FRONTEND PACKAGE SUMMARY ====="
$summaryLines += Get-PackageSummary -ProjectRoot $frontendRoot
$summaryLines += ""
$summaryLines += "===== BACKEND PACKAGE SUMMARY ====="
$summaryLines += Get-PackageSummary -ProjectRoot $backendRoot

Write-TextFile -Path (Join-Path $reportRoot "release-readiness-report.txt") -Content ($summaryLines -join [Environment]::NewLine)
$results | Select-Object Name, Status, ExitCode, WorkingDirectory, Command |
    Export-Csv -Path (Join-Path $reportRoot "release-readiness-results.csv") -NoTypeInformation -Encoding UTF8

try {
    git -C $frontendRoot status --short > (Join-Path $reportRoot "frontend-git-status.txt")
} catch {}

try {
    git -C $backendRoot status --short > (Join-Path $reportRoot "backend-git-status.txt")
} catch {}

try { node -v > (Join-Path $reportRoot "node-version.txt") } catch {}
try { npm -v > (Join-Path $reportRoot "npm-version.txt") } catch {}

$failed = @($results | Where-Object { $_.Status -eq 'FAIL' })

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host " FINAL SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
$results | Select-Object Name, Status, ExitCode | Format-Table -AutoSize

Write-Host ""
Write-Host "Report folder: $reportRoot" -ForegroundColor Cyan

if ($failed.Count -gt 0) {
    Write-Host "Release readiness finished with failures." -ForegroundColor Yellow
    exit 1
}

Write-Host "Release readiness passed successfully." -ForegroundColor Green