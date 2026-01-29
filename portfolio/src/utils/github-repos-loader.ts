// src/utils/github-repos-loader.ts
import type { Loader } from 'astro/loaders';

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    fork: boolean;
    archived: boolean;
}

interface GitHubReposLoaderOptions {
    username: string;
    excludeForks?: boolean;
    excludeArchived?: boolean;
    minStars?: number;
}

export function GitHubReposLoader(options: GitHubReposLoaderOptions): Loader {
    const { 
        username, 
        excludeForks = true, 
        excludeArchived = true,
        minStars = 0 
    } = options;

    return {
        name: 'github-repos-loader',
        load: async ({ store, logger, renderMarkdown }) => {
            logger.info(`Loading public repos for ${username}`);

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

                // Fetch all public repos
                const reposResponse = await fetch(
                    `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`,
                    { headers }
                );

                if (!reposResponse.ok) {
                    logger.error(`Failed to fetch repos: ${reposResponse.status}`);
                    return;
                }

                const repos: GitHubRepo[] = await reposResponse.json();
                logger.info(`Found ${repos.length} public repos`);

                // Filter repos
                const filteredRepos = repos.filter(repo => {
                    if (excludeForks && repo.fork) return false;
                    if (excludeArchived && repo.archived) return false;
                    if (repo.stargazers_count < minStars) return false;
                    return true;
                });

                logger.info(`After filtering: ${filteredRepos.length} repos`);

                // Load each repo
                for (const repo of filteredRepos) {
                    try {
                        // Try to fetch README
                        let readmeContent = '';
                        let rendered = null;

                        try {
                            const readmeResponse = await fetch(
                                `https://api.github.com/repos/${repo.full_name}/readme`,
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
                            logger.warn(`No README for ${repo.full_name}`);
                        }

                        // Use repo name as ID (sanitized)
                        const id = `github-${repo.full_name.replace('/', '-')}`;

                        store.set({
                            id,
                            data: {
                                title: repo.name,
                                description: repo.description || '',
                                date: new Date(repo.created_at),
                                updated: new Date(repo.updated_at || repo.pushed_at),
                                author: username,
                                draft: false,
                                tags: repo.topics || [],
                                url: repo.html_url,
                                stars: repo.stargazers_count,
                                forks: repo.forks_count,
                                language: repo.language || '',
                            },
                            rendered: rendered || undefined,
                        });

                        logger.info(`Loaded repo: ${repo.full_name}`);
                    } catch (error) {
                        logger.error(`Error loading repo ${repo.full_name}: ${error}`);
                    }
                }
            } catch (error) {
                logger.error(`Error in GitHubReposLoader: ${error}`);
            }
        },
    };
}
