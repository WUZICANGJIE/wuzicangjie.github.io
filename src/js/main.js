// Trusted Types Policy
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML: (string) => string,
        createScript: (string) => string
    });
}

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        // Avatar Error Handler
        const avatarImg = document.getElementById('avatar-img');
        if (avatarImg) {
            avatarImg.addEventListener('error', function() {
                this.src = 'https://ui-avatars.com/api/?name=Wu+Zi&background=random';
            });
        }

        // Menu Logic
        const menuBtn = document.getElementById('lang-menu-btn');
        const menu = document.getElementById('lang-menu');

        if (menuBtn && menu) {
            const LANG_CONFIG = {
                en: '',
                zh: 'zh/',
                ja: 'ja/'
            };

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

            // Client-side Language Switching
            const langLinks = menu.querySelectorAll('a');
            
            const setMeta = (type, name, content) => {
                const element = document.querySelector(`meta[${type}="${name}"]`);
                if (element) element.content = content;
            };

            const setMetaBatch = (type, entries) => {
                Object.entries(entries).forEach(([name, content]) => setMeta(type, name, content));
            };

            const setText = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.innerText = text;
            };

            const setHTML = (id, html) => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = html;
            };

            const replayAnimation = (element) => {
                if (!element) return;
                element.classList.remove('animate-fade-in');
                void element.offsetWidth; // trigger reflow
                element.classList.add('animate-fade-in');
            };

            const getLangFromUrl = (url) => {
                try {
                    const pathname = new URL(url, window.location.origin).pathname;
                    const [, firstSegment] = pathname.split('/');
                    return Object.keys(LANG_CONFIG).find((key) => LANG_CONFIG[key].startsWith(`${firstSegment}/`)) || 'en';
                } catch (err) {
                    return 'en';
                }
            };

            const updateContent = (lang) => {
                const data = window.I18N && window.I18N[lang];
                if (!data) return;

                document.documentElement.lang = lang;
                document.title = data.title;

                setMetaBatch('name', {
                    title: data.title,
                    description: data.description
                });

                setMetaBatch('property', {
                    'og:title': data.title,
                    'og:description': data.description,
                    'twitter:title': data.title,
                    'twitter:description': data.description
                });

                if (window.SITE_CONFIG) {
                    const newUrl = `${window.SITE_CONFIG.siteUrl}${LANG_CONFIG[lang] || ''}`;
                    setMetaBatch('property', {
                        'og:url': newUrl,
                        'twitter:url': newUrl
                    });
                }

                setText('profile-name', data.name);
                setHTML('profile-bio', data.bio);
                setText('contact-text', data.saveContact);

                const contactBtn = document.getElementById('contact-btn');
                if (contactBtn && window.SITE_CONFIG) {
                    contactBtn.href = `${window.SITE_CONFIG.baseUrl}${lang}.vcf`;
                }

                const profileName = document.getElementById('profile-name');
                if (profileName && profileName.parentElement) {
                    replayAnimation(profileName.parentElement);
                }

                replayAnimation(document.getElementById('contact-text'));
                replayAnimation(document.getElementById('contact-icon'));

                langLinks.forEach(link => {
                    const linkLang = getLangFromUrl(link.getAttribute('href'));
                    const method = linkLang === lang ? 'add' : 'remove';
                    link.classList[method]('bg-gray-50', 'dark:bg-zinc-700/50', 'font-bold');
                });
            };

            if (window.I18N && window.SITE_CONFIG) {
                langLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const href = link.getAttribute('href');
                        const lang = getLangFromUrl(href);
                        updateContent(lang);
                        window.history.pushState({ lang }, '', href);
                        toggleMenu(false);
                    });
                });

                window.addEventListener('popstate', () => {
                    const lang = getLangFromUrl(window.location.href);
                    updateContent(lang);
                });
            }
        }
    });
})();
