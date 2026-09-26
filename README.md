# Shaohan Sun - Personal Website

A multilingual static website hosted on GitHub Pages, using HTML, JavaScript, and Tailwind CSS v4.

## Development

Use Node.js 24 LTS and npm.

```bash
npm ci
npm run dev
```

`npm run dev` watches Tailwind source changes and updates `assets/css/style.css`. Serve the project root with a local HTTP server to preview it. The development page loads its files separately and has no service worker; use the production build below to check those. For example:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

Social links take their hover colors from the `.brand-*` classes in `src/input.css`. A link without one, like X or GitHub, uses neutral gray.

## Production

```bash
npm run build
python3 -m http.server 8000 --directory dist
```

The build minifies CSS and recreates `dist/` from an explicit list: `index.html`, `assets/`, `favicon.ico`, and `CNAME`. GitHub Actions builds and deploys only this directory on pushes to `main` or a manual workflow run. Dependencies and source files stay outside the published site.

### Slow connections

On a slow mobile connection, each request costs at least one round trip, so the build keeps the first visit to two requests:

- `dist/index.html` includes the stylesheet and `main.js`, with the script's indentation and comment lines removed. The SVG icons are written directly in `index.html`. The page is about 10 KB gzipped, small enough to arrive in the first round trip after the connection opens. The build fails if a referenced file changes shape and can no longer be inlined. The separate files are still published for pages cached before a deploy.
- The avatar is requested early at high priority. Until it loads, an 8×8 preview in `.avatar-placeholder` in `src/input.css` fills the circle. If you replace the avatar, replace that data URL with a base64-encoded 8×8 PNG of the new image; a stale preview only shows until the new image loads.

The build also writes `dist/sw.js`, a service worker registered after the page loads. It caches the page, avatar, favicon, and contact files so later visits load faster and work offline. The page and contact files are requested from the network first, so a deploy shows up on the next online visit; the cached copy is used when the network fails or takes more than 2 seconds. Each build hashes the cached files into a new cache version and removes the old one. To retire the service worker, deploy a `sw.js` that calls `self.registration.unregister()`; deleting the file leaves installed copies running.

## Contact details

The contact downloads are static vCard files in `assets/contacts/contact-{en,zh,ja}.vcf`. Keep all three files in sync when changing contact information, use CRLF line endings, and end each file with a newline. Language-specific names should match the website.

Keep the LINE URL in the website synchronized with the current link copied from LINE's My QR code screen. Regenerating that code can invalidate the previous link. A Discord profile link requires the account's numeric user ID.

## iPhone checks

- In Safari and the LINE in-app browser, open the LINE contact link with LINE installed and confirm the intended account appears. Record the iOS version and any failure behavior.
- Open the Discord profile link and confirm the intended account appears.
- In each language, open the contact download in Safari and check the displayed name, phone numbers, and email addresses before importing it into Contacts.
- Change language and reload; check the saved preference, menu focus, and keyboard dismissal.
- Check light and dark appearance, a narrow screen, and Reduce Motion. Tailwind v4 targets Safari 16.4 and later; older iOS versions need separate compatibility work.
- After one visit to the deployed site, turn on Airplane Mode and reload; the page and the contact download should still work.
