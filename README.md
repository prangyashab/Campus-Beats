# Campus Beats - Music Streaming Platform

A modern music streaming platform designed for university students with real-time features and social listening experiences.

## Current Status

✅ **Frontend**: Fully functional with offline mode support  
✅ **Backend**: Ready to run with proper Java setup
✅ **Audio Service**: Configured and ready to use
✅ **Documentation**: Complete with setup guides
✅ **Repository**: Successfully pushed to GitHub

## System Requirements

- **Frontend**: Node.js 16+ and npm
- **Backend**: Java Development Kit (JDK) 23, Maven 3.9.9+, MySQL 8.0
- **Audio Service**: Node.js 16+

## Quick Start (Frontend Only)

The application currently runs in **offline mode** with sample data when the backend is not available:

```bash
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) to view the application.

## Features Available in Offline Mode

- ✅ Music player with sample tracks
- ✅ User interface and navigation
- ✅ Playlist management (local)
- ✅ Focus timer functionality
- ✅ Responsive design
- ⚠️ Real-time features disabled (requires backend)

## Backend Setup and Running

To run the full application with backend support:

1. **Install dependencies**
   - Follow the instructions in `backend/JAVA_SETUP_GUIDE.md` to properly configure your Java environment
   - Ensure MySQL 8.0 is installed with the `root` user and password `Swaraj@0405`

2. **Start all services**
   
   ```bash
   # Frontend (from root directory)
   npm install
   npm run dev
   
   # Audio Service (from audio-service directory)
   cd audio-service
   npm install
   npm run dev
   
   # Backend (from backend directory)
   cd backend
   .\start-backend.ps1  # This will automatically configure JAVA_HOME and start the backend
   ```

3. **Verify all services are running**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend Health: [http://localhost:8081/health](http://localhost:8081/health)
   - Audio Service Health: [http://localhost:3001/health](http://localhost:3001/health)

## Troubleshooting

**"Backend connection failed" message:**
- This is normal when running frontend-only
- The app automatically falls back to sample data
- Start the backend server to enable full functionality

**API request errors in console:**
- Expected behavior when backend is not running
- Application gracefully handles these errors
- No impact on frontend functionality
