#!/usr/bin/env python3
"""
MCP Server for Miguel Fuertes Portfolio
Exposes profile, projects, and blog content via Model Context Protocol
"""

import asyncio
import json
from typing import Any
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from mcp.types import Tool, TextContent, CallToolResult
import yaml


# Initialize MCP Server
mcp_server = Server("mfuertes-portfolio")

# Portfolio data loaded from YAML
_portfolio_data: dict[str, Any] = {}


def load_portfolio_data():
    """Load portfolio data from data.yaml"""
    global _portfolio_data
    
    data_file = Path(__file__).parent / "data.yaml"
    with open(data_file, "r") as f:
        _portfolio_data = yaml.safe_load(f)
    
    return _portfolio_data


def get_portfolio_data():
    """Get cached portfolio data"""
    if not _portfolio_data:
        load_portfolio_data()
    return _portfolio_data


# Define MCP Tools
@mcp_server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools"""
    return [
        Tool(
            name="get_profile",
            description="Get Miguel Fuertes' professional profile, bio, and contact information",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        Tool(
            name="get_tech_stack",
            description="Get Miguel's technical stack, skills, and areas of expertise",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        Tool(
            name="get_experience",
            description="Get Miguel's work experience and professional background",
            inputSchema={
                "type": "object",
                "properties": {
                    "company": {
                        "type": "string",
                        "description": "Optional company name to filter specific experience"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="get_projects",
            description="Get Miguel's featured projects and open source work",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Optional search query to filter projects by name or description"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="get_education",
            description="Get Miguel's educational background",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        )
    ]


@mcp_server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    data = get_portfolio_data()
    
    if name == "get_profile":
        profile = data["profile"]
        
        result = f"""# {profile['name']}
**{profile['title']}**

{profile['bio']}

## Contact
- Email: {profile['email']}
- GitHub: {profile['github']}
- LinkedIn: {profile['linkedin']}
- Website: {profile['website']}
- Location: {profile['location']}
"""
        return [TextContent(type="text", text=result)]
    
    elif name == "get_tech_stack":
        skills = data["skills"]
        
        languages_list = "\n".join(f"- {lang}" for lang in skills["languages"])
        frameworks_list = "\n".join(f"- {fw}" for fw in skills["frameworks"])
        cloud_list = "\n".join(f"- {tech}" for tech in skills["cloud_infrastructure"])
        domains_list = "\n".join(f"- {domain}" for domain in skills["domains"])
        
        result = f"""# Technical Stack & Skills

## Programming Languages
{languages_list}

## Frameworks & Tools
{frameworks_list}

## Cloud & Infrastructure
{cloud_list}

## Domain Expertise
{domains_list}
"""
        return [TextContent(type="text", text=result)]
    
    elif name == "get_experience":
        experiences = data["experience"]
        company_filter = arguments.get("company", "").lower()
        
        if company_filter:
            filtered = [exp for exp in experiences if company_filter in exp["company"].lower()]
        else:
            filtered = experiences
        
        if not filtered:
            return [TextContent(type="text", text="No experience found matching your query.")]
        
        result = "# Professional Experience\n\n"
        for exp in filtered:
            result += f"""## {exp['company']} - {exp['position']}
**{exp['period']}** | {exp['location']}

{exp['summary']}

### Key Highlights
"""
            for highlight in exp['highlights']:
                result += f"- {highlight}\n"
            
            result += f"\n### Tech Stack\n"
            for tech in exp['stack']:
                result += f"- {tech}\n"
            result += "\n"
        
        return [TextContent(type="text", text=result)]
    
    elif name == "get_projects":
        projects = data["featured_projects"]
        query = arguments.get("query", "").lower()
        
        if query:
            filtered = [
                p for p in projects
                if query in p["name"].lower() or query in p.get("description", "").lower()
            ]
        else:
            filtered = projects
        
        if not filtered:
            return [TextContent(type="text", text="No projects found matching your query.")]
        
        result = "# Featured Projects\n\n"
        for project in filtered:
            result += f"""## {project['name']}
{project.get('description', 'No description')}

- URL: {project['url']}
"""
            if project.get('stars'):
                result += f"- Stars: {project['stars']}\n"
            if project.get('forks'):
                result += f"- Forks: {project['forks']}\n"
            if project.get('topics'):
                result += f"- Topics: {', '.join(project['topics'])}\n"
            if project.get('status'):
                result += f"- Status: {project['status']}\n"
            if project.get('period'):
                result += f"- Period: {project['period']}\n"
            
            result += "\n"
        
        return [TextContent(type="text", text=result)]
    
    elif name == "get_education":
        education = data["education"]
        
        result = "# Education\n\n"
        for edu in education:
            result += f"""## {edu['degree']}
**{edu['institution']}** | {edu['period']}
{edu['location']}
"""
            if edu.get('note'):
                result += f"\n{edu['note']}\n"
            result += "\n"
        
        return [TextContent(type="text", text=result)]
    
    else:
        raise ValueError(f"Unknown tool: {name}")


# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan"""
    # Startup - load portfolio data
    load_portfolio_data()
    yield
    # Shutdown
    pass


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    """Root endpoint with instructions"""
    return {
        "name": "Miguel Fuertes Portfolio MCP Server",
        "version": "1.0.0",
        "mcp_endpoint": "/mcp",
        "documentation": "https://modelcontextprotocol.io/",
        "instructions": "Connect your AI agent to /mcp endpoint"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/mcp")
async def handle_sse(request: Request):
    """SSE endpoint for MCP protocol"""
    
    async def event_generator():
        transport = SseServerTransport("/mcp")
        
        async with mcp_server.run(
            transport.read_stream,
            transport.write_stream,
            mcp_server.create_initialization_options()
        ):
            # Read from request and write to transport
            async for line in request.stream():
                await transport.handle_post_message(line)
                
                # Send events back
                async for event in transport.sse():
                    yield event
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
