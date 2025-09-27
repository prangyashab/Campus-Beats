# Check MySQL service status
Write-Host "Checking MySQL service status..."
try {
    $mysqlService = Get-Service -Name 'MySQL80' -ErrorAction Stop
    
    if ($mysqlService.Status -eq 'Running') {
        Write-Host "MySQL service is running."
        
        # Test MySQL connection
        Write-Host "Testing MySQL connection with credentials from application.yml..."
        # Create a temporary batch file to run the MySQL command
        $batchFile = "$PSScriptRoot\test-mysql.bat"
        @"
@echo off
mysql -u root -pSwaraj@0405 -e "SHOW DATABASES LIKE 'campus_beats';"
"@ | Out-File -FilePath $batchFile -Encoding ascii
        
        try {
            $result = & $batchFile
            
            if ($result -match 'campus_beats') {
                Write-Host "Success! The campus_beats database already exists."
            } else {
                Write-Host "The campus_beats database does not exist yet. The application will create it automatically when started."
            }
        } catch {
            Write-Host "Error connecting to MySQL: $_"
            Write-Host "Please verify your MySQL credentials in application.yml."
        } finally {
            # Clean up the temporary batch file
            if (Test-Path $batchFile) {
                Remove-Item $batchFile -Force
            }
        }
    } else {
        Write-Host "MySQL service is installed but not running."
        Write-Host "Please start the MySQL service manually."
    }
} catch {
    Write-Host "MySQL service is not installed or has a different name."
    Write-Host "Please start the MySQL service manually or install MySQL."
}