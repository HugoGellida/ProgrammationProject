import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector"
import Inscription from './Translations/InscriptionTranslation';
import Connection from './Translations/ConnectionTranslation';
import PageChoix from './Translations/PageChoixTranslation';
import Parameters from './Translations/ParametersTranslation';
import CreationPartie from './Translations/CreationPartieTranslation';
import Formulaire from './Translations/FormulaireTranslation';
import PagePause from './Translations/PagePauseTranslation';
import Partie from './Translations/PartieTranslation';
import quiprend from './Translations/6quiprendTranslation';
import Bataille from './Translations/BatailleTranslation';
import Crazy8 from './Translations/Crazy8Translation';

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
                    Parameters: Parameters.EN,
                    Inscription: Inscription.EN,
                    Connection: Connection.EN,
                    PageChoix: PageChoix.EN,
                    CreationPartie: CreationPartie.EN,
                    Formulaire: Formulaire.EN,
                    Partie: Partie.EN,
                    Bataille: Bataille.EN,
                    '6quiprend': quiprend.EN,
                    Crazy8: Crazy8.EN,
                    PagePause: PagePause.EN
                }
            },
            fr: {
                translation: {
                    description: {},
                    Parameters: Parameters.FR,
                    Inscription: Inscription.FR,
                    Connection: Connection.FR,
                    PageChoix: PageChoix.FR,
                    CreationPartie: CreationPartie.FR,
                    Formulaire: Formulaire.FR,
                    Partie: Partie.FR,
                    Bataille: Bataille.FR,
                    '6quiprend': quiprend.FR,
                    Crazy8: Crazy8.FR,
                    PagePause: PagePause.FR
                }
            },
            esp: {
                translation: {
                    description: {},
                    Parameters: Parameters.ESP,
                    Inscription: Inscription.ESP,
                    Connection: Connection.ESP,
                    PageChoix: PageChoix.ESP,
                    CreationPartie: CreationPartie.ESP,
                    Formulaire: Formulaire.ESP,
                    Partie: Partie.ESP,
                    Bataille: Bataille.ESP,
                    '6quiprend': quiprend.ESP,
                    Crazy8: Crazy8.ESP,
                    PagePause: PagePause.ESP
                }
            }
        }
    });

export default i18n