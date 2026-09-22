(() => {
    const translations = {
        en: {
            title: 'Shaohan Sun - Contact',
            name: 'Shaohan Sun',
            bio: 'Econ student.\nHomelab/Investing/Rhythm Games',
            saveContact: 'Save Contact',
            chooseLanguage: 'Choose language'
        },
        zh: {
            title: '孙少瀚 - 联系方式',
            name: '孙少瀚',
            bio: 'Econ student.\nHomelab/投资/音游',
            saveContact: '添加联系人',
            chooseLanguage: '选择语言'
        },
        ja: {
            title: '孫少瀚 - 連絡先',
            name: '孫少瀚',
            bio: 'Econ student.\n自宅サーバー・投資・音ゲー',
            saveContact: '連絡先を追加',
            chooseLanguage: '言語を選択'
        }
    };
    const storageKey = 'preferred-language';
    const menuButton = document.getElementById('lang-menu-btn');
    const menu = document.getElementById('lang-menu');
    const switcher = document.getElementById('language-switcher');
    const languageButtons = [...document.querySelectorAll('[data-lang]')];
    let currentLanguage = 'en';

    function closeMenu(restoreFocus = false) {
        menu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) menuButton.focus();
    }

    function applyLanguage(language) {
        if (!Object.hasOwn(translations, language)) return;
        currentLanguage = language;
        const text = translations[language];
        document.title = text.title;
        document.documentElement.lang = language === 'zh' ? 'zh-Hans' : language;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = text[element.dataset.i18n];
        });
        document.getElementById('save-contact').href = `assets/contacts/contact-${language}.vcf`;
        menuButton.setAttribute('aria-label', text.chooseLanguage);
        languageButtons.forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.lang === language));
        });
    }

    const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
    let initialLanguage = languages.map(language => language.toLowerCase().split('-')[0])
        .find(language => Object.hasOwn(translations, language)) || 'en';
    try {
        const savedLanguage = localStorage.getItem(storageKey);
        if (Object.hasOwn(translations, savedLanguage)) initialLanguage = savedLanguage;
    } catch {
        // Storage can be unavailable in private or embedded browser contexts.
    }
    applyLanguage(initialLanguage);
    switcher.hidden = false;

    menuButton.addEventListener('click', () => {
        if (!menu.hidden) {
            closeMenu();
            return;
        }
        menu.hidden = false;
        menuButton.setAttribute('aria-expanded', 'true');
        languageButtons.find(button => button.dataset.lang === currentLanguage).focus();
    });
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyLanguage(button.dataset.lang);
            try {
                localStorage.setItem(storageKey, currentLanguage);
            } catch {
                // The selection still applies to this visit without storage.
            }
            closeMenu(true);
        });
    });
    switcher.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) {
            event.preventDefault();
            closeMenu(true);
        }
    });
    switcher.addEventListener('focusout', event => {
        // Safari may not focus a clicked button. Let the click handler handle
        // null targets so a language option is not hidden before its click.
        if (event.relatedTarget && !switcher.contains(event.relatedTarget)) closeMenu();
    });
    document.addEventListener('click', event => {
        if (!switcher.contains(event.target)) closeMenu();
    });

    document.getElementById('copyright-year').textContent = new Date().getFullYear();
})();
