# Test Java Setup Script
# This script verifies that the Java configuration is working correctly

Write-Host "=== Testing Java Environment Setup ==="

# First, ensure JAVA_HOME is not set
if (Test-Path Env:\JAVA_HOME) {
    Remove-Item Env:\JAVA_HOME
    Write-Host "1. JAVA_HOME cleared"
} else {
    Write-Host "1. JAVA_HOME was not set"
}

# Source the Java setup script
Write-Host "2. Sourcing set-java-home.ps1..."
. .\set-java-home.ps1

# Verify JAVA_HOME is set
Write-Host "3. Verifying JAVA_HOME..."
if ($env:JAVA_HOME) {
    Write-Host "   ✓ JAVA_HOME is set to: $env:JAVA_HOME"
    
    # Verify the path exists
    if (Test-Path -Path $env:JAVA_HOME) {
        Write-Host "   ✓ JAVA_HOME path exists"
    } else {
        Write-Host "   ✗ JAVA_HOME path does not exist!"
    }
} else {
    Write-Host "   ✗ JAVA_HOME is not set!"
}

# Check Maven can use this JDK
Write-Host "4. Testing Maven with this JDK..."
mvn --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Maven is using the correct JDK"
} else {
    Write-Host "   ✗ Maven could not use this JDK"
}

Write-Host "=== Test Complete ==="