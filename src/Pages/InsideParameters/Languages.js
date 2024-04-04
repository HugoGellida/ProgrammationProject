import { useTranslation } from "react-i18next";


export default function Languages() {

    const { t, i18n } = useTranslation();
    
    const lngs = {
        en: {nativeName: 'English'},
        fr: {nativeName: 'Français'}
    }

    return (
        <>
            {Object.keys(lngs).map(lng => (
                <>
                    <button onClick={() => {i18n.changeLanguage(lng)}}>{t(`Parameters.Languages.${lngs[lng].nativeName}`)}</button>
                </>
            ))}
        </>
    )
}