const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');
const ejs = require('ejs');
const { i18n, vcfData } = require('../src/data/i18n');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(rootDir, 'assets');

const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
};

// Files to copy to root of dist
const rootFiles = [
    'robots.txt',
    'sitemap.xml',
    'site.webmanifest',
    'CNAME',
    '.nojekyll',
    'favicon.ico',
    'favicon.svg',
    'favicon-96x96.png',
    'apple-touch-icon.png',
    'web-app-manifest-192x192.png',
    'web-app-manifest-512x512.png'
];

async function build() {
    console.log('Starting build...');

    // 1. Clean & Create dist
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir);
    console.log('Cleaned dist directory.');

    // 2. Copy Assets
    const distAssets = path.join(distDir, 'assets');
    fs.cpSync(assetsDir, distAssets, { recursive: true });
    console.log('Copied assets.');

    // 3. Copy Root Files
    for (const file of rootFiles) {
        const src = path.join(rootDir, file);
        if (fs.existsSync(src)) {
            fs.cpSync(src, path.join(distDir, file));
            console.log(`Copied ${file}`);
        }
    }

    // 4. Generate HTML & VCF
    const templatePath = path.join(srcDir, 'index.ejs');
    const template = fs.readFileSync(templatePath, 'utf8');

    for (const lang of ['en', 'zh', 'ja']) {
        const t = i18n[lang];
        const isDefault = lang === 'en';
        
        const baseUrl = 'https://me.wuzicangjie.com/';
        const langUrl = isDefault ? baseUrl : `${baseUrl}${lang}/`;
        
        // VCF Filename
        const vcfFilename = `${lang}.vcf`; // e.g., en.vcf, zh.vcf
        const vcfPath = path.join(distDir, vcfFilename);
        
        // Write VCF
        if (vcfData[lang]) {
            fs.writeFileSync(vcfPath, vcfData[lang]);
            console.log(`Generated ${vcfFilename}`);
        }

        // Prepare Data for Template
        const data = {
            lang: lang,
            title: t.title,
            description: t.description,
            name: t.name,
            bio: t.bio,
            saveContact: t.saveContact,
            url: langUrl,
            vcfLink: `/${vcfFilename}`
        };

        // Render HTML
        const html = ejs.render(template, data);
        const minified = await minify(html, minifyOptions);

        // Output Path
        let outputPath;
        if (isDefault) {
            outputPath = path.join(distDir, 'index.html');
        } else {
            const langDir = path.join(distDir, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }
            outputPath = path.join(langDir, 'index.html');
        }

        fs.writeFileSync(outputPath, minified);
        console.log(`Generated HTML for ${lang} -> ${outputPath}`);
    }

    console.log('Build complete!');
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
