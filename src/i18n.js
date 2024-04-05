import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector"
import ParametersEN from './Translations/EN/ParametersTranslation'; import ParametersFR from './Translations/FR/ParametersTranslation';
import InscriptionEN from './Translations/EN/InscriptionTranslation'; import InscriptionFR from './Translations/FR/InscriptionTranslation';
import FormulaireEN from './Translations/EN/FormulaireTranslation'; import FormulaireFR from './Translations/FR/FormulaireTranslation';
import ConnexFR from './Translations/FR/ConnexTranslation'; import ConnexEN from './Translations/EN/ConnexTranslation';
import PageChoixEN from './Translations/EN/PageChoixTranslation'; import PageChoixFR from './Translations/FR/PageChoixTranslation';
import CreationPartieEN from './Translations/EN/CreationPartieTranslation'; import CreationPartieFR from './Translations/FR/CreationPartieTranslation';
import PartieEN from './Translations/EN/PartieTranslation'; import PartieFR from './Translations/FR/PartieTranslation';
import BatailleEN from './Translations/EN/BatailleTranslation'; import BatailleFR from './Translations/FR/BatailleTranslation';
import quiprendEN from './Translations/EN/6quiprendTranslation'; import quiprendFR from './Translations/FR/6quiprendTranslation';
import Crazy8EN from './Translations/EN/Crazy8Translation'; import Crazy8FR from './Translations/FR/Crazy8Translation';
import PagePauseFR from './Translations/FR/PagePauseTranslation'; import PagePauseEN from './Translations/EN/PagePauseTranslation';

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
                    Parameters: ParametersEN,
                    Inscription: InscriptionEN,
                    Connection: ConnexEN,
                    PageChoix: PageChoixEN,
                    CreationPartie: CreationPartieEN,
                    Formulaire: FormulaireEN,
                    Partie: PartieEN,
                    Bataille: BatailleEN,
                    '6quiprend': quiprendEN,
                    Crazy8: Crazy8EN,
                    PagePause: PagePauseEN
                }
            },
            fr: {
                translation: {
                    description: {},
                    Parameters: ParametersFR,
                    Inscription: InscriptionFR,
                    Connection: ConnexFR,
                    PageChoix: PageChoixFR,
                    CreationPartie: CreationPartieFR,
                    Formulaire: FormulaireFR,
                    Partie: PartieFR,
                    Bataille: BatailleFR,
                    '6quiprend': quiprendFR,
                    Crazy8: Crazy8FR,
                    PagePause: PagePauseFR
                }
            }
        }
    });

export default i18n