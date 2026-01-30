#!/bin/bash
# Deploy MCP Server
# Usage: ./deploy.sh

set -e

echo "Building MCP Server Docker image..."
docker build -t mfuertes-mcp .

echo "Stopping existing container (if any)..."
docker stop mfuertes-mcp 2>/dev/null || true
docker rm mfuertes-mcp 2>/dev/null || true

echo "Starting MCP Server..."
docker run -d \
  --name mfuertes-mcp \
  -p 8000:8000 \
  -v $(pwd)/data.yaml:/app/data.yaml:ro \
  --restart unless-stopped \
  mfuertes-mcp

echo ""
echo "MCP Server deployed successfully!"
echo ""
echo "Health check:"
sleep 2
curl -s http://localhost:8000/health | jq || curl -s http://localhost:8000/health
echo ""
echo ""
echo "View logs with: docker logs -f mfuertes-mcp"
echo "Stop with: docker stop mfuertes-mcp"
echo ""
