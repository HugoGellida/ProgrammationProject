import './PageChoix.css';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import Boutton from './../Composants/Boutton';
import { useEffect, useState } from 'react';

export default function PageChoix() {

  const [gameShown, setGameShown] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const loadGame = (games) => {
    setGameShown(games);
  }

  useEffect(() => {
    socket.emit('loadGame');
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
        <button className='choice' onClick={goToParameters}>Parametres</button>
        <button className='choice' onClick={goToResumeGames}>Reprendre une partie</button>
        <button className='choice' onClick={Choix}>Créer une partie</button>
      </div>
      <div className='container'>
        <div className='topCointainerPageChoix'>
          <h1 className='h1'>Choix de la Partie</h1>
          <div className='perIDZone'>
            <input type='text' id='zoneIDPartiePrivée' placeholder="Tapez l'id d'une partie"></input>
            <button className='buttonPerID' onClick={RejoindrePartieParID}>Entrer</button>
          </div>
        </div>
        <div className="bottomCointainerPageChoix">
          <select className="Select" onChange={sortGames}>
            <option value="All">Tous les jeux</option>
            <option value="jeu-de-bataille">Jeu de Bataille</option>
            <option value="6-qui-prend">6-qui-prend</option>
            <option value="crazy8">crazy8</option>
          </select>
          {gameShown.map(game => {
            if (filter === "All" || game.type === filter) {
              return (<button className='joinableGame' id={game.id} onClick={clickGame}>Game {`${game.id}\n${game.actualPlayerAmount}/${game.maxPlayerAmount}\n${game.type}`}</button>);
            }
          })}
        </div>
      </div>
    </div>
  );
}