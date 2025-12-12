# Shaohan Sun - Personal Website

This is the source code for my personal website, hosted on GitHub Pages.

## Features

- **Multi-language Support**: English, Chinese, and Japanese.
- **SEO Optimized**: Static HTML generation for each language (`/`, `/zh/`, `/ja/`) ensuring correct metadata for search engines and social media sharing.
- **Security Hardened**: Strict Content Security Policy (CSP) and Trusted Types enabled.
- **Performance**: Minified HTML, CSS, and JavaScript.

## Tech Stack

- [Tailwind CSS v4](https://tailwindcss.com/) (CLI)
- [HTML Minifier](https://github.com/terser/html-minifier-terser)
- [Terser](https://github.com/terser/terser) (JS Minifier)
- Custom Node.js SSG Script (Static Site Generation)

## Project Structure

- `src/`: Source code.
    - `index.html`: Main HTML template.
    - `css/`: CSS source (Tailwind input).
    - `js/`: JavaScript source (Logic for i18n and interactions).
- `scripts/`: Build scripts.
    - `build-html.js`: Generates localized, minified HTML files from the source template.
- `assets/`: Compiled/Static assets.
    - `css/`: Minified CSS.
    - `js/`: Minified JavaScript.
    - `images/`: Images.
    - `icons/`: Icons.
- `index.html`: Generated minified HTML (English/Default).
- `zh/`: Generated Chinese version.
- `ja/`: Generated Japanese version.

## Development

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start Tailwind CSS in watch mode:**

    ```bash
    npm run watch
    ```

3.  **Build for production:**

    Compiles CSS, minifies JS, and generates localized HTML files.

    ```bash
    npm run build
    ```

4.  **Local Preview:**

    Serve the static files locally to test multi-language routing.

    ```bash
    npx serve .
    ```

## Automation

This repository uses **GitHub Actions** to automatically build and deploy the website whenever changes are pushed to the `main` branch.

- **Workflow file**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` branch.
- **Action**: Installs dependencies, builds the project (minifies HTML & CSS, generates localized pages), and deploys the artifacts to GitHub Pages.
