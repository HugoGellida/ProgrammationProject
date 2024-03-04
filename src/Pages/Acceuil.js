import React from 'react';
import { useNavigate } from "react-router-dom";
import Boutton from './../Composants/Boutton';
import './Acceuil.css';

function Acceuil() {
  console.log("hello");
  const navigate = useNavigate();

  function RedirectionInscription(Choix) {
    return navigate('/Inscription');
  }

  function RedirectionConnexion(Choix) {
    return navigate('/Connexion');
  }

  return (
    <div className="Acceuil">
      <main>
        {Boutton("Inscription", RedirectionInscription)}
        {Boutton("Connexion", RedirectionConnexion)}
      </main>
    </div>
  );
}

export default Acceuil;

