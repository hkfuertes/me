import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ 
    pattern: '**/index.md',
    base: '/blog' //Mounted under /blog route in docker-compose
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    author: z.string().optional().default("Miguel Fuertes"),
  }),
});

export const collections = {
  blog: blogCollection,
};
