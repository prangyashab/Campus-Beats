# Java Setup Guide for Campus Beats Backend

This guide explains how to properly set up the Java environment for running the Campus Beats backend application.

## Requirements
- **Java Development Kit (JDK) 23** or compatible version
- Maven 3.9.9 or newer

> **Important:** A JDK (Java Development Kit) is required, not just a JRE (Java Runtime Environment). The backend needs a JDK for compilation.

## Setting up Java Environment

### Automatic Setup (Recommended)
The backend includes two scripts that handle the Java environment setup automatically:

1. `set-java-home.ps1` - Configures the JAVA_HOME environment variable to point to the correct JDK installation
2. `start-backend.ps1` - Uses the configuration from the first script and starts the Spring Boot application

To start the backend with proper Java configuration:
```powershell
# From the backend directory
.\start-backend.ps1
```

### Manual Setup (If Needed)
If you need to manually configure your Java environment:

1. **Find your JDK installation path**
   ```powershell
   # For Windows
   Get-ChildItem 'C:\Program Files' -Directory -Recurse | Where-Object {$_.FullName -like '*jdk*23*'} | Select-Object FullName
   ```

2. **Set JAVA_HOME environment variable**
   ```powershell
   # Temporarily for the current session
   $env:JAVA_HOME='C:\Program Files\Java\jdk-23'
   
   # To set it permanently (requires administrator privileges)
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-23', [System.EnvironmentVariableTarget]::Machine)
   ```

3. **Verify the setup**
   ```powershell
   mvn --version
   ```

   You should see output indicating it's using Java version 23.

## Troubleshooting Common Issues

### "No compiler is provided in this environment" Error
This error means you're using a JRE instead of a JDK. Install JDK 23 and update your JAVA_HOME to point to the JDK installation directory.

### "JAVA_HOME not set" Error
- Run `set-java-home.ps1` to set JAVA_HOME correctly
- Verify that the path in the script matches your actual JDK installation path
- If you've installed a different JDK version, update the path in `set-java-home.ps1`

### "Maven is not recognized" Error
- Ensure Maven is installed and added to your system PATH
- You can download Maven from https://maven.apache.org/download.cgi