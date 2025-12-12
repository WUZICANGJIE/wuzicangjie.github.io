const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const srcPath = path.join(__dirname, '../src/index.html');
const distRoot = path.join(__dirname, '..');

const i18n = {
    zh: {
        title: "孙少瀚 (无字仓颉)",
        name: "孙少瀚",
        bio: "经济学学生<br>家用服务器/投资/音游",
        description: "经济学学生。家用服务器爱好者，投资者，音游玩家。",
        saveContact: "添加联系人"
    },
    en: {
        title: "Shaohan Sun (wuzicangjie)",
        name: "Shaohan Sun",
        bio: "Econ student<br>Homelab/Investing/Rhythm Games",
        description: "Econ student. Homelab enthusiast, Investor, Rhythm Game player.",
        saveContact: "Save Contact"
    },
    ja: {
        title: "孫少瀚 (無字倉頡)",
        name: "孫少瀚",
        bio: "経済学の学生<br>自宅サーバー・投資・音ゲー",
        description: "経済学の学生。自宅サーバー愛好家、投資家、音ゲーマー。",
        saveContact: "連絡先を追加"
    }
};

const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
};

async function build() {
    const template = fs.readFileSync(srcPath, 'utf8');

    for (const lang of ['en', 'zh', 'ja']) {
        const t = i18n[lang];
        let html = template;

        // Replace Title
        html = html.replace(/<title>.*?<\/title>/, `<title>${t.title}</title>`);
        
        // Replace Meta Tags
        html = html.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${t.title}" />`);
        html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${t.description}" />`);
        
        html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${t.title}" />`);
        html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${t.description}" />`);
        
        html = html.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${t.title}" />`);
        html = html.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${t.description}" />`);

        // Replace Content
        // Note: The regex needs to be robust enough to match the multiline content in src/index.html
        // We use a placeholder approach or specific ID replacement if possible, but regex is easier for simple replacements if we are careful.
        
        // Replace Name
        html = html.replace(/<h1 id="profile-name".*?>.*?<\/h1>/s, `<h1 id="profile-name" class="text-2xl font-bold mb-2 tracking-tight">${t.name}</h1>`);
        
        // Replace Bio
        html = html.replace(/<p id="profile-bio".*?>.*?<\/p>/s, `<p id="profile-bio" class="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">\n                    ${t.bio}\n                </p>`);

        // Replace Save Contact Button Text
        html = html.replace(/<span id="btn-save-contact">.*?<\/span>/, `<span id="btn-save-contact">${t.saveContact}</span>`);

        // Set HTML lang attribute
        html = html.replace(/<html lang="en">/, `<html lang="${lang}">`);

        // Minify
        const minified = await minify(html, minifyOptions);

        // Determine output path
        let outputPath;
        if (lang === 'en') {
            outputPath = path.join(distRoot, 'index.html');
        } else {
            const langDir = path.join(distRoot, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }
            outputPath = path.join(langDir, 'index.html');
        }

        fs.writeFileSync(outputPath, minified);
        console.log(`Generated ${lang} -> ${outputPath}`);
    }
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
