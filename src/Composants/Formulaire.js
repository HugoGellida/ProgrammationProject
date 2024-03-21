import "./Formulaire.css";

export default function Formulaire(Action, DemandeInscription) {

    const RetirerDefault = (e) => {
        e.preventDefault();
        DemandeInscription();
    }

    return (
        <div>
            <form id="loginForm" onSubmit={RetirerDefault}>
                <label htmlFor="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" required /><br></br><br></br>

                <label htmlFor="password">Mot de passe   </label>
                <input type="password" id="password" name="password" required /><br></br><br></br>
                <button type="submit" id="submit" value="Confirmer">Confirmer</button>
            </form>
        </div>
    )
}