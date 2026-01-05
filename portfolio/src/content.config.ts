import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { GistLoader } from './utils/gist-loader';
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

export const collections = {
  blog: blogCollection,
  gists: gistsCollection,
};
