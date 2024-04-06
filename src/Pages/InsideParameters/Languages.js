import { useTranslation } from "react-i18next";
import "./Languages.css";

export default function Languages() {

    const { t, i18n } = useTranslation();

    const lngs = {
        en: { nativeName: 'English' },
        fr: { nativeName: 'Français' },
        esp: { nativeName: 'Espagñol' }
    }

    return (
        <div className="LanguagesContainer">
            {Object.keys(lngs).map(lng => (
                <button className="LanguageChanger" onClick={() => { i18n.changeLanguage(lng) }}>{t(`Parameters.Languages.${lngs[lng].nativeName}`)}</button>
            ))}
        </div>
    )
}

