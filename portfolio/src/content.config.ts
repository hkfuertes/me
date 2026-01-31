import { defineCollection, z } from 'astro:content';
import { GistLoader } from './utils/gist-loader';
import { GitHubProjectsLoader } from './utils/github-projects-loader';
import { GitHubContributionsLoader } from './utils/github-contributions-loader';
import { gists } from './data/gists.yaml';
import { with_readme, without_readme } from './data/projects.yaml';

// Base schema for all content types
const postSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    author: z.string().optional().default("Miguel Fuertes"),
    url: z.string().optional(),
    // GitHub-related fields
    stars: z.number().optional(),
    forks: z.number().optional(),
    language: z.string().optional(),
    showReadme: z.boolean().optional(),
    state: z.string().optional(),
})

// Contribution-specific fields
const contributionSchema = postSchema.extend({
    repo: z.string(),
    mergedAt: z.date().nullable(),
    additions: z.number().optional(),
    deletions: z.number().optional(),
    prNumber: z.number(),
})

const gistsCollection = defineCollection({
  loader: GistLoader({ 
    gists: gists
  }),
  schema: postSchema,
});

const githubReposCollection = defineCollection({
  loader: GitHubProjectsLoader({
    with_readme,
    without_readme,
  }),
  schema: postSchema,
});

const contributionsCollection = defineCollection({
  loader: GitHubContributionsLoader({
    username: 'hkfuertes',
  }),
  schema: contributionSchema,
});

export const collections = {
  gists: gistsCollection,
  githubRepos: githubReposCollection,
  contributions: contributionsCollection,
};
