import { defineCollection, z } from 'astro:content';

// Única colección para blog posts (montada desde ./blog)
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),  // Imagen de portada en ./blog/post_name/banner.jpg
    author: z.string().optional().default("Miguel Fuertes"),
  }),
});

export const collections = {
  blog: blogCollection,  // ← ./blog/ → src/content/blog/
};
