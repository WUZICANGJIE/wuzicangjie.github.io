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
            const LANG_PREFIX_MAP = Object.fromEntries(
                Object.entries(LANG_CONFIG).map(([code, prefix]) => [prefix, code])
            );

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

            const metaCache = { name: new Map(), property: new Map() };
            const cacheMeta = (type, names) => {
                names.forEach((name) => {
                    const element = document.querySelector(`meta[${type}="${name}"]`);
                    if (element) metaCache[type].set(name, element);
                });
            };

            cacheMeta('name', ['title', 'description']);
            cacheMeta('property', [
                'og:title',
                'og:description',
                'twitter:title',
                'twitter:description',
                'og:url',
                'twitter:url'
            ]);

            const domRefs = {
                profileName: document.getElementById('profile-name'),
                profileBio: document.getElementById('profile-bio'),
                contactBtn: document.getElementById('contact-btn'),
                contactText: document.getElementById('contact-text'),
                contactIcon: document.getElementById('contact-icon')
            };
            const profileNameParent = domRefs.profileName?.parentElement;

            const setMeta = (type, name, content) => {
                const element = metaCache[type].get(name);
                if (element) element.content = content;
            };

            const setMetaBatch = (type, entries) => {
                Object.entries(entries).forEach(([name, content]) => setMeta(type, name, content));
            };

            const setText = (el, text) => {
                if (el) el.innerText = text;
            };

            const setHTML = (el, html) => {
                if (el) el.innerHTML = html;
            };

            const replayAnimation = (element) => {
                if (!element) return;
                element.classList.remove('animate-fade-in');
                void element.offsetWidth; // trigger reflow
                element.classList.add('animate-fade-in');
            };

            const getLangFromPath = (path = window.location.pathname) => {
                const pathOnly = path.startsWith('http') ? path.replace(/^https?:\/\/[^/]+/, '') : path;
                // Normalize path to compare only the first segment with the prefix map.
                const [, firstSegment = ''] = pathOnly.replace(/^\/+/, '/').split('/');
                const normalizedSegment = firstSegment ? `${firstSegment}/` : '';
                // Match the first path segment against known prefixes, defaulting to English
                return LANG_PREFIX_MAP[normalizedSegment] ?? 'en';
            };

            const getLangFromLink = (link) => {
                if (link?.dataset?.lang) return link.dataset.lang;
                const href = link?.getAttribute('href') || window.location.pathname;
                return getLangFromPath(href);
            };

            let currentLang = null;

            const updateContent = (lang) => {
                if (!lang || lang === currentLang) return;

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

                setText(domRefs.profileName, data.name);
                setHTML(domRefs.profileBio, data.bio);
                setText(domRefs.contactText, data.saveContact);

                if (domRefs.contactBtn && window.SITE_CONFIG) {
                    domRefs.contactBtn.href = `${window.SITE_CONFIG.baseUrl}${lang}.vcf`;
                }

                if (profileNameParent) {
                    replayAnimation(profileNameParent);
                }

                replayAnimation(domRefs.contactText);
                replayAnimation(domRefs.contactIcon);

                langLinks.forEach((link) => {
                    const linkLang = getLangFromLink(link);
                    const method = linkLang === lang ? 'add' : 'remove';
                    link.classList[method]('bg-gray-50', 'dark:bg-zinc-700/50', 'font-bold');
                });

                currentLang = lang;
            };

            if (window.I18N) {
                langLinks.forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const href = link.getAttribute('href');
                        const lang = getLangFromLink(link);
                        updateContent(lang);
                        window.history.pushState({ lang }, '', href);
                        toggleMenu(false);
                    });
                });

                window.addEventListener('popstate', () => {
                    const lang = getLangFromPath(window.location.pathname);
                    updateContent(lang);
                });

                const initialLang = getLangFromPath();
                updateContent(initialLang);
            }
        }
    });
})();
