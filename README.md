# Shaohan Sun - Personal Website

This is the source code for my personal website, hosted on GitHub Pages.

## Tech Stack

- HTML5
- [Tailwind CSS v4](https://tailwindcss.com/) (CLI)

## Development

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start Tailwind CSS in watch mode:**

    ```bash
    npm run watch
    ```

3.  **Build for production (Minified):**

    ```bash
    npm run build
    ```

## Automation

This repository uses **GitHub Actions** to automatically build and minify the CSS whenever changes are pushed to the `main` branch.

- **Workflow file**: `.github/workflows/build-css.yml`
- **Trigger**: Push to `main` branch (when modifying `src/`, `index.html`, or `package.json`).
- **Action**: Compiles Tailwind CSS and commits the updated `assets/css/style.css` back to the repository.
