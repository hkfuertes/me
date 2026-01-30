// src/utils/github-contributions-loader.ts
import type { Loader } from 'astro/loaders';

interface GitHubPullRequest {
    id: number;
    number: number;
    title: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    merged_at: string;
    repository_url: string;
    user: {
        login: string;
    };
    additions: number;
    deletions: number;
}

interface GitHubSearchResponse {
    total_count: number;
    items: any[];
}

interface GitHubContributionsLoaderOptions {
    username: string;
}

export function GitHubContributionsLoader(options: GitHubContributionsLoaderOptions): Loader {
    const { username } = options;

    return {
        name: 'github-contributions-loader',
        load: async ({ store, logger }) => {
            logger.info(`Loading PRs (merged and open) for ${username}`);

            try {
                // GitHub API headers with optional token
                const headers: HeadersInit = {
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                };
                
                // Add token if available (from environment)
                const token = process.env.GITHUB_TOKEN;
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // Search for merged and open PRs by the user, excluding their own repos
                const searchQuery = `is:pr author:${username} -user:${username}`;
                const searchResponse = await fetch(
                    `https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}&sort=updated&order=desc&per_page=100`,
                    { headers }
                );

                if (!searchResponse.ok) {
                    logger.error(`Failed to search PRs: ${searchResponse.status}`);
                    return;
                }

                const searchData: GitHubSearchResponse = await searchResponse.json();
                logger.info(`Found ${searchData.total_count} PRs (merged and open)`);

                // Load each PR
                for (const pr of searchData.items) {
                    try {
                        // Extract repo info from repository_url
                        const repoUrlParts = pr.repository_url.split('/');
                        const repoOwner = repoUrlParts[repoUrlParts.length - 2];
                        const repoName = repoUrlParts[repoUrlParts.length - 1];
                        const repoFullName = `${repoOwner}/${repoName}`;

                        // Fetch full PR details to get additions/deletions and state
                        const prResponse = await fetch(
                            `https://api.github.com/repos/${repoFullName}/pulls/${pr.number}`,
                            { headers }
                        );

                        let additions = 0;
                        let deletions = 0;
                        let state = 'open';
                        let mergedAt = null;

                        if (prResponse.ok) {
                            const prData = await prResponse.json();
                            additions = prData.additions || 0;
                            deletions = prData.deletions || 0;
                            state = prData.merged ? 'merged' : prData.state;
                            mergedAt = prData.merged_at;
                        }

                        // Skip closed (but not merged) PRs
                        if (state === 'closed') {
                            logger.info(`Skipping closed PR: ${repoFullName}#${pr.number}`);
                            continue;
                        }

                        // Use PR URL as ID (sanitized)
                        const id = `contribution-${repoFullName.replace('/', '-')}-${pr.number}`;

                        store.set({
                            id,
                            data: {
                                title: pr.title,
                                description: repoFullName,
                                date: new Date(pr.created_at),
                                updated: new Date(pr.updated_at),
                                mergedAt: mergedAt ? new Date(mergedAt) : null,
                                author: username,
                                draft: false,
                                tags: ['contribution'],
                                url: pr.html_url,
                                repo: repoFullName,
                                additions,
                                deletions,
                                prNumber: pr.number,
                                state: state,
                            },
                        });

                        logger.info(`Loaded contribution: ${repoFullName}#${pr.number} (${state})`);
                    } catch (error) {
                        logger.error(`Error loading PR ${pr.number}: ${error}`);
                    }
                }
            } catch (error) {
                logger.error(`Error in GitHubContributionsLoader: ${error}`);
            }
        },
    };
}
