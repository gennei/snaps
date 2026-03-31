import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const photoCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photos" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(["night", "city", "flowers", "snap"]),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    image: z.string(),
    thumbnail: z.string().optional()
  })
});

export const collections = {
  photos: photoCollection
};
