const fs = require('fs/promises');
const path = require('path');
const { minify } = require('html-minifier-terser');
const ejs = require('ejs');
const { i18n, vcfProfiles } = require('../src/data/i18n');
const site = require('../src/data/site');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const publicDir = path.join(srcDir, 'public');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(rootDir, 'assets');

const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
};

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
    console.time('Build time');
    console.log('Starting build...');

    // 1. Clean & Create dist
    await fs.rm(distDir, { recursive: true, force: true });
    await fs.mkdir(distDir, { recursive: true });

    // 2. Copy Assets (CSS/JS/Images)
    const distAssets = path.join(distDir, 'assets');
    await fs.cp(assetsDir, distAssets, { recursive: true });
    
    // 3. Copy Public Files (Root files like robots.txt, CNAME)
    try {
        await fs.cp(publicDir, distDir, { recursive: true });
        console.log('Copied public files.');
    } catch (err) {
        console.warn('No public directory found or empty.');
    }

    // 4. Generate HTML & VCF
    const templatePath = path.join(srcDir, 'index.ejs');
    const template = await fs.readFile(templatePath, 'utf8');
    const currentYear = new Date().getFullYear();
    const version = Date.now();

    const languages = Object.keys(i18n);

    await Promise.all(languages.map(async (lang) => {
        const t = i18n[lang];
        const isDefault = lang === 'en';
        
        const siteUrl = site.siteUrl;
        const langUrl = isDefault ? siteUrl : `${siteUrl}${lang}/`;
        
        // VCF Generation
        const vcfFilename = `${lang}.vcf`;
        const vcfPath = path.join(distDir, vcfFilename);
        const vcfContent = generateVcf(lang);
        
        if (vcfContent) {
            await fs.writeFile(vcfPath, vcfContent);
        }

        // Prepare Data
        const data = {
            lang,
            title: t.title,
            description: t.description,
            name: t.name,
            bio: t.bio,
            saveContact: t.saveContact,
            url: langUrl,
            vcfLink: `${site.baseUrl}${vcfFilename}`,
            socialLinks: site.socialLinks,
            site,
            languages,
            year: currentYear,
            version
        };

        // Render & Minify
        const html = ejs.render(template, data);
        const minified = await minify(html, minifyOptions);

        // Output
        const outputDir = isDefault ? distDir : path.join(distDir, lang);
        if (!isDefault) {
            await fs.mkdir(outputDir, { recursive: true });
        }
        
        await fs.writeFile(path.join(outputDir, 'index.html'), minified);
        console.log(`Generated ${lang} -> ${isDefault ? '/' : '/' + lang + '/'}`);
    }));

    console.log('Build complete!');
    console.timeEnd('Build time');
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
