// Internationalization (i18n) Manager
// Supports language switching and dynamic translation updates

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || navigator.language.substring(0, 2) || 'en';
        this.translations = {};
        this.supportedLanguages = ['en', 'fr', 'es', 'pt'];
    }

    async loadLanguage(lang) {
        // Fallback to English if language not supported
        if (!this.supportedLanguages.includes(lang)) {
            lang = 'en';
        }

        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations = await response.json();
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            return true;
        } catch (error) {
            console.error('Error loading language:', error);
            if (lang !== 'en') {
                // Fallback to English
                return this.loadLanguage('en');
            }
            return false;
        }
    }

    t(key, defaultValue = key) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }

        return value;
    }

    setLanguage(lang) {
        if (this.supportedLanguages.includes(lang)) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            location.reload(); // Reload page to apply new language
        }
    }

    getLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'fr': 'Français',
            'es': 'Español',
            'pt': 'Português'
        };
        return names[lang] || lang;
    }
}

// Global i18n instance
const i18n = new I18n();

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', async () => {
    await i18n.loadLanguage(i18n.currentLanguage);
    updatePageTranslations();
});

function updatePageTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translated = i18n.t(key);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            if (element.getAttribute('placeholder') === element.getAttribute('data-i18n-placeholder')) {
                element.setAttribute('placeholder', i18n.t(element.getAttribute('data-i18n-placeholder')));
            } else {
                element.value = translated;
            }
        } else {
            element.textContent = translated;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        element.setAttribute('placeholder', i18n.t(element.getAttribute('data-i18n-placeholder')));
    });

    // Update title and meta tags
    const titleElement = document.querySelector('[data-i18n-title]');
    if (titleElement) {
        document.title = i18n.t(titleElement.getAttribute('data-i18n-title'));
    }
}

// Function to manually change language
function changeLanguage(lang) {
    i18n.setLanguage(lang);
}
