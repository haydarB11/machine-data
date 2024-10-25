
const i18next = require('i18next');
// const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');

const enTranslation = require('../../locales/en/translation.json');
const arTranslation = require('../../locales/ar/translation.json');

i18next
    // .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        // if you need to load translation from file or server
        // backend: {
        //     loadPath: 'locales/{{lng}}/{{ns}}.json'
        // },
        resources: {
            en: {
                translation: enTranslation
            },
            ar: {
                translation: arTranslation
            }
        },
        interpolation: {
            escapeValue: false
        }
    }, (err, t) => {
        if (err) {
            console.error('i18next initialization failed:', err);
        } else {
            console.log('i18next initialized');
        }
    });

module.exports = i18next;
