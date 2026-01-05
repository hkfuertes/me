// src/loaders/gist-loader.ts
import type { Loader } from 'astro/loaders';

interface GistLoaderOptions {
  username: string;
}

export function GistLoader(options: GistLoaderOptions): Loader {
  return {
    name: 'gist-loader',
    load: async ({ store, logger }) => {
      logger.info(`Fetching gists for ${options.username}`);
      
      const response = await fetch(
        `https://api.github.com/users/${options.username}/gists`,
        {
          headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      const gists = await response.json();

      for (const gist of gists) {
        // Obtener el primer archivo markdown del gist
        const mdFile = Object.values(gist.files).find(
          (file: any) => file.filename.endsWith('.md')
        );

        if (mdFile) {
          store.set({
            id: gist.id,
            data: {
              title: gist.description || mdFile.filename,
              description: gist.description,
              date: new Date(gist.created_at),
              updated: new Date(gist.updated_at),
              content: mdFile.content,
              url: gist.html_url,
              author: gist.owner?.login,
            },
          });
        }
      }

      logger.info(`Loaded ${gists.length} gists`);
    },
  };
}
