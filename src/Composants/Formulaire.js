import "./Formulaire.css";

export default function Formulaire(Action, DemandeInscription) {

    const RetirerDefault = (e) => {
        e.preventDefault();
        DemandeInscription();
    }

    return (
        <div>
            <form id="loginForm" onSubmit={RetirerDefault}>
                <label className="logTitle" htmlFor="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" maxlength="15" required /><br></br><br></br>

                <label className="logTitle" htmlFor="password">Mot de passe   </label>
                <input type="password" id="password" name="password" maxlength="20" required /><br></br><br></br>
                <button className="submitButton" type="submit" id="submit" value="Confirmer">Confirmer</button>
            </form>
        </div>
    )
}