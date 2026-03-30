# Gennei Snaps

`Gennei Snaps` is a maintenance-first personal photography site built with Astro and deployed to GitHub Pages.

## Maintenance-First Stack

- Astro for static site generation only
- Astro Content Collections for local structured photo metadata
- Plain CSS and small Astro components only
- Local image assets stored in the repository under `public/photos/`
- GitHub Actions for validation and deployment to GitHub Pages
- Custom domain via `public/CNAME`
- No database, CMS, SSR, API routes, authentication, comments, or frontend UI framework

## Photo Content Schema

Each photo entry is one Markdown file under `src/content/photos/`. The filename becomes the `slug`.

```md
---
title: Example Title
date: 2026-03-30
category: city
tags:
  - evening
  - station
description: Optional short summary
image: /photos/example/hero.jpg
thumbnail: /photos/example/thumb.jpg
---

Optional body copy for the detail page.
```

Fixed categories:

- `night`
- `city`
- `flowers`
- `snap`

## Directory Structure

```text
.
├── .github/workflows/deploy.yml
├── public/
│   ├── CNAME
│   ├── favicon.svg
│   └── photos/<slug>/
│       ├── hero.jpg
│       └── thumb.jpg
├── scripts/
│   └── validate-photos.mjs
├── src/
│   ├── components/
│   ├── content.config.ts
│   ├── content/photos/
│   ├── layouts/
│   ├── lib/
│   └── pages/
├── astro.config.mjs
└── package.json
```

Note: Astro expects `src/content.config.ts` at the `src/` root, so this project keeps that one file there instead of `src/content/config.ts`.

## Pages

- `/` Home
- `/gallery`
- `/about`
- `/photos/[slug]`

## Local Development

```bash
npm install
npm run dev
npm run check
npm run build
```

## Add A New Photo

1. Add optimized images to `public/photos/<slug>/thumb.jpg` and `public/photos/<slug>/hero.jpg`
2. Add `src/content/photos/<slug>.md`
3. Commit and push

## Image Guidance

- `thumb.jpg`: 800-1200px long edge, about 200KB-500KB
- `hero.jpg`: 1800-2400px long edge, about 1MB-3MB

The validation script checks:

- required frontmatter fields
- fixed category values
- referenced asset existence
- file size limits for `thumb.jpg` and `hero.jpg`

## Notes

The sample site currently uses placeholder SVG artwork so the repository stays fully bootstrapped without requiring binary image files. Replace them with your own optimized JPGs when adding real photos.
