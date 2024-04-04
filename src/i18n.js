import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector"
import ParametersEN from './Translations/EN/ParametersTranslation';
import ParametersFR from './Translations/FR/ParametersTranslation';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbacklng: 'fr',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    description: {},
                    Parameters: ParametersEN
                }
            },
            fr: {
                translation: {
                    description: {},
                    Parameters: ParametersFR
                }
            }
        }
    });

export default i18n