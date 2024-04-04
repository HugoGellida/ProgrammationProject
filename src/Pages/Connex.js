import './connex.css';
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

function Connexion() {

    const [showWarning, setShowWarning] = useState(false);

    let navigate = useNavigate();

    function DemandeConnexion() {
        const pseudo = document.getElementById("username").value;
        const motdepasse = document.getElementById("password").value;
        socket.emit("connectionAttempt", pseudo, motdepasse);
    }
    useEffect(() => {
        const connectionAllowed = (pseudo) => {
            sessionStorage.setItem("pseudo", pseudo);
            return navigate("/PageChoix");
        }

        const connectionDenied = () => {
            setShowWarning(true);
        }

        socket.on("connectionAllowed", connectionAllowed);
        socket.on("connectionDenied", connectionDenied);
        return () => {
            socket.off("connectionAllowed", connectionAllowed);
            socket.off("connectionDenied", connectionDenied);
        }
    });

    const removeWarning = () => {
        setShowWarning(false);
    }

    return (
        <div className="Connexion">
            <h2 className='h2'>Connexion</h2>
            <div className='connexionForm'>
                {Formulaire("Connexion", DemandeConnexion)}
                <br></br>
                <label className='simpleText'>Vous n'avez pas de compte?</label><br></br><Link id="lcl" to="/">Inscription</Link>
            </div>
            {showWarning && (
                <div>
                    <label>Connection refusée</label>
                    <button onClick={removeWarning}>Continuer</button>
                </div>
            )}
        </div>
    );
}

export default Connexion;
