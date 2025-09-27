# Service Start Guide for Campus Beats

This guide explains how to easily start and stop all Campus Beats services (frontend, backend, and audio service).

## Quick Start

### 1. Start All Services

To start all services with a single command:

1. Open PowerShell as Administrator (right-click PowerShell and select "Run as administrator")
2. Navigate to the Campus Beats root directory:
   ```powershell
   cd c:/app/campus-beats
   ```
3. Run the start script:
   ```powershell
   .\start-all-services.ps1
   ```

This will:
- Open 3 separate PowerShell windows
- Start the frontend on port 5173
- Start the audio service on port 3001
- Start the backend on port 8081

### 2. Verify Services are Running

After starting the services, verify they're running by accessing:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend Health: [http://localhost:8081/health](http://localhost:8081/health)
- Audio Service Health: [http://localhost:3001/health](http://localhost:3001/health)

## Stopping Services

To stop all services:

1. Open PowerShell as Administrator
2. Navigate to the Campus Beats root directory:
   ```powershell
   cd c:/app/campus-beats
   ```
3. Run the stop script:
   ```powershell
   .\stop-services.ps1
   ```

## Manual Service Control

If you need to start/stop individual services:

### Frontend
```powershell
# Start
cd c:/app/campus-beats
npm install
npm run dev

# Stop
# Press Ctrl+C in the frontend terminal or use stop-services.ps1
```

### Audio Service
```powershell
# Start
cd c:/app/campus-beats/audio-service
npm install
npm run dev

# Stop
# Press Ctrl+C in the audio service terminal or use stop-services.ps1
```

### Backend
```powershell
# Start
cd c:/app/campus-beats/backend
.\start-backend.ps1

# Stop
# Press Ctrl+C in the backend terminal or use stop-services.ps1
```

## Troubleshooting

- If services don't start properly, check the respective PowerShell windows for error messages
- Ensure MySQL is running with the correct credentials (username: root, password: Swaraj@0405)
- For Java-related issues, refer to `backend/JAVA_SETUP_GUIDE.md`
- If ports are already in use, you may need to modify the configuration files for each service