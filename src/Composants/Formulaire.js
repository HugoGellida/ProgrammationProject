import "./Formulaire.css";
import { useTranslation } from "react-i18next";


export default function Formulaire(Action, DemandeInscription) {

    const { t } = useTranslation();

    const RetirerDefault = (e) => {
        e.preventDefault();
        DemandeInscription();
    }

    return (
        <div>
            <form id="loginForm" onSubmit={RetirerDefault}>
                <label className="logTitle" htmlFor="username">{t('Formulaire.Username')}</label>
                <input type="text" id="username" name="username" maxlength="15" required /><br></br><br></br>

                <label className="logTitle" htmlFor="password">{t('Formulaire.Password')}</label>
                <input type="password" id="password" name="password" maxlength="20" required /><br></br><br></br>
                <button className="submitButton" type="submit" id="submit" value="Confirmer">{t('Formulaire.Submit')}</button>
            </form>
        </div>
    )
}