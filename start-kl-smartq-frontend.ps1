Write-Host "Starting kl-smartq frontend (from workspace)..."

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptRoot

if (Test-Path "..\kl-smartq") {
    Set-Location "..\kl-smartq"
    Write-Host "Installing dependencies (if needed) and starting dev server in ..\kl-smartq"
    npm install | Write-Host
    # Use npm run dev if available, otherwise npm start
    if (Test-Path package.json) {
        $pkg = Get-Content package.json | Out-String
        if ($pkg -match '"dev"') { npm run dev } else { npm start }
    } else {
        Write-Host "package.json not found in ..\kl-smartq"
    }
} else {
    Write-Host "kl-smartq folder not found at ..\kl-smartq"
}

Pop-Location
