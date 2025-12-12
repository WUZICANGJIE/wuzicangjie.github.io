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
        }
    });
})();
