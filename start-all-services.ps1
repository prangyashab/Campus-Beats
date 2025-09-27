# Start All Services Script
# This script starts the frontend, backend, and audio service for Campus Beats

# Requirements:
# - Node.js 16+ and npm (for frontend and audio service)
# - Java Development Kit (JDK) 23 and Maven (for backend)
# - MySQL 8.0 (running with root user and password 'Swaraj@0405')

Write-Host "=== Starting Campus Beats Services ==="
Write-Host "This script will start all three services in separate PowerShell windows."
Write-Host "Press Ctrl+C in any window to stop individual services."
Write-Host ""

# Start Frontend
Write-Host "1. Starting Frontend (React)..."
Start-Process powershell -ArgumentList "-Command cd c:/app/campus-beats; npm install; npm run dev"
Start-Sleep -Seconds 2

# Start Audio Service
Write-Host "2. Starting Audio Service..."
Start-Process powershell -ArgumentList "-Command cd c:/app/campus-beats/audio-service; npm install; npm run dev"
Start-Sleep -Seconds 2

# Start Backend
Write-Host "3. Starting Backend (Spring Boot)..."
Start-Process powershell -ArgumentList "-Command cd c:/app/campus-beats/backend; .\start-backend.ps1"

Write-Host ""
Write-Host "=== Services are starting ==="
Write-Host "- Frontend will be available at: http://localhost:5173"
Write-Host "- Backend health check: http://localhost:8081/health"
Write-Host "- Audio service health check: http://localhost:3001/health"
Write-Host ""
Write-Host "Wait a few moments for all services to fully start."
Write-Host "You can monitor each service's status in their respective PowerShell windows."