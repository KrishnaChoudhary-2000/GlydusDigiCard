Write-Host "🚀 Starting Glydus Digital Business Card Application..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Start backend server
Write-Host "📡 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start" -WindowStyle Normal

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "🌐 Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Application is starting up!" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 