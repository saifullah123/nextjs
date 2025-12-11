# Quick Fix Script for Login Error
# Run these commands one by one

Write-Host "🛠️  Fixing Supabase Connection Issue..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Please create a .env file with your Supabase credentials" -ForegroundColor Yellow
    Write-Host "   See env.example.txt for the correct format" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# Step 2: Check for required environment variables
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host "❌ DATABASE_URL not found in .env" -ForegroundColor Red
    exit 1
}
if ($envContent -notmatch "DIRECT_URL") {
    Write-Host "⚠️  DIRECT_URL not found in .env" -ForegroundColor Yellow
    Write-Host "   This is required for Supabase to work properly" -ForegroundColor Yellow
    Write-Host "   Please add it to your .env file (see env.example.txt)" -ForegroundColor Yellow
}

Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host ""

# Step 3: Regenerate Prisma Client
Write-Host "🔄 Regenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host "   Make sure the dev server is stopped (Ctrl+C)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "🚀 You can now run: npm run dev" -ForegroundColor Cyan
Write-Host "🔐 Login at: http://localhost:3000/admin/login" -ForegroundColor Cyan
Write-Host "   Email: admin@example.com" -ForegroundColor Gray
Write-Host "   Password: admin123" -ForegroundColor Gray
