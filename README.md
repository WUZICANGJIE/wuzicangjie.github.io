# Shaohan Sun - Personal Website

Source code for my personal website, hosted on GitHub Pages.

## Features

- **Multi-language**: English, Chinese, Japanese (SSG).
- **SEO & Performance**: Static HTML generation, minified assets, strict CSP.
- **Tech Stack**: Tailwind CSS v4, EJS, Node.js Build Script.

## Structure

- `src/`: Source code (`index.ejs`, `js/`, `css/`, `data/`).
- `scripts/`: Build scripts (`build.js`).
- `dist/`: Production build output.

## Development

```bash
npm install
npm run watch   # Watch CSS
npm run build   # Build for production (outputs to dist/)
npx serve dist  # Preview
```

## Deployment

GitHub Actions automatically builds and deploys the `dist/` folder to GitHub Pages on push to `main`.
