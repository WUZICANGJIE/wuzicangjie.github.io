// Trusted Types Policy
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML: (string) => string,
        createScript: (string) => string
    });
}

(() => {
    // Initialize on DOMContentLoaded
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

            // Client-side Routing Logic
            const updatePageContent = async (doc) => {
                const elementsToAnimate = [
                    'profile-name',
                    'profile-bio',
                    'contact-text',
                    'contact-icon'
                ];

                const elementsToUpdate = [
                    'profile-name',
                    'profile-bio',
                    'contact-text',
                    'footer-text'
                ];

                // 1. Fade Out
                elementsToAnimate.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.add('opacity-0');
                });

                // Wait for transition (200ms matches duration-200)
                await new Promise(r => setTimeout(r, 200));

                // 2. Update Content
                const updateElement = (id) => {
                    const newEl = doc.getElementById(id);
                    const oldEl = document.getElementById(id);
                    if (newEl && oldEl) oldEl.innerHTML = newEl.innerHTML;
                };

                elementsToUpdate.forEach(id => updateElement(id));
                
                // Update Contact Button Attributes (No animation needed for attributes)
                const newBtn = doc.getElementById('contact-btn');
                const oldBtn = document.getElementById('contact-btn');
                if (newBtn && oldBtn) {
                    oldBtn.setAttribute('href', newBtn.getAttribute('href'));
                    oldBtn.setAttribute('download', newBtn.getAttribute('download'));
                }

                // Update Document Title
                document.title = doc.title;

                // Update Language Menu (Active State)
                const newMenu = doc.getElementById('lang-menu');
                if (newMenu) {
                    menu.innerHTML = newMenu.innerHTML;
                }

                // 3. Fade In
                // Small delay to ensure DOM update is rendered before removing opacity-0
                requestAnimationFrame(() => {
                    elementsToAnimate.forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.classList.remove('opacity-0');
                    });
                });
            };

            const handleNavigation = async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    await updatePageContent(doc);
                } catch (error) {
                    console.error('Navigation failed:', error);
                    window.location.href = url;
                }
            };

            // Event Delegation for Menu Links
            menu.addEventListener('click', async (e) => {
                const link = e.target.closest('a[role="menuitem"]');
                if (link) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    toggleMenu(false);
                    
                    // Update URL first
                    window.history.pushState({}, '', href);
                    await handleNavigation(href);
                }
            });

            // Handle Back/Forward Buttons
            window.addEventListener('popstate', () => {
                handleNavigation(window.location.href);
            });
        }
    });
})();
