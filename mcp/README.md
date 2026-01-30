# MCP Server - Miguel Fuertes Portfolio

Model Context Protocol server that exposes portfolio data to AI agents.

## What is MCP?

[Model Context Protocol](https://modelcontextprotocol.io/) is a standard that allows Large Language Models to connect to external data sources. This server enables AI agents like Claude to query information about Miguel's professional profile, projects, and technical expertise.

## Features

### Available Tools

1. **get_profile** - Retrieve professional profile, bio, and contact information
2. **get_tech_stack** - Get technical stack, skills, and areas of expertise
3. **get_experience** - Get work experience and professional background (optional company filter)
4. **get_projects** - Get featured projects and open source work (optional query filter)
5. **get_education** - Get educational background

### Data Sources

All data is loaded from `data.yaml` which includes:
- Profile information (bio, contact, headline)
- Work experience (companies, positions, highlights, tech stack)
- Technical skills (languages, frameworks, cloud, domains)
- Featured projects (GitHub repos, personal projects)
- Education (degrees, institutions)

## Installation & Deployment

### Development (Local)

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python server.py
```

### Production (Docker in LXC/Proxmox)

```bash
# Build image
docker build -t mfuertes-mcp .

# Run container
docker run -d \
  --name mfuertes-mcp \
  -p 8000:8000 \
  -v $(pwd)/data.yaml:/app/data.yaml:ro \
  --restart unless-stopped \
  mfuertes-mcp
```

### Docker Compose (Development)

From repository root:

```bash
# Start MCP server
docker compose up mcp -d

# View logs
docker compose logs mcp -f

# Stop server
docker compose down mcp
```

Server will be available at `http://localhost:8000`

## Usage

### Connect from Claude Desktop

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

#### For Local Development

```json
{
  "mcpServers": {
    "mfuertes-portfolio": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

#### For Production (LXC/Proxmox)

```json
{
  "mcpServers": {
    "mfuertes-portfolio": {
      "url": "http://YOUR_PROXMOX_IP:8000/mcp"
    }
  }
}
```

After updating the configuration, restart Claude Desktop for changes to take effect.

### Test the Server

```bash
# Health check
curl http://localhost:8000/health

# Server information
curl http://localhost:8000/
```

### Example Queries

Once connected, you can ask Claude:
- "What is Miguel Fuertes' background?"
- "What technologies does Miguel work with?"
- "Show me Miguel's experience at Gartner"
- "What projects has Miguel worked on related to embedded systems?"
- "What is Miguel's educational background?"
- "What is Miguel's contact information?"

## Project Structure

```
mcp/
├── server.py           # Main MCP server implementation
├── data.yaml          # Portfolio data (loaded at startup)
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── test_server.py     # Testing script
└── README.md          # This file
```

## API Endpoints

- `GET /` - Server information and instructions
- `GET /health` - Health check
- `POST /mcp` - MCP protocol endpoint (SSE)

## Environment Variables

None required. All configuration is in `data.yaml`.

## Development

### Adding New Tools

Edit `server.py`:

1. Add tool definition in `list_tools()`
2. Implement handler in `call_tool()`
3. Restart server

### Updating Data

Portfolio data is loaded from `data.yaml` at server startup. To update:

1. Edit `mcp/data.yaml`
2. Restart the server:
   - Local: `python server.py` (re-run)
   - Docker: `docker restart mfuertes-mcp`
   - Docker Compose: `docker compose restart mcp`

The data is extracted from the main CV file (`Miguel_Fuertes_CV.yaml`) and includes complete professional profile, experience, skills, projects, and education.

## License

MIT
