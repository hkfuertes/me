// src/utils/github-projects-loader.ts
import type { Loader } from 'astro/loaders';

interface GitHubProjectsLoaderOptions {
    projects: string[];
}

function extractRepoInfo(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
        return { owner: match[1], repo: match[2] };
    }
    return null;
}

export function GitHubProjectsLoader(options: GitHubProjectsLoaderOptions): Loader {
    return {
        name: 'github-projects-loader',
        load: async ({ store, logger, renderMarkdown }) => {
            logger.info(`Loading ${options.projects.length} GitHub projects`);

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

            for (const projectUrl of options.projects) {
                const repoInfo = extractRepoInfo(projectUrl);
                
                if (!repoInfo) {
                    logger.warn(`Could not extract repo info from URL: ${projectUrl}`);
                    continue;
                }

                const { owner, repo } = repoInfo;
                const fullName = `${owner}/${repo}`;

                try {
                    // Fetch repository info
                    const repoResponse = await fetch(
                        `https://api.github.com/repos/${fullName}`,
                        { headers }
                    );

                    if (!repoResponse.ok) {
                        logger.warn(`Failed to fetch repo ${fullName}: ${repoResponse.status}`);
                        continue;
                    }

                    const repoData = await repoResponse.json();

                    // Try to fetch README
                    let readmeContent = '';
                    let rendered = null;

                    try {
                        const readmeResponse = await fetch(
                            `https://api.github.com/repos/${fullName}/readme`,
                            { headers }
                        );

                        if (readmeResponse.ok) {
                            const readmeData = await readmeResponse.json();
                            const contentResponse = await fetch(readmeData.download_url);
                            
                            if (contentResponse.ok) {
                                readmeContent = await contentResponse.text();
                                rendered = await renderMarkdown(readmeContent);
                            }
                        }
                    } catch (error) {
                        logger.warn(`No README for ${fullName}`);
                    }

                    // Use repo name as ID (sanitized)
                    const id = `github-${fullName.replace('/', '-')}`;

                    store.set({
                        id,
                        data: {
                            title: repoData.name,
                            description: repoData.description || '',
                            date: new Date(repoData.created_at),
                            updated: new Date(repoData.updated_at || repoData.pushed_at),
                            author: owner,
                            draft: false,
                            tags: repoData.topics || [],
                            url: repoData.html_url,
                            stars: repoData.stargazers_count,
                            forks: repoData.forks_count,
                            language: repoData.language || '',
                        },
                        rendered: rendered || undefined,
                    });

                    logger.info(`Loaded project: ${fullName}`);
                } catch (error) {
                    logger.error(`Error loading project ${fullName}: ${error}`);
                }
            }
        },
    };
}
