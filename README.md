# Shaohan Sun - Personal Website

Source code for my personal website, hosted on GitHub Pages.

## Features

- **Multi-language**: English, Chinese, Japanese (SSG).
- **SEO & Performance**: Static HTML generation, minified assets, strict CSP.
- **Tech Stack**: Tailwind CSS v4, EJS, Node.js Build Script.
- **Automated VCF**: vCard files are automatically generated from configuration.

## Structure

- `src/`
  - `data/`: Configuration (site info, translations, vCard).
  - `public/`: Static root files (robots.txt, CNAME, favicons).
  - `css/`: Tailwind CSS input.
  - `js/`: Client-side JavaScript.
  - `index.ejs`: Main HTML template.
- `assets/`: Static assets (images, icons).
- `scripts/`: Build scripts.
- `dist/`: Production build output.

## Configuration

### Content & Translations
Edit `src/data/i18n.js` to update text content and vCard information for each language.

### Social Links
Edit `src/data/site.js` to manage social media links, icons, and the `baseUrl` (critical for CSP and asset paths).

## Development

```bash
npm install
npm run watch   # Watch CSS
npm run build   # Build for production (outputs to dist/)
npx serve dist  # Preview
```

## Deployment

GitHub Actions automatically builds and deploys the `dist/` folder to GitHub Pages on push to `main`.
