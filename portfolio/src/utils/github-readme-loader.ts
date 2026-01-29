// src/utils/github-readme-loader.ts
import type { Loader } from 'astro/loaders';

interface GitHubProject {
    name: string;
    url?: string;
    summary?: string;
    start_date?: string;
    end_date?: string;
}

interface GitHubLoaderOptions {
    projects: GitHubProject[];
}

function extractUrlFromMarkdown(name: string): string | null {
    // Extract URL from markdown link format: [text](url)
    const match = name.match(/\[([^\]]+)\]\(([^)]+)\)/);
    return match ? match[2] : null;
}

function extractRepoInfo(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/i);
    if (!match) return null;
    
    return {
        owner: match[1],
        repo: match[2],
    };
}

export function GitHubReadmeLoader(options: GitHubLoaderOptions): Loader {
    return {
        name: 'github-readme-loader',
        load: async ({ store, logger, renderMarkdown }) => {
            // Filter projects that have GitHub URLs in their name
            const githubProjects = options.projects.map(p => {
                const url = p.url || extractUrlFromMarkdown(p.name);
                // Extract clean name from markdown link if present
                const nameMatch = p.name.match(/\[([^\]]+)\]/);
                const cleanName = nameMatch ? nameMatch[1] : p.name;
                
                return {
                    ...p,
                    url,
                    cleanName
                };
            }).filter(p => p.url?.includes('github.com'));
            
            logger.info(`Loading ${githubProjects.length} GitHub READMEs`);

            for (const project of githubProjects) {
                if (!project.url) continue;

                const repoInfo = extractRepoInfo(project.url);
                if (!repoInfo) {
                    logger.warn(`Could not extract repo info from URL: ${project.url}`);
                    continue;
                }

                const { owner, repo } = repoInfo;
                const id = `${owner}-${repo}`;

                try {
                    // GitHub API headers with optional token
                    const headers: HeadersInit = {
                        'Accept': 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28',
                    };
                    
                    // Add token if available (from environment)
                    const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }

                    // Fetch README metadata
                    const readmeResponse = await fetch(
                        `https://api.github.com/repos/${owner}/${repo}/readme`,
                        { headers }
                    );

                    if (!readmeResponse.ok) {
                        logger.warn(`Failed to fetch README for ${owner}/${repo}: ${readmeResponse.status}`);
                        continue;
                    }

                    const readmeData = await readmeResponse.json();

                    // Fetch raw content
                    const contentResponse = await fetch(readmeData.download_url);
                    if (!contentResponse.ok) {
                        logger.warn(`Failed to fetch README content for ${owner}/${repo}`);
                        continue;
                    }

                    const content = await contentResponse.text();
                    const rendered = await renderMarkdown(content);

                    // Fetch repo metadata for stars/description
                    const repoResponse = await fetch(
                        `https://api.github.com/repos/${owner}/${repo}`,
                        { headers }
                    );

                    let repoData: any = {};
                    if (repoResponse.ok) {
                        repoData = await repoResponse.json();
                    }

                    // Use project dates or repo creation date
                    let date = new Date(repoData.created_at || new Date());
                    if (project.start_date) {
                        date = new Date(project.start_date);
                    } else if (project.end_date) {
                        date = new Date(project.end_date);
                    }

                    store.set({
                        id,
                        data: {
                            title: project.cleanName || repoData.name || repo,
                            description: project.summary || repoData.description || '',
                            date,
                            updated: new Date(repoData.updated_at || repoData.pushed_at || date),
                            author: owner,
                            draft: false,
                            tags: repoData.topics || [],
                            url: project.url,
                            stars: repoData.stargazers_count || 0,
                            forks: repoData.forks_count || 0,
                            language: repoData.language || '',
                        },
                        rendered,
                    });

                    logger.info(`Loaded README: ${owner}/${repo}`);
                } catch (error) {
                    logger.error(`Error loading README for ${owner}/${repo}: ${error}`);
                }
            }
        },
    };
}
