# 03 — Local Runbook

## PowerShell Launcher
Use a fresh PowerShell window and run the launcher script below to open Backend server, Frontend server, and work tabs/windows.

```powershell
$Host.UI.RawUI.WindowTitle = "SMARTOPS TAB LAUNCHER"

function Resolve-FirstExistingPath {
    param([string[]]$Candidates)

    foreach ($candidate in $Candidates) {
        if (-not [string]::IsNullOrWhiteSpace($candidate) -and (Test-Path -LiteralPath $candidate)) {
            try {
                return (Resolve-Path -LiteralPath $candidate).Path
            } catch {}
        }
    }

    return $null
}

function Read-BasePathFallback {
    while ($true) {
        $inputPath = Read-Host "Enter SmartOps mobile-app base path (example: C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app)"
        if ([string]::IsNullOrWhiteSpace($inputPath)) {
            Write-Host "Path cannot be empty." -ForegroundColor Yellow
            continue
        }

        $inputPath = $inputPath.Trim().Trim('"')

        if (-not (Test-Path -LiteralPath $inputPath)) {
            Write-Host "Path not found: $inputPath" -ForegroundColor Red
            continue
        }

        try {
            return (Resolve-Path -LiteralPath $inputPath).Path
        } catch {
            Write-Host "Could not resolve path: $inputPath" -ForegroundColor Red
        }
    }
}

function Open-TabCommand {
    param(
        [string]$Title,
        [string]$Path
    )

    $escapedPath = $Path.Replace("'", "''")

    return "Set-Location -LiteralPath '$escapedPath'; `$Host.UI.RawUI.WindowTitle = '$Title'; Clear-Host; Write-Host '$Title READY' -ForegroundColor Green; Write-Host ('Current folder: ' + (Get-Location).Path) -ForegroundColor Cyan"
}

$baseCandidates = @(
    "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app",
    "C:\Users\HP\OneDrive - Personal\Desktop\SmartOpsAI\mobile-app",
    "C:\Users\HP\Desktop\SmartOpsAI\mobile-app"
)

$projectBase = Resolve-FirstExistingPath -Candidates $baseCandidates

if (-not $projectBase) {
    $projectBase = Read-BasePathFallback
}

$frontendPath = Join-Path $projectBase "smartops-platform"
$backendPath  = Join-Path $projectBase "smartops-supply-web\backend"
$workPath     = $frontendPath

foreach ($path in @($frontendPath, $backendPath, $workPath)) {
    if (-not (Test-Path -LiteralPath $path)) {
        Write-Host "Required path not found: $path" -ForegroundColor Red
        exit 1
    }
}

$backendCmd  = Open-TabCommand -Title "Backend server"  -Path $backendPath
$frontendCmd = Open-TabCommand -Title "Frontend server" -Path $frontendPath
$workCmd     = Open-TabCommand -Title "work"            -Path $workPath

if (Get-Command wt -ErrorAction SilentlyContinue) {
    wt new-tab --title "Backend server" -d $backendPath powershell -NoExit -Command $backendCmd ; new-tab --title "Frontend server" -d $frontendPath powershell -NoExit -Command $frontendCmd ; new-tab --title "work" -d $workPath powershell -NoExit -Command $workCmd
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $workCmd
}

Write-Host ""
Write-Host "Opened SmartOps terminals." -ForegroundColor Green
Write-Host "Backend : $backendPath" -ForegroundColor Cyan
Write-Host "Frontend: $frontendPath" -ForegroundColor Cyan
Write-Host "Work    : $workPath" -ForegroundColor Cyan
```

## Frontend Local Commands
```powershell
Set-Location "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\smartops-platform"
npm install
npm run validate-env
npm run typecheck
npm run dev
```

## Backend Local Commands
```powershell
Set-Location "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\smartops-supply-web\backend"
npm install
npm run validate-env
npm run typecheck
npm run dev
```

## Demo Admin Login
- Email: admin@smartops.local
- Password: password123

## Main Local URLs
- Frontend: http://localhost:3000
- Frontend Login: http://localhost:3000/login
- Frontend Dashboard: http://localhost:3000/dashboard
- Backend Health: http://localhost:4000/api/health
- Backend Demo Accounts: http://localhost:4000/api/auth/demo-accounts
