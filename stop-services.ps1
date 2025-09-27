# Stop All Services Script
# This script stops any running Campus Beats services

Write-Host "=== Stopping Campus Beats Services ==="

# Stop Java processes (backend)
Write-Host "Stopping Java processes..."
Get-Process java -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process $_.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped Java process with ID: $($_.Id)"
}

# Stop Node processes (frontend and audio service)
Write-Host "Stopping Node processes..."
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process $_.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped Node process with ID: $($_.Id)"
}

# Stop Maven processes
Write-Host "Stopping Maven processes..."
Get-Process mvn -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process $_.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped Maven process with ID: $($_.Id)"
}

Write-Host "=== All services stopped ==="