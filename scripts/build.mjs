import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const publicFiles = ['index.html', 'assets', 'favicon.ico', 'CNAME'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of publicFiles) {
  await cp(join(root, file), join(output, file), { recursive: true });
}

const read = path => readFile(join(root, path), 'utf8');

// Replaces exactly one match, so a changed source file fails the build instead of
// silently shipping a page that still waits on extra requests.
function replaceOnce(text, pattern, replacement) {
  let count = 0;
  const result = text.replace(pattern, (...match) => {
    count++;
    return replacement(...match);
  });
  if (count !== 1) throw new Error(`Expected one match for ${pattern}, found ${count}`);
  return result;
}

function assertEmbeddable(text, path, tag) {
  if (new RegExp(`</${tag}|<!--`, 'i').test(text)) throw new Error(`${path} cannot be inlined in <${tag}>`);
  return text.trim();
}

// Drops indentation, blank lines, and whole-line comments. Line breaks stay, so the
// script parses the same way.
function compactScript(script) {
  const lines = script.split('\n');
  if (lines.some(line => (line.match(/`/g) || []).length % 2)) {
    throw new Error('Cannot compact a script with a multi-line template literal');
  }
  return lines.map(line => line.trim()).filter(line => line && !line.startsWith('//')).join('\n');
}

// Put the stylesheet and script in the page itself. A slow connection then renders
// the whole page from one response instead of waiting on more requests.
let html = (await read('index.html')).replace(/^[ \t]+/gm, '');

const css = assertEmbeddable(await read('assets/css/style.css'), 'assets/css/style.css', 'style');
html = replaceOnce(html, /<link rel="stylesheet" href="assets\/css\/style\.css">/, () => `<style>${css}</style>`);

// Running the script at the end of the body applies the saved or browser language
// before the first paint, without waiting for a separate file.
const script = assertEmbeddable(await read('assets/js/main.js'), 'assets/js/main.js', 'script');
const registerServiceWorker = `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}`;
html = replaceOnce(html, /<script src="assets\/js\/main\.js" defer><\/script>\r?\n/, () => '');
const inlineScript = compactScript(`${script}\n${registerServiceWorker}`);
html = replaceOnce(html, /<\/body>/, () => `<script>\n${inlineScript}\n</script>\n</body>`);

const leftover = html.match(/assets\/(css|js)\/[^"]*/);
if (leftover) throw new Error(`dist/index.html still references ${leftover[0]}`);
await writeFile(join(output, 'index.html'), html);

// The service worker caches what a repeat or offline visit needs. Its version is a hash
// of those files, so every content change installs a fresh cache.
const contacts = (await readdir(join(output, 'assets/contacts')))
  .filter(file => file.endsWith('.vcf'))
  .sort()
  .map(file => `assets/contacts/${file}`);
const precache = ['./', 'assets/images/avatar.webp', 'favicon.ico', ...contacts];
const serviceWorkerSource = await read('src/sw.js');
const hash = createHash('sha256').update(serviceWorkerSource);
for (const path of precache) {
  hash.update(path).update(await readFile(join(output, path === './' ? 'index.html' : path)));
}
let serviceWorker = replaceOnce(serviceWorkerSource, /const VERSION = 'dev';/, () => `const VERSION = '${hash.digest('hex').slice(0, 12)}';`);
serviceWorker = replaceOnce(serviceWorker, /const PRECACHE = \[\];/, () => `const PRECACHE = ${JSON.stringify(precache)};`);
await writeFile(join(output, 'sw.js'), serviceWorker);

console.log('Built site in dist/');
