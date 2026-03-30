import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const photosDir = path.join(rootDir, "src", "content", "photos");
const publicDir = path.join(rootDir, "public");

const allowedCategories = new Set(["night", "city", "flowers", "snap"]);
const maxThumbBytes = 500 * 1024;
const maxHeroBytes = 3 * 1024 * 1024;

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error("Frontmatter is missing.");
  }

  return match[1];
}

function readField(frontmatter, fieldName) {
  const regex = new RegExp(`^${fieldName}:\\s*(.+)$`, "m");
  const match = frontmatter.match(regex);
  return match?.[1]?.trim();
}

function readTags(frontmatter) {
  const match = frontmatter.match(/^tags:\n((?:\s+- .+\n?)*)/m);

  if (!match) {
    return [];
  }

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^- /, "").trim());
}

function validateFileSize(relativePath) {
  const filePath = path.join(publicDir, relativePath.replace(/^\//, ""));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Referenced file does not exist: ${relativePath}`);
  }

  const stats = fs.statSync(filePath);
  const baseName = path.basename(filePath);

  if (baseName === "thumb.jpg" && stats.size > maxThumbBytes) {
    throw new Error(`thumb.jpg is too large: ${relativePath}`);
  }

  if (baseName === "hero.jpg" && stats.size > maxHeroBytes) {
    throw new Error(`hero.jpg is too large: ${relativePath}`);
  }
}

const entries = fs.readdirSync(photosDir).filter((entry) => entry.endsWith(".md"));
const seenSlugs = new Set();

for (const entry of entries) {
  const slug = entry.replace(/\.md$/, "");
  const filePath = path.join(photosDir, entry);
  const raw = fs.readFileSync(filePath, "utf8");
  const frontmatter = parseFrontmatter(raw);
  const title = readField(frontmatter, "title");
  const date = readField(frontmatter, "date");
  const category = readField(frontmatter, "category");
  const image = readField(frontmatter, "image");
  const thumbnail = readField(frontmatter, "thumbnail");

  if (seenSlugs.has(slug)) {
    throw new Error(`Duplicate slug detected: ${slug}`);
  }
  seenSlugs.add(slug);

  if (!title) {
    throw new Error(`Missing title in ${entry}`);
  }

  if (!date || Number.isNaN(Date.parse(date))) {
    throw new Error(`Invalid date in ${entry}`);
  }

  if (!category || !allowedCategories.has(category)) {
    throw new Error(`Invalid category in ${entry}: ${category ?? "(missing)"}`);
  }

  if (!image) {
    throw new Error(`Missing image in ${entry}`);
  }

  validateFileSize(image);

  if (thumbnail) {
    validateFileSize(thumbnail);
  }

  for (const tag of readTags(frontmatter)) {
    if (!tag) {
      throw new Error(`Empty tag in ${entry}`);
    }
  }
}

console.log(`Validated ${entries.length} photo entries.`);
