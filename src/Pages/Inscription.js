import './inscription.css';
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from 'react';

function Inscription() {

  const navigate = useNavigate();

  function DemandeInscription() {
    const pseudo = document.getElementById("username").value;
    const motdepasse = document.getElementById("password").value;
    socket.emit("registrationAttempt", pseudo, motdepasse);
  }

  useEffect(() => {
    const registrationAllowed = (pseudo) => {
      sessionStorage.setItem("pseudo", pseudo);
      return navigate('/PageChoix');
    }

    socket.on("registrationAllowed", registrationAllowed);

    return () => {
      socket.off("registrationAllowed", registrationAllowed);
    }
  })


  return (
    <div className="Inscription">
      <h2>Inscription</h2>

      <main>
        {Formulaire("Inscription", DemandeInscription)}<br></br>
        <label> you have an account? </label><br></br><Link to="/Connex">Connexion</Link> 
      </main>
    </div>
  );
}

export default Inscription;