# Source the Java Home configuration script
# This ensures consistent Java configuration every time we start the backend
.".\set-java-home.ps1"

# Check if JAVA_HOME was successfully set
if (-not $env:JAVA_HOME) {
    Write-Host "Error: JAVA_HOME not set. Cannot start the backend."
    exit 1
}

# Start the Spring Boot application
Write-Host "Starting Campus Beats Backend using JAVA_HOME: $env:JAVA_HOME"
mvn spring-boot:run