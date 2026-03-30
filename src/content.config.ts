import { defineCollection, z } from "astro:content";

const photoCollection = defineCollection({
  type: "content",
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
