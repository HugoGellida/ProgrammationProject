import './connex.css';
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";
import Button from "./../Composants/newComponent/Button.js";
import TextZone from "./../Composants/newComponent/TextZone.js";
import { useEffect, useState } from 'react';

function Connexion() {

    let navigate = useNavigate();

    function DemandeConnexion() {
        let pseudo = document.getElementById("username").value;
        let motdepasse = document.getElementById("password").value;
        sessionStorage.setItem("pseudo", pseudo);
        socket.emit("connectionAttempt", pseudo, motdepasse);
    }
    useEffect(() => {
        const connectionAllowed = () => {
            return navigate("/PageChoix");
        }
        socket.on("connectionAllowed", connectionAllowed);
        return () => {
            socket.off("connectionAllowed", connectionAllowed);
        }
    });

    return (
        <div className="Connexion">
            <h2>Connexion</h2>
            <main>
                {Formulaire("Connexion", DemandeConnexion)}
                <label> Don't have an account? </label><br></br><Link id="lcl" to="/">Inscription</Link>
            </main>
        </div>
    );
}

export default Connexion;
