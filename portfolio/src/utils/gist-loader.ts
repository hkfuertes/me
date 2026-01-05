// src/content/utils/gist-loader.ts
import type { Loader } from 'astro/loaders';

interface GistLoaderOptions {
    gists: string[];
}

function extractGistId(url: string): string | null {
    const match = url.match(/gist\.github\.com\/[^\/]+\/([a-f0-9]+)/i);
    return match ? match[1] : null;
}

export function GistLoader(options: GistLoaderOptions): Loader {
    return {
        name: 'gist-loader',
        load: async ({ store, logger, renderMarkdown }) => {
            logger.info(`Loading ${options.gists.length} gists`);

            for (const gistUrl of options.gists) {
                const gistId = extractGistId(gistUrl);
                
                if (!gistId) {
                    logger.warn(`Could not extract ID from URL: ${gistUrl}`);
                    continue;
                }

                try {
                    const response = await fetch(
                        `https://api.github.com/gists/${gistId}`,
                        {
                            headers: {
                                'Accept': 'application/vnd.github+json',
                                'X-GitHub-Api-Version': '2022-11-28',
                            },
                        }
                    );

                    if (!response.ok) {
                        logger.warn(`Failed to fetch gist ${gistId}: ${response.status}`);
                        continue;
                    }

                    const gist = await response.json();

                    const mdFile = Object.values(gist.files).find(
                        (file: any) => file.filename.endsWith('.md')
                    ) as { filename: string; content?: string; raw_url: string; truncated?: boolean } | undefined;

                    if (mdFile) {
                        let content = mdFile.content || '';
                        
                        if (mdFile.truncated || !mdFile.content) {
                            const rawResponse = await fetch(mdFile.raw_url);
                            content = await rawResponse.text();
                        }

                        const rendered = await renderMarkdown(content);

                        store.set({
                            id: gist.id,
                            data: {
                                title: gist.description || mdFile.filename,
                                description: gist.description,
                                date: new Date(gist.created_at),
                                updated: new Date(gist.updated_at),
                                author: gist.owner?.login || 'Unknown',
                                image: undefined,
                                draft: false,
                                tags: [],
                                url: gist.html_url,
                            },
                            rendered,
                        });

                        logger.info(`Loaded gist: ${gistId}`);
                    } else {
                        logger.warn(`No markdown file found in gist ${gistId}`);
                    }
                } catch (error) {
                    logger.error(`Error loading gist ${gistId}: ${error}`);
                }
            }
        },
    };
}
