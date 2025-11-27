<#
Starts the Campus-Beats backend (auth server) so the `kl-smartq` frontend
can connect to it during local development.

Usage:
  - From PowerShell run: .\start-kl-smartq-backend.ps1
  - This script changes directory to the repo's `backend` folder and runs the
    existing `start-backend.ps1` which sets JAVA_HOME and starts the Spring app.
#>

Write-Host "Starting Campus-Beats backend for kl-smartq..."

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptRoot

if (Test-Path .\backend\start-backend.ps1) {
    Set-Location .\backend
    # Use the existing start script so JAVA_HOME is configured consistently
    .\start-backend.ps1
} else {
    Write-Host "Error: backend start script not found at './backend/start-backend.ps1'"
    Write-Host "Please ensure this repository contains the 'backend' folder and try again."
}

Pop-Location
