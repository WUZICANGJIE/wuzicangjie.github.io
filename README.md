# Shaohan Sun - Personal Website

Source code for my personal website, hosted on GitHub Pages.

## Features

- **Multi-language**: English, Chinese, Japanese (SSG).
- **SEO & Performance**: Static HTML generation, minified assets, strict CSP.
- **Tech Stack**: Tailwind CSS v4, EJS, Node.js Build Script.
- **Automated VCF**: vCard files are automatically generated from configuration.

## Prerequisites

- Node.js **18+** and npm.
- Ensure `npm install` has been run before any build command (a local `node_modules/` folder is required).

## Project Structure

- `src/`
  - `data/`: Configuration (site info, translations, vCard).
  - `public/`: Static root files (robots.txt, CNAME, favicons).
  - `css/`: Tailwind CSS input.
  - `js/`: Client-side JavaScript.
  - `index.ejs`: Main HTML template.
- `assets/`: Static assets (images, icons).
- `scripts/`: Build scripts.
- `dist/`: Production build output (generated).

## Configuration

### Content & Translations
Edit `src/data/i18n.js` to update text content and vCard information for each language. VCF files for each locale are generated automatically during the build.

### Social & Site Settings
Edit `src/data/site.js` to manage social media links, icons, and the `baseUrl`/`siteUrl` values (critical for CSP and asset paths).

## Scripts

Run these from the repository root after installing dependencies:

```bash
npm run build:css  # Compile Tailwind CSS to assets/css/style.css (minified)
npm run build:js   # Minify client JS to assets/js/main.js
npm run build:html # Render & minify HTML into dist/
npm run build      # Run all of the above in sequence
npm run watch      # Watch Tailwind input.css and rebuild CSS on change
```

To preview locally after a full build, serve the `dist/` folder (for example with `npx serve dist`).

## Deployment

GitHub Actions automatically builds and deploys the `dist/` folder to GitHub Pages on push to `main`.
