import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    slug: z.string(),
    pubDate: z.string().transform((str) => new Date(str)),
    updatedDate: z.string().transform((str) => new Date(str)).optional(),
    originalPubDate: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    heroImage: z.object({
      src: z.string(),
      alt: z.string().optional(),
    }).optional(),
    canonicalUrl: z.string().url().optional(),
  }),
});

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

export const collections = {
  posts,
  authors,
};
