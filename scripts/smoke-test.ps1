$ErrorActionPreference = "Stop"

$frontendUrl = "http://localhost:3000"
$backendUrl = "http://localhost:4000/api"

$checks = @(
    @{ Name = "Frontend Login"; Url = "$frontendUrl/login" },
    @{ Name = "Frontend Dashboard"; Url = "$frontendUrl/dashboard" },
    @{ Name = "Frontend Inventory"; Url = "$frontendUrl/inventory" },
    @{ Name = "Frontend Warehouse"; Url = "$frontendUrl/warehouse" },
    @{ Name = "Frontend Orders"; Url = "$frontendUrl/orders" },
    @{ Name = "Frontend Reports"; Url = "$frontendUrl/reports" },
    @{ Name = "Frontend AI Assistant"; Url = "$frontendUrl/ai-assistant" },
    @{ Name = "Backend Health"; Url = "$backendUrl/health" },
    @{ Name = "Backend Demo Accounts"; Url = "$backendUrl/auth/demo-accounts" }
)

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host " SMARTOPS SMOKE TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host ""

$results = @()

foreach ($check in $checks) {
    try {
        $response = Invoke-WebRequest -Uri $check.Url -Method Get -UseBasicParsing -TimeoutSec 15
        $results += [pscustomobject]@{
            Name = $check.Name
            Url = $check.Url
            Status = "PASS"
            StatusCode = $response.StatusCode
        }
        Write-Host ("PASS  " + $check.Name + " -> " + $response.StatusCode + " -> " + $check.Url) -ForegroundColor Green
    }
    catch {
        $statusCode = $null
        try {
            $statusCode = $_.Exception.Response.StatusCode.value__
        } catch {
            $statusCode = "N/A"
        }

        $results += [pscustomobject]@{
            Name = $check.Name
            Url = $check.Url
            Status = "FAIL"
            StatusCode = $statusCode
        }
        Write-Host ("FAIL  " + $check.Name + " -> " + $statusCode + " -> " + $check.Url) -ForegroundColor Red
    }
}

$failed = $results | Where-Object { $_.Status -eq "FAIL" }

Write-Host ""
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host " SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
$results | Format-Table -AutoSize

if ($failed.Count -gt 0) {
    Write-Host ""
    Write-Host "Smoke test finished with failures." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Smoke test passed successfully." -ForegroundColor Green