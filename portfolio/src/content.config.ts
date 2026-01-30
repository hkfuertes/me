import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { GistLoader } from './utils/gist-loader';
import { GitHubProjectsLoader } from './utils/github-projects-loader';
import { GitHubContributionsLoader } from './utils/github-contributions-loader';
import { gists } from './data/gists.yaml';
import { with_readme, without_readme } from './data/projects.yaml';

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
    show_readme: z.boolean().optional(),
})

const contributionSchema = postSchema.extend({
    repo: z.string(),
    mergedAt: z.date().nullable(),
    additions: z.number().optional(),
    deletions: z.number().optional(),
    prNumber: z.number(),
    state: z.string().optional(),
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

// GitHub Projects collection (from YAML)
const githubReposCollection = defineCollection({
  loader: GitHubProjectsLoader({
    with_readme,
    without_readme,
  }),
  schema: githubSchema,
});

// New collection: GitHub Contributions (merged PRs to third-party repos)
const contributionsCollection = defineCollection({
  loader: GitHubContributionsLoader({
    username: 'hkfuertes',
  }),
  schema: contributionSchema,
});

export const collections = {
  blog: blogCollection,
  gists: gistsCollection,
  githubRepos: githubReposCollection,
  contributions: contributionsCollection,
};
