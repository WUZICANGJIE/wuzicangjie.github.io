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

            const updateContent = (lang) => {
                const data = window.I18N && window.I18N[lang];
                if (!data) return;

                document.documentElement.lang = lang;
                document.title = data.title;

                setMeta('name', 'title', data.title);
                setMeta('name', 'description', data.description);
                setMeta('property', 'og:title', data.title);
                setMeta('property', 'og:description', data.description);
                setMeta('property', 'twitter:title', data.title);
                setMeta('property', 'twitter:description', data.description);

                if (window.SITE_CONFIG) {
                    let path = '';
                    if (lang === 'zh') path = 'zh/';
                    else if (lang === 'ja') path = 'ja/';
                    
                    const newUrl = `${window.SITE_CONFIG.siteUrl}${path}`;
                    setMeta('property', 'og:url', newUrl);
                    setMeta('property', 'twitter:url', newUrl);
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
                    const linkHref = link.getAttribute('href');
                    let linkLang = 'en';
                    if (linkHref.includes('/zh/')) linkLang = 'zh';
                    else if (linkHref.includes('/ja/')) linkLang = 'ja';

                    if (linkLang === lang) {
                        link.classList.add('bg-gray-50', 'dark:bg-zinc-700/50', 'font-bold');
                    } else {
                        link.classList.remove('bg-gray-50', 'dark:bg-zinc-700/50', 'font-bold');
                    }
                });
            };

            if (window.I18N && window.SITE_CONFIG) {
                langLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const href = link.getAttribute('href');
                        let lang = 'en';
                        if (href.includes('/zh/')) lang = 'zh';
                        else if (href.includes('/ja/')) lang = 'ja';
                        
                        updateContent(lang);
                        window.history.pushState({ lang }, '', href);
                        toggleMenu(false);
                    });
                });

                window.addEventListener('popstate', () => {
                    const path = window.location.pathname;
                    let lang = 'en';
                    if (path.includes('/zh/')) lang = 'zh';
                    else if (path.includes('/ja/')) lang = 'ja';
                    updateContent(lang);
                });
            }
        }
    });
})();
