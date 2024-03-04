import './inscription.css';
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";

function Inscription() {

  const navigate = useNavigate();

  function DemandeInscription() {
    let pseudo = document.getElementById("username").value;
    let motdepasse = document.getElementById("password").value;
    sessionStorage.setItem("pseudo", pseudo);
    socket.emit("registrationAttempt", pseudo, motdepasse);
  }


  socket.on("registrationAllowed", data => {
    return navigate('/PageChoix');
  });


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