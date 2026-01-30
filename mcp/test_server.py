#!/usr/bin/env python3
"""
Simple test script for MCP server
"""

import asyncio
import httpx


async def test_server():
    """Test MCP server endpoints"""
    
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        # Test health endpoint
        print("Testing health endpoint...")
        response = await client.get(f"{base_url}/health")
        print(f"Health: {response.json()}")
        print()
        
        # Test root endpoint
        print("Testing root endpoint...")
        response = await client.get(f"{base_url}/")
        print(f"Root: {response.json()}")
        print()
        
        print("Server is running correctly!")
        print()
        print("To connect from Claude Desktop, add this to your configuration:")
        print("""
{
  "mcpServers": {
    "mfuertes-portfolio": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
""")


if __name__ == "__main__":
    asyncio.run(test_server())
