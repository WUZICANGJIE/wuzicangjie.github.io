# Shaohan Sun - Personal Website

This is the source code for my personal website, hosted on GitHub Pages.

## Tech Stack

- HTML5
- [Tailwind CSS v4](https://tailwindcss.com/) (CLI)
- [HTML Minifier](https://github.com/terser/html-minifier-terser)

## Project Structure

- `src/`: Source code (HTML & CSS).
- `index.html`: Generated minified HTML (Production).
- `assets/css/style.css`: Generated minified CSS (Production).

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

    Compiles and minifies both CSS and HTML.

    ```bash
    npm run build
    ```

## Automation

This repository uses **GitHub Actions** to automatically build and deploy the website whenever changes are pushed to the `main` branch.

- **Workflow file**: `.github/workflows/build-css.yml`
- **Trigger**: Push to `main` branch.
- **Action**: Installs dependencies, builds the project (minifies HTML & CSS), and deploys the artifacts to GitHub Pages.
