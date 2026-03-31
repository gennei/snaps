import { getCollection } from "astro:content";

export type PhotoCategory = "night" | "city" | "flowers" | "snap";

export const categoryLabels: Record<PhotoCategory, string> = {
  night: "Night",
  city: "City",
  flowers: "Flowers",
  snap: "Snap"
};

export async function getPhotos() {
  const photos = await getCollection("photos");

  return photos.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export async function getRecentPhotos(limit = 6) {
  const photos = await getPhotos();
  return photos.slice(0, limit);
}

export function basePath() {
  return import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
}

export function withBase(path: string) {
  return `${basePath()}${path.replace(/^\//, "")}`;
}

export function formatPhotoDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
