# Script test Docker local trước khi deploy lên Railway

param(
    [string]$ImageName = "booking-tour-api-test",
    [string]$ContainerName = "booking-tour-test",
    [int]$Port = 4300
)

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Testing Docker Build Locally" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Stop and remove old container if exists
Write-Host "`n[1/5] Cleaning up old containers..." -ForegroundColor Yellow
docker stop $ContainerName 2>$null
docker rm $ContainerName 2>$null

# Build image
Write-Host "`n[2/5] Building Docker image..." -ForegroundColor Yellow
docker build -t ${ImageName}:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green

# Run container with env file
Write-Host "`n[3/5] Starting container..." -ForegroundColor Yellow
docker run -d `
    --name $ContainerName `
    -p ${Port}:4300 `
    --env-file .env `
    ${ImageName}:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Container started!" -ForegroundColor Green

# Wait for app to start
Write-Host "`n[4/5] Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Show logs
Write-Host "`n[5/5] Container logs:" -ForegroundColor Yellow
docker logs $ContainerName

# Test health endpoint
Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "Testing Health Endpoint" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

Start-Sleep -Seconds 2

try {
    $response = Invoke-RestMethod -Uri "http://localhost:${Port}/health" -Method Get
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "`nContainer logs:" -ForegroundColor Yellow
    docker logs $ContainerName
}

# Show running info
Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "Container Information" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Container Name: $ContainerName" -ForegroundColor White
Write-Host "Port: http://localhost:${Port}" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "Test URLs:" -ForegroundColor Yellow
Write-Host "  - Health: http://localhost:${Port}/health" -ForegroundColor Gray
Write-Host "  - API Root: http://localhost:${Port}/api" -ForegroundColor Gray
Write-Host "  - API Docs: http://localhost:${Port}/api-docs" -ForegroundColor Gray

Write-Host "`nCommands:" -ForegroundColor Yellow
Write-Host "  - View logs: docker logs -f $ContainerName" -ForegroundColor Gray
Write-Host "  - Stop: docker stop $ContainerName" -ForegroundColor Gray
Write-Host "  - Remove: docker rm $ContainerName" -ForegroundColor Gray
Write-Host "  - Exec: docker exec -it $ContainerName sh" -ForegroundColor Gray

Write-Host "`n=======================================" -ForegroundColor Cyan
