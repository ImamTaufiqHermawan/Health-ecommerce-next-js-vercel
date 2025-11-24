# Quick Start Script
# Run with: .\QUICK_START.ps1

Write-Host "Health E-Commerce - Quick Start" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Node.js $nodeVersion detected" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if .env.local exists
Write-Host ""
Write-Host "Checking environment file..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "[OK] .env.local exists" -ForegroundColor Green
} else {
    Write-Host "[WARN] .env.local not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "[OK] .env.local created. Please edit it with your credentials!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Required credentials:" -ForegroundColor Cyan
    Write-Host "  1. MongoDB Atlas connection string" -ForegroundColor White
    Write-Host "  2. Cloudinary credentials" -ForegroundColor White
    Write-Host "  3. Midtrans API keys" -ForegroundColor White
    Write-Host "  4. Google Gemini AI API key" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter after editing .env.local..." -ForegroundColor Yellow
    Read-Host
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host ""
Write-Host "Do you want to seed the database? (y/n)" -ForegroundColor Yellow
$seed = Read-Host
if ($seed -eq "y") {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database seeded" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Seeding failed. Check your MongoDB connection" -ForegroundColor Yellow
    }
}

# Start server
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will start at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:3000/api-docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
