import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load portfolio data from data.yaml
const dataPath = join(__dirname, "..", "data.yaml");
const portfolioData = yaml.load(readFileSync(dataPath, "utf-8")) as Record<
  string,
  any
>;

// Create MCP server
const server = new McpServer({
  name: "mfuertes-portfolio",
  version: "1.0.0",
});

// --- Tool: get_profile ---
server.tool(
  "get_profile",
  "Get Miguel Fuertes' professional profile, bio, and contact information",
  {},
  async () => {
    const profile = portfolioData.profile;
    const text = `# ${profile.name}
**${profile.title}**

${profile.bio}

## Contact
- Email: ${profile.email}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}
- Website: ${profile.website}
- Location: ${profile.location}
`;
    return { content: [{ type: "text", text }] };
  }
);

// --- Tool: get_tech_stack ---
server.tool(
  "get_tech_stack",
  "Get Miguel's technical stack, skills, and areas of expertise",
  {},
  async () => {
    const skills = portfolioData.skills;
    const languagesList = skills.languages
      .map((l: string) => `- ${l}`)
      .join("\n");
    const frameworksList = skills.frameworks
      .map((f: string) => `- ${f}`)
      .join("\n");
    const cloudList = skills.cloud_infrastructure
      .map((c: string) => `- ${c}`)
      .join("\n");
    const domainsList = skills.domains
      .map((d: string) => `- ${d}`)
      .join("\n");

    const text = `# Technical Stack & Skills

## Programming Languages
${languagesList}

## Frameworks & Tools
${frameworksList}

## Cloud & Infrastructure
${cloudList}

## Domain Expertise
${domainsList}
`;
    return { content: [{ type: "text", text }] };
  }
);

// --- Tool: get_experience ---
server.tool(
  "get_experience",
  "Get Miguel's work experience and professional background",
  { company: z.string().optional().describe("Optional company name to filter specific experience") },
  async ({ company }) => {
    const experiences = portfolioData.experience as any[];
    const companyFilter = (company ?? "").toLowerCase();

    const filtered = companyFilter
      ? experiences.filter((exp) =>
          exp.company.toLowerCase().includes(companyFilter)
        )
      : experiences;

    if (filtered.length === 0) {
      return {
        content: [
          { type: "text", text: "No experience found matching your query." },
        ],
      };
    }

    let text = "# Professional Experience\n\n";
    for (const exp of filtered) {
      text += `## ${exp.company} - ${exp.position}\n`;
      text += `**${exp.period}** | ${exp.location}\n\n`;
      text += `${exp.summary}\n\n`;
      text += `### Key Highlights\n`;
      for (const highlight of exp.highlights) {
        text += `- ${highlight}\n`;
      }
      text += `\n### Tech Stack\n`;
      for (const tech of exp.stack) {
        text += `- ${tech}\n`;
      }
      text += "\n";
    }

    return { content: [{ type: "text", text }] };
  }
);

// --- Tool: get_projects ---
server.tool(
  "get_projects",
  "Get Miguel's featured projects and open source work",
  { query: z.string().optional().describe("Optional search query to filter projects by name or description") },
  async ({ query }) => {
    const projects = portfolioData.featured_projects as any[];
    const q = (query ?? "").toLowerCase();

    const filtered = q
      ? projects.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description ?? "").toLowerCase().includes(q)
        )
      : projects;

    if (filtered.length === 0) {
      return {
        content: [
          { type: "text", text: "No projects found matching your query." },
        ],
      };
    }

    let text = "# Featured Projects\n\n";
    for (const project of filtered) {
      text += `## ${project.name}\n`;
      text += `${project.description ?? "No description"}\n\n`;
      text += `- URL: ${project.url}\n`;
      if (project.stars) text += `- Stars: ${project.stars}\n`;
      if (project.forks) text += `- Forks: ${project.forks}\n`;
      if (project.topics)
        text += `- Topics: ${project.topics.join(", ")}\n`;
      if (project.status) text += `- Status: ${project.status}\n`;
      if (project.period) text += `- Period: ${project.period}\n`;
      text += "\n";
    }

    return { content: [{ type: "text", text }] };
  }
);

// --- Tool: get_education ---
server.tool(
  "get_education",
  "Get Miguel's educational background",
  {},
  async () => {
    const education = portfolioData.education as any[];

    let text = "# Education\n\n";
    for (const edu of education) {
      text += `## ${edu.degree}\n`;
      text += `**${edu.institution}** | ${edu.period}\n`;
      text += `${edu.location}\n`;
      if (edu.note) text += `\n${edu.note}\n`;
      text += "\n";
    }

    return { content: [{ type: "text", text }] };
  }
);

// --- Express app for HTTP transport ---
const app = express();
const PORT = parseInt(process.env.PORT ?? "8000", 10);

// Track active transports for SSE sessions
const transports: Record<string, SSEServerTransport> = {};

app.get("/", (_req, res) => {
  res.json({
    name: "Miguel Fuertes Portfolio MCP Server",
    version: "1.0.0",
    mcp_endpoint: "/sse",
    documentation: "https://modelcontextprotocol.io/",
    instructions: "Connect your AI agent to /sse endpoint",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

// SSE endpoint – client connects here to receive events
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    delete transports[transport.sessionId];
  });

  await server.connect(transport);
});

// Messages endpoint – client POSTs MCP messages here
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];

  if (!transport) {
    res.status(400).json({ error: "Invalid or missing sessionId" });
    return;
  }

  await transport.handlePostMessage(req, res);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MCP server listening on http://0.0.0.0:${PORT}`);
  console.log(`  SSE endpoint: http://0.0.0.0:${PORT}/sse`);
  console.log(`  Messages endpoint: http://0.0.0.0:${PORT}/messages`);
});
