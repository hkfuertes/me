import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { GistLoader } from './utils/gist-loader';
import { GitHubReadmeLoader } from './utils/github-readme-loader';
import { GitHubReposLoader } from './utils/github-repos-loader';
import { loadCV } from './utils/cv-loader';
import { gists } from '/blog/gists.yaml';

const postSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    author: z.string().optional().default("Miguel Fuertes"),
    url: z.string().optional(),
})

const githubSchema = postSchema.extend({
    stars: z.number().optional(),
    forks: z.number().optional(),
    language: z.string().optional(),
    updated: z.date().optional(),
})

const blogCollection = defineCollection({
  loader: glob({ 
    pattern: ['**/index.md', '*.md'],
    base: '/blog'
  }),
  schema: postSchema,
});

const gistsCollection = defineCollection({
  loader: GistLoader({ 
    gists: gists
  }),
  schema: postSchema,
});

const cvData = loadCV();
const githubCollection = defineCollection({
  loader: GitHubReadmeLoader({
    projects: cvData.cv.sections.projects || []
  }),
  schema: githubSchema,
});

// New collection: All public GitHub repos
const githubReposCollection = defineCollection({
  loader: GitHubReposLoader({
    username: 'hkfuertes',
    excludeForks: true,      // No mostrar forks
    excludeArchived: true,   // No mostrar archivados
    minStars: 0,             // Mínimo de estrellas
  }),
  schema: githubSchema,
});

export const collections = {
  blog: blogCollection,
  gists: gistsCollection,
  github: githubCollection,
  githubRepos: githubReposCollection,
};
