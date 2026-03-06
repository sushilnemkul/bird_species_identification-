@echo off
echo Starting Bird Species Identification App...

echo Starting Backend Server...
start "Backend API" cmd /k "cd Backend && call ..\.venv\Scripts\activate.bat && python app.py"

echo Starting Frontend Application...
start "User Frontend" cmd /k "cd Frontend && npm run dev"

echo Starting Admin Panel...
start "Admin Portal" cmd /k "cd Admin && npm run dev"

echo All services are starting up in separate windows!
echo It may take a few seconds for all servers to be fully ready.
