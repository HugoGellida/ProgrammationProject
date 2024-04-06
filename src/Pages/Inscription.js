import './inscription.css';
import "./../Composants/Boutton.css"
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Alert from '../Composants/Alert.js';

export default function Inscription() {

  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    const registrationDenied = () => {
      setShowWarning(true);
    }

    if (sessionStorage.getItem('pseudo')) navigate('/PageChoix');

    socket.on("registrationAllowed", registrationAllowed);
    socket.on("registrationDenied", registrationDenied);
    return () => {
      socket.off("registrationAllowed", registrationAllowed);
      socket.off("registrationDenied", registrationDenied);
    }
  }, []);

  return (
    <div className='Inscription'>
      <h2 className='h2'>{t('Inscription.Name')}</h2>
      <div className='inscriptionForm'>
        {Formulaire("Inscription", DemandeInscription)}<br></br>
        <label className='simpleText'>{t('Inscription.ChangeLocationText')}</label><br></br><Link to="/Connex">{t('Inscription.ChangeLocation')}</Link>
      </div>
      {showWarning && (
        <Alert message={t('Inscription.FailedAttempt')} buttonMessage={t('Inscription.FailedAttemptButton')} onClick={() => {setShowWarning(false)}} />
      )}
    </div>
  );
}