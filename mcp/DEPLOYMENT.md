# MCP Server Deployment Guide

## Deployment to Proxmox LXC

### Prerequisites

- Proxmox server with LXC container
- Docker installed in the LXC container
- Network access to the LXC container

### Deployment Steps

#### 1. Prepare LXC Container

```bash
# Install Docker in your LXC container (if not installed)
apt update
apt install -y docker.io docker-compose
systemctl enable docker
systemctl start docker
```

#### 2. Deploy MCP Server

```bash
# Clone repository or copy the mcp directory to your LXC
cd /path/to/your/deployment

# Build Docker image
docker build -t mfuertes-mcp .

# Run container
docker run -d \
  --name mfuertes-mcp \
  -p 8000:8000 \
  -v $(pwd)/data.yaml:/app/data.yaml:ro \
  --restart unless-stopped \
  mfuertes-mcp

# Check logs
docker logs -f mfuertes-mcp
```

#### 3. Verify Deployment

```bash
# Health check
curl http://localhost:8000/health

# Server information
curl http://localhost:8000/
```

Should return:
```json
{"status":"healthy"}
```

### Configuration

#### Update Portfolio Data

To update the data served by the MCP server:

1. Edit `data.yaml` with new information
2. Restart the container:
   ```bash
   docker restart mfuertes-mcp
   ```

#### Firewall Rules (if needed)

If you need to access the MCP server from outside the LXC:

```bash
# Allow port 8000 on Proxmox host
iptables -A FORWARD -p tcp --dport 8000 -j ACCEPT
```

Or configure port forwarding in Proxmox web UI.

### Connect from Claude Desktop

Edit Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mfuertes-portfolio": {
      "url": "http://YOUR_LXC_IP:8000/sse"
    }
  }
}
```

Replace `YOUR_LXC_IP` with the actual IP address of your LXC container.

Restart Claude Desktop for changes to take effect.

### Test the Connection

Ask Claude:
- "What is Miguel Fuertes' background?"
- "What technologies does Miguel work with?"
- "Show me Miguel's experience at Gartner"
- "What projects has Miguel worked on related to embedded systems?"

## Monitoring

### Check Container Status

```bash
# Container status
docker ps -a | grep mfuertes-mcp

# Resource usage
docker stats mfuertes-mcp

# View logs
docker logs mfuertes-mcp --tail 100 -f
```

### Health Checks

Set up a cron job to monitor the server:

```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:8000/health || docker restart mfuertes-mcp
```

## Updating the Server

```bash
# Stop container
docker stop mfuertes-mcp

# Remove container
docker rm mfuertes-mcp

# Pull/update code
# (git pull or copy new files)

# Rebuild image
docker build -t mfuertes-mcp .

# Run new container
docker run -d \
  --name mfuertes-mcp \
  -p 8000:8000 \
  -v $(pwd)/data.yaml:/app/data.yaml:ro \
  --restart unless-stopped \
  mfuertes-mcp
```

## Troubleshooting

### Server not responding

```bash
# Check if container is running
docker ps -a | grep mfuertes-mcp

# Check logs for errors
docker logs mfuertes-mcp --tail 50

# Restart container
docker restart mfuertes-mcp
```

### Claude can't connect

- Verify the IP address in Claude Desktop config is correct
- Check that port 8000 is accessible from your machine
- Test with curl: `curl http://YOUR_LXC_IP:8000/health`
- Restart Claude Desktop after changing configuration
- Check firewall rules on Proxmox and LXC

### Port already in use

```bash
# Check what's using port 8000
lsof -i :8000

# Use a different port
docker run -d \
  --name mfuertes-mcp \
  -p 9000:8000 \
  -v $(pwd)/data.yaml:/app/data.yaml:ro \
  --restart unless-stopped \
  mfuertes-mcp
```

Then update Claude Desktop config to use port 9000.

## Backup

```bash
# Backup data.yaml
cp data.yaml data.yaml.backup

# Export Docker image
docker save mfuertes-mcp -o mfuertes-mcp.tar
```

## Security Considerations

- This server has no authentication (public access to portfolio data)
- If exposing to internet, consider:
  - Adding reverse proxy with SSL (nginx/traefik)
  - Rate limiting
  - API authentication if needed
  - VPN access only

## Performance

The server is lightweight:
- Memory: ~80MB
- CPU: Minimal (idle most of the time)
- No database required
- All data loaded in memory at startup

Suitable for running on low-resource LXC containers.
