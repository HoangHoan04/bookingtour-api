#!/bin/bash

# Script test Docker local trước khi deploy lên Railway

set -e

IMAGE_NAME="booking-tour-api-test"
CONTAINER_NAME="booking-tour-test"
PORT=4300

echo "======================================="
echo "Testing Docker Build Locally"
echo "======================================="

# Stop and remove old container if exists
echo -e "\n[1/5] Cleaning up old containers..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Build image
echo -e "\n[2/5] Building Docker image..."
docker build -t ${IMAGE_NAME}:latest .
echo "✅ Build successful!"

# Run container with env file
echo -e "\n[3/5] Starting container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p ${PORT}:4300 \
    --env-file .env \
    ${IMAGE_NAME}:latest

echo "✅ Container started!"

# Wait for app to start
echo -e "\n[4/5] Waiting for application to start..."
sleep 5

# Show logs
echo -e "\n[5/5] Container logs:"
docker logs $CONTAINER_NAME

# Test health endpoint
echo -e "\n======================================="
echo "Testing Health Endpoint"
echo "======================================="

sleep 2

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT}/health)

if [ $HTTP_CODE -eq 200 ]; then
    echo "✅ Health check passed!"
    curl -s http://localhost:${PORT}/health | jq .
else
    echo "❌ Health check failed! HTTP $HTTP_CODE"
    echo -e "\nContainer logs:"
    docker logs $CONTAINER_NAME
fi

# Show running info
echo -e "\n======================================="
echo "Container Information"
echo "======================================="
echo "Container Name: $CONTAINER_NAME"
echo "Port: http://localhost:${PORT}"
echo ""
echo "Test URLs:"
echo "  - Health: http://localhost:${PORT}/health"
echo "  - API Root: http://localhost:${PORT}/api"
echo "  - API Docs: http://localhost:${PORT}/api-docs"

echo -e "\nCommands:"
echo "  - View logs: docker logs -f $CONTAINER_NAME"
echo "  - Stop: docker stop $CONTAINER_NAME"
echo "  - Remove: docker rm $CONTAINER_NAME"
echo "  - Exec: docker exec -it $CONTAINER_NAME sh"

echo -e "\n======================================="
