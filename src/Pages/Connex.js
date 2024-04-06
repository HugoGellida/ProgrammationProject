import './connex.css';
import Formulaire from './../Composants/Formulaire';
import { socket } from "./socket.js";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Alert from '../Composants/Alert.js';


function Connexion() {

    const [showWarning, setShowWarning] = useState(false);

    let navigate = useNavigate();
    const { t } = useTranslation();

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
            <h2 className='h2'>{t('Connection.Name')}</h2>
            <div className='connexionForm'>
                {Formulaire("Connexion", DemandeConnexion)}
                <br></br>
                <label className='simpleText'>{t('Connection.ChangeLocationText')}</label><br></br><Link id="lcl" to="/">{t('Connection.ChangeLocation')}</Link>
            </div>
            {showWarning && (
                <Alert message={t('Connection.FailedAttempt')} buttonMessage={t('Connection.FailedAttemptButton')} onClick={() => {setShowWarning(false)}} />
            )}
        </div>
    );
}

export default Connexion;
