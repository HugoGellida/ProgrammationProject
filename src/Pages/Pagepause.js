import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import { useEffect, useState } from "react";
import "./PagePause.css";
import { useTranslation } from "react-i18next";

function Pagepause() {
  const [gamePaused, setGamePaused] = useState([]);
  const [actualNavigation, setActualNavigation] = useState("jeu-de-bataille");

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    socket.emit("askPausedGames", sessionStorage.getItem("pseudo"));
  }, []);

  useEffect(() => {

    const sendPausedGames = (games) => {
      setGamePaused(games);
    }

    socket.on("sendPausedGames", sendPausedGames);

    return () => {
      socket.off("sendPausedGames", sendPausedGames);
    }
  });

  const handleClickGame = (event) => {
    sessionStorage.setItem("idPartie", parseInt(event.target.id));
    socket.emit("joinPausedGame", event.target.id, sessionStorage.getItem("pseudo"));
    return navigate("/PageDeJeu");
  }

  const Retour = () => {
    return navigate('/PageChoix')
  }

  return (
    <div className="PagePause">
      <div className="filter">
        <button className="choice" onClick={Retour} style={{ marginBottom: 'auto' }}>{t('PagePause.Filter.Leave')}</button>
        <button className="choice" onClick={() => { setActualNavigation("jeu-de-bataille") }} style={{ backgroundColor: actualNavigation === "jeu-de-bataille" ? "red" : "" }}>{t('PagePause.Filter.War')}</button>
        <button className="choice" onClick={() => { setActualNavigation("6-qui-prend") }} style={{ backgroundColor: actualNavigation === "6-qui-prend" ? "red" : "" }}>{t('PagePause.Filter.Take6')}</button>
        <button className="choice" onClick={() => { setActualNavigation("crazy8") }} style={{ backgroundColor: actualNavigation === "crazy8" ? "red" : "" }}>{t('PagePause.Filter.Crazy8')}</button>
      </div>
      <div className="container" style={{ justifyContent: 'flex-start', flexWrap: "wrap" }}>
        {gamePaused.map(game => {
          if (game.type === actualNavigation) return (<button className="pagePauseButton" onClick={handleClickGame}>{t('PagePause.Game', {id: game.id, playerAmount: game.playerAmount})}</button>);
          else return (<></>);
        })}
      </div>
    </div>
  );
}

export default Pagepause;