import './connex.css';
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";
import Button from "./../Composants/newComponent/Button.js";
import TextZone from "./../Composants/newComponent/TextZone.js";

function Connexion() {

    let navigate = useNavigate();

    function DemandeConnexion() {
        let pseudo = document.getElementById("username").value;
        let motdepasse = document.getElementById("password").value;
        sessionStorage.setItem("pseudo", pseudo);
        socket.emit("connectionAttempt", pseudo, motdepasse);
    }

    socket.on("connectionAllowed", () => {
        return navigate("/PageChoix");
    });

    function testing(){
        const textOfUsername = document.getElementById("pseudo");
        const textOfPassword = document.getElementById("motdepasse");
        const username = textOfUsername.value;
        const password = textOfPassword.value;
        console.log(username, password);
    }

    return (
        <div className="Connexion">
            <h2>Connexion</h2>

            <main>
                {Formulaire("Connexion", DemandeConnexion)}
                <label> Don't have an account? </label><br></br><Link id="lcl" to="/">Inscription</Link>
            </main>
            <div className='test'>
                <TextZone name="username" id="pseudo"/>
                <TextZone name="password" id="motdepasse"/>
                <Button name="button" id="button" innerText="button" functionCalled={testing}/>
            </div>
        </div>
    );
}

export default Connexion;
