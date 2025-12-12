const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');
const ejs = require('ejs');
const { i18n, vcfProfiles } = require('../src/data/i18n');
const site = require('../src/data/site');

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

function generateVcf(lang) {
    const profile = vcfProfiles[lang];
    const common = vcfProfiles.common;
    
    if (!profile) return null;

    let vcf = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcf += `FN:${profile.fn}\n`;
    vcf += `N:${profile.n}\n`;
    
    if (profile.xPhoneticLast) {
        vcf += `X-PHONETIC-LAST-NAME:${profile.xPhoneticLast}\n`;
    }
    if (profile.xPhoneticFirst) {
        vcf += `X-PHONETIC-FIRST-NAME:${profile.xPhoneticFirst}\n`;
    }
    
    const phones = profile.phones || common.phones || [];
    phones.forEach(phone => {
        vcf += `TEL;TYPE=CELL:${phone}\n`;
    });
    
    const emails = profile.emails || common.emails || [];
    emails.forEach(email => {
        vcf += `EMAIL;TYPE=${email.type}:${email.value}\n`;
    });
    
    if (common.bday) {
        vcf += `BDAY:${common.bday}\n`;
    }
    
    vcf += 'END:VCARD';
    return vcf;
}

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
    const currentYear = new Date().getFullYear();

    const languages = Object.keys(i18n);

    for (const lang of languages) {
        const t = i18n[lang];
        const isDefault = lang === 'en';
        
        const siteUrl = site.siteUrl;
        const langUrl = isDefault ? siteUrl : `${siteUrl}${lang}/`;
        
        // VCF Filename
        const vcfFilename = `${lang}.vcf`; // e.g., en.vcf, zh.vcf
        const vcfPath = path.join(distDir, vcfFilename);
        
        // Write VCF
        const vcfContent = generateVcf(lang);
        if (vcfContent) {
            fs.writeFileSync(vcfPath, vcfContent);
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
            vcfLink: `${site.baseUrl}${vcfFilename}`,
            socialLinks: site.socialLinks,
            site: site,
            languages: languages,
            year: currentYear,
            version: Date.now()
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
