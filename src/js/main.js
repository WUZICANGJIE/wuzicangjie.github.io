// Trusted Types Policy
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML: (string) => string,
        createScript: (string) => string
    });
}

(() => {
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
    
    // --- 2. JSON-LD Injection (Dynamic & CSP Safe) ---
    function updateJsonLd(langData) {
        let script = document.getElementById('json-ld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'json-ld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "mainEntity": {
                "@type": "Person",
                "name": "Shaohan Sun",
                "alternateName": ["孙少瀚", "孫少瀚", "ソンショウハン", "無字倉頡", "无字仓颉", "wuzicangjie", "mujisoketsu"],
                "url": "https://me.wuzicangjie.com",
                "image": "https://me.wuzicangjie.com/assets/images/og-image.webp",
                "description": langData.description,
                "sameAs": [
                    "https://github.com/WUZICANGJIE",
                    "https://x.com/mujisoketsu",
                    "https://t.me/wuzicangjie"
                ]
            }
        };
        
        script.textContent = JSON.stringify(jsonLd);
    }

    const vcfData = {
        en: `BEGIN:VCARD
VERSION:3.0
FN:Shaohan Sun
N:Sun;Shaohan;;;
X-PHONETIC-LAST-NAME:Sun
X-PHONETIC-FIRST-NAME:Shaohan
TEL;TYPE=CELL:+86 132 2425 0236
TEL;TYPE=CELL:+81 80-7382-0454
EMAIL;TYPE=INTERNET,HOME,PREF:wuzi.ssh@gmail.com
EMAIL;TYPE=INTERNET,HOME:sysunshaohan@outlook.com
EMAIL;TYPE=INTERNET,WORK:sunshaohan@akane.waseda.jp
BDAY:20000815
END:VCARD`,
        ja: `BEGIN:VCARD
VERSION:3.0
FN:孫少瀚
N:孫;少瀚;;;
X-PHONETIC-FIRST-NAME:ショウハン
X-PHONETIC-LAST-NAME:ソン
TEL;TYPE=CELL:+81 80-7382-0454
EMAIL;TYPE=INTERNET,HOME,PREF:wuzi.ssh@gmail.com
EMAIL;TYPE=INTERNET,HOME:sysunshaohan@outlook.com
EMAIL;TYPE=INTERNET,WORK:sunshaohan@akane.waseda.jp
BDAY:20000815
END:VCARD`,
        zh: `BEGIN:VCARD
VERSION:3.0
FN:孙少瀚
N:孙;少瀚;;;
X-PHONETIC-LAST-NAME:Sun
X-PHONETIC-FIRST-NAME:Shaohan
TEL;TYPE=CELL:+86 132 2425 0236
TEL;TYPE=CELL:+81 80-7382-0454
EMAIL;TYPE=INTERNET,HOME,PREF:wuzi.ssh@gmail.com
EMAIL;TYPE=INTERNET,HOME:sysunshaohan@outlook.com
EMAIL;TYPE=INTERNET,WORK:sunshaohan@akane.waseda.jp
BDAY:20000815
END:VCARD`
    };

    let currentLang = 'en';

    function updateLanguage(lang) {
        if (!i18n[lang]) return;
        currentLang = lang;
        const t = i18n[lang];

        document.title = t.title;
        document.documentElement.lang = lang;
        document.getElementById('profile-name').innerText = t.name;
        document.getElementById('profile-bio').innerHTML = t.bio;
        
        // Update Meta Tags (SEO & Social)
        const metaUpdates = {
            'meta[name="description"]': t.description,
            'meta[name="title"]': t.title,
            'meta[property="og:title"]': t.title,
            'meta[property="og:description"]': t.description,
            'meta[property="twitter:title"]': t.title,
            'meta[property="twitter:description"]': t.description
        };

        for (const [selector, content] of Object.entries(metaUpdates)) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('content', content);
            }
        }

        // Update JSON-LD
        updateJsonLd(t);
        
        const saveContactSpan = document.getElementById('btn-save-contact');
        if (saveContactSpan) {
            saveContactSpan.innerText = t.saveContact;
        }

        document.querySelectorAll('.lang-item').forEach(item => {
            if (item.dataset.lang === lang) {
                item.classList.add('bg-gray-50', 'dark:bg-zinc-700/50', 'font-bold');
            } else {
                item.classList.remove('bg-gray-50', 'dark:bg-zinc-700/50', 'font-bold');
            }
        });

        const menu = document.getElementById('lang-menu');
        const menuBtn = document.getElementById('lang-menu-btn');
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    function downloadVcf() {
        let vcfContent = vcfData[currentLang] || vcfData.en;
        const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${i18n[currentLang].name}.vcf`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Detect language from URL first, then navigator
        const path = window.location.pathname;
        if (path.includes('/zh')) {
            currentLang = 'zh';
        } else if (path.includes('/ja')) {
            currentLang = 'ja';
        } else {
            const userLang = navigator.language || navigator.userLanguage; 
            if (userLang.startsWith('zh')) {
                currentLang = 'zh';
            } else if (userLang.startsWith('ja')) {
                currentLang = 'ja';
            }
        }
        updateLanguage(currentLang);

        // Event Listeners
        
        // Language Switcher Buttons
        document.querySelectorAll('.lang-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.dataset.lang;
                
                // Update URL
                let newPath = '/';
                if (lang === 'zh') newPath = '/zh/';
                if (lang === 'ja') newPath = '/ja/';
                
                if (window.location.pathname !== newPath) {
                    window.history.pushState({}, '', newPath);
                }

                updateLanguage(lang);
            });
        });

        // Download VCF Button
        const downloadBtn = document.getElementById('btn-download-vcf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadVcf();
            });
        }

        // Avatar Error Handler
        const avatarImg = document.querySelector('img[alt="Shaohan Sun"]');
        if (avatarImg) {
            avatarImg.addEventListener('error', function() {
                this.src = 'https://ui-avatars.com/api/?name=Wu+Zi&background=random';
            });
        }

        // Menu Logic
        const menuBtn = document.getElementById('lang-menu-btn');
        const menu = document.getElementById('lang-menu');

        if (menuBtn && menu) {
            const toggleMenu = (show) => {
                const isHidden = menu.classList.contains('hidden');
                if (show === undefined) show = isHidden;
                
                if (show) {
                    menu.classList.remove('hidden');
                    menuBtn.setAttribute('aria-expanded', 'true');
                } else {
                    menu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            };

            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                    toggleMenu(false);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                    toggleMenu(false);
                    menuBtn.focus();
                }
            });
        }
    });
})();
