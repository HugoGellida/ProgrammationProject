import './PageChoix.css';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';

export default function PageChoix() {

  const [gameShown, setGameShown] = useState([]);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const loadGame = (games) => {
    setGameShown(games);
  }

  useEffect(() => {
    socket.emit('loadGame', sessionStorage.getItem('pseudo'));
  }, []);

  useEffect(() => {

    const teleportPlayer = (idGame) => {
      sessionStorage.setItem("idPartie", parseInt(idGame));
      return navigate("/PageDeJeu");
    }

    socket.on("teleportPlayer", teleportPlayer);
    socket.on("loadGame", loadGame);

    return () => {
      socket.off("teleportPlayer", teleportPlayer);
      socket.off("loadGame", loadGame);
    }
  });

  const goToResumeGames = () => {
    return navigate("/PagePause");
  }

  const goToParameters = () => {
    return navigate("/Parameters");
  }


  const Choix = () => {
    return navigate('/CreationPartie');
  }

  function RejoindrePartieParID() {
    let id = parseInt(document.getElementById("zoneIDPartiePrivée").value);
    socket.emit("joinPerID", id, sessionStorage.getItem("pseudo"));
  }

  const clickGame = (event) => {
    socket.emit("createPlayer", parseInt(event.target.id), sessionStorage.getItem("pseudo"));
  }

  const sortGames = (event) => {
    setFilter(event.target.value);
  }

  return (
    <div className="PageChoix">
      <div className='filter'>
        <button className='choice' onClick={goToParameters}>{t('PageChoix.Options.Parameters')}</button>
        <button className='choice' onClick={goToResumeGames}>{t('PageChoix.Options.Resume')}</button>
        <button className='choice' onClick={Choix}>{t('PageChoix.Options.Create')}</button>
      </div>
      <div className='container'>
        <div className='topCointainerPageChoix'>
          <div className='pseudo'><label className='simpleText'>{sessionStorage.getItem("pseudo")}</label></div>
          <h1 className='h1'>{t('PageChoix.Name')}</h1>
          <div className='perIDZone'>
            <input type='text' id='zoneIDPartiePrivée' placeholder={t('PageChoix.IDPlaceHolder')}></input>
            <button className='buttonPerID' onClick={RejoindrePartieParID}>{t('PageChoix.IDSubmit')}</button>
          </div>
        </div>
        <div className="bottomCointainerPageChoix">
          <select className="Select" onChange={sortGames}>
            <option value="All">{t('PageChoix.Filter.All')}</option>
            <option value="jeu-de-bataille">{t('PageChoix.Filter.War')}</option>
            <option value="6-qui-prend">{t('PageChoix.Filter.Take6')}</option>
            <option value="crazy8">{t('PageChoix.Filter.Crazy8')}</option>
          </select>
          {gameShown.map(game => {
            if (filter === "All" || game.type === filter) {
              return (<button className='joinableGame' id={game.id} onClick={clickGame}>{t('PageChoix.Game', { id: game.id, actualPlayerAmount: game.actualPlayerAmount, playerAmount: game.maxPlayerAmount })} {t(`PageChoix.GameType.${game.type}`)}</button>);
            }
          })}
        </div>
      </div>
    </div>
  );
}