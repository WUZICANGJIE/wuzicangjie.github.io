# Shaohan Sun - Personal Website

A multilingual static website hosted on GitHub Pages, using HTML, JavaScript, and Tailwind CSS v4.

## Development

Use Node.js 24 LTS and npm.

```bash
npm ci
npm run dev
```

`npm run dev` watches Tailwind source changes and updates `assets/css/style.css`. Serve the project root with a local HTTP server to preview it, for example:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Production

```bash
npm run build
python3 -m http.server 8000 --directory dist
```

The build minifies CSS and recreates `dist/` from an explicit list: `index.html`, `assets/`, `favicon.ico`, and `CNAME`. GitHub Actions builds and deploys only this directory on pushes to `main` or a manual workflow run. Dependencies and source files stay outside the published site.

## Contact details

The contact downloads are static vCard files in `assets/contacts/contact-{en,zh,ja}.vcf`. Keep all three files in sync when changing contact information, use CRLF line endings, and end each file with a newline. Language-specific names should match the website.

Keep the LINE URL in the website synchronized with the current link copied from LINE's My QR code screen. Regenerating that code can invalidate the previous link. A Discord profile link requires the account's numeric user ID.

## iPhone checks

- In Safari and the LINE in-app browser, open the LINE contact link with LINE installed and confirm the intended account appears. Record the iOS version and any failure behavior.
- Open the Discord profile link and confirm the intended account appears.
- In each language, open the contact download in Safari and check the displayed name, phone numbers, and email addresses before importing it into Contacts.
- Change language and reload; check the saved preference, menu focus, and keyboard dismissal.
- Check light and dark appearance, a narrow screen, and Reduce Motion. Tailwind v4 targets Safari 16.4 and later; older iOS versions need separate compatibility work.
