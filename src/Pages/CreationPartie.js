import './CreationPartie.css';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";


function CreationPartie() {

  const [infoGame, setInfoGame] = useState({});
  const [showPrivateOption, setShowPrivateOption] = useState(false);
  const [showBotOption, setShowBotOption] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  function stockGameInfo() {
    let nbJoueur = document.getElementById("nbrJoueur").value;
    let Delais = document.getElementById("DelaisTour").value;
    let typedejeu = document.getElementById("Select").options[document.getElementById("Select").selectedIndex].value;
    setInfoGame({ playerAmount: nbJoueur, timer: Delais, type: typedejeu, creator: sessionStorage.getItem("pseudo") });
    setShowPrivateOption(true);
  }

  function stockGameStatus() {
    const gameStatus = document.getElementById("gameStatus").options[document.getElementById("gameStatus").selectedIndex].value;
    setInfoGame({ ...infoGame, gameStatus: gameStatus });
    if (infoGame.type !== '6-qui-prend') socket.emit("createGame", infoGame);
    else {
      setShowBotOption(true);
      setShowPrivateOption(false);
    }
  }

  function bots() {
    socket.emit("createGame", { ...infoGame, RBotAmount: document.getElementById('RBots').value });
  }

  useEffect(() => {
    const teleportCreator = (idGame) => {
      sessionStorage.setItem("idPartie", idGame);
      return navigate('/PageDeJeu');
    }

    socket.on("teleportCreator", teleportCreator);

    return () => {
      socket.off("teleportCreator", teleportCreator);
    }
  });

  return (
    <div className="CreationPartie">
      <h4>{t('CreationPartie.Name')}</h4>
      <div className='creationOptions'>
        {!showPrivateOption && !showBotOption && (
          <>
            <label className='simpleText' htmlFor="playerAmount">{t('CreationPartie.Labels.PlayerAmount')}</label>
            <input id='nbrJoueur' className='numberInput' type='number' max="10" min="2" defaultValue='2' required />
            <br></br>
            <label className='simpleText' htmlFor="Type de jeu">{t('CreationPartie.Labels.Type')}</label>
            <select id='Select' className="gameChoice">
              <option value="jeu-de-bataille">{t('CreationPartie.GameType.War')}</option>
              <option value="6-qui-prend">{t('CreationPartie.GameType.Take6')}</option>
              <option value="crazy8">{t('CreationPartie.GameType.Crazy8')}</option>
            </select>
            <br></br>
            <label className='simpleText' htmlFor="DelaisTour">{t('CreationPartie.Labels.Timer')}</label>
            <input id='DelaisTour' className='numberInput' type='number' max="30" min="5" defaultValue="5" required />
            <br></br>
            <button className='button' onClick={stockGameInfo}>{t('CreationPartie.Next')}</button>
            <div><br></br></div>
          </>
        )}
        {showPrivateOption && (
          <>
            <select id='gameStatus' className='gameChoice'>
              <option value="public">{t('CreationPartie.GameVisual.Public')}</option>
              <option value="private">{t('CreationPartie.GameVisual.Private')}</option>
            </select>
            <button className='button' onClick={stockGameStatus}>{t('CreationPartie.Submit')}</button>
          </>
        )}
        {showBotOption && (
          <>
            <label className='simpleText'>{t("CreationPartie.Bots.Random")}</label>
            <input type='number' id='RBots'  max={infoGame.playerAmount - 1} min={0} defaultValue={0}/>
            <button className='button' onClick={bots}>{t('CreationPartie.Submit')}</button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreationPartie;
