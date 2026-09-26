# Recipe Browser

A personal recipe search & library app built with React and [Vite](https://vitejs.dev/), backed by
[recipeapi.io](https://recipeapi.io). Dark-mode UI, deployable as a static site to GitHub Pages.

## Features

- **Search** — search recipes by name (optionally including descriptions), filter by cuisine,
  diet/health tag, and a checklist of common ingredients. 10 results per page.
- **Recipe view** — full ingredient list and steps, each toggleable with a checkmark (progress is
  remembered per recipe via `localStorage`).
- **Library** — save/remove recipes, export the library to a JSON file, and re-import it later
  (import overwrites the current library). Persisted in `localStorage`.
- **Settings** — store your Recipe API key locally (never sent anywhere but recipeapi.io).

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL, go to **Settings**, and paste in a Recipe API key
(get one free at https://recipeapi.io/register).

## Building

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the app
and publishes `dist/` to GitHub Pages automatically on every push to `main`.

To enable it on your own repo:

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab). The site will be
   published at `https://<your-username>.github.io/<repo-name>/`.

No build configuration changes are needed for different repo names — the app uses a relative Vite
`base` and `HashRouter`, so it works whether it's served from the root of a domain or a
`/<repo-name>/` subpath.

## Notes on the API

- The Free plan on recipeapi.io allows 500 requests/month and caps `per_page` at 10 (which matches
  this app's fixed page size).
- The API only exposes a single `dietary_tags` filter (vegetarian, vegan, gluten_free, dairy_free,
  nut_free, halal, kosher) — this app's "Diet / health" dropdown maps to that one filter.
- The "common ingredients" filter is a fixed, curated list (not fetched from the API) that gets
  passed to the API's `ingredients` query parameter.
