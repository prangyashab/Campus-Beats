# Set JAVA_HOME to the correct JDK installation path
# This script will be sourced by start-backend.ps1 to ensure consistent Java configuration
$JDK_PATH = 'C:\Program Files\Java\jdk-23'

# Verify the JDK path exists
if (Test-Path -Path $JDK_PATH) {
    $env:JAVA_HOME = $JDK_PATH
    Write-Host "JAVA_HOME set to: $env:JAVA_HOME"
    
    # Verify Maven can use this JDK
    mvn --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success: Maven is using the correct JDK."
    } else {
        Write-Host "Warning: Maven might not be able to use this JDK."
    }
} else {
    Write-Host "Error: JDK path not found at $JDK_PATH"
    Write-Host "Please install JDK 23 or update this script with the correct path."
}