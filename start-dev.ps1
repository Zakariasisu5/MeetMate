# MeetMate Development Startup Script
Write-Host "🚀 Starting MeetMate Development Environment..." -ForegroundColor Green

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green

# Go back to root directory
Set-Location ..

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green

Write-Host "🔧 Starting development servers..." -ForegroundColor Yellow
Write-Host "📝 Make sure to set up your environment variables:" -ForegroundColor Cyan
Write-Host "   - Copy backend/env.example to backend/.env" -ForegroundColor Cyan
Write-Host "   - Fill in your Firebase and Sensay AI credentials" -ForegroundColor Cyan
Write-Host "   - Set VITE_API_URL in your frontend .env file" -ForegroundColor Cyan

# Start backend server in background
Write-Host "🔗 Starting backend server on http://localhost:3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🌐 Starting frontend server on http://localhost:5173..." -ForegroundColor Green
npm run dev
