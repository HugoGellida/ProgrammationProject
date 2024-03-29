import './PageChoix.css';
import Trieur from './../Composants/Trieur';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import Boutton from './../Composants/Boutton';
import { useEffect, useState } from 'react';

function PageChoix() {

  const [gameShown, setGameShown] = useState([]);
  const [filter, setFilter] = useState("All");

  const [firstLaunch, setFirstLaunch] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {

    if (firstLaunch) {
      socket.emit("loadGame");
      setFirstLaunch(false);
    }

    const loadGame = (games) => {
      setGameShown(games);
    }

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
      <h5>Choix de la Partie</h5>
      {Boutton("Parameters", goToParameters)}
      {Boutton("Reprendre une partie", goToResumeGames)}
      <main>
        {Boutton("Créer une Partie", Choix)}
        <select className="Select" id="Select" onChange={sortGames}>
          <option value="All">Tous les jeux</option>
          <option value="jeu-de-bataille">Jeu de Bataille</option>
          <option value="6-qui-prend">6-qui-prend</option>
          <option value="crazy8">crazy8</option>
        </select>
        <div><br></br><input type='text' id='zoneIDPartiePrivée' placeholder="Tapez l'id d'une partie"></input><br></br>
          <br></br></div>
        {Boutton("Entrer", RejoindrePartieParID)}
        <div id="contenu-Parties" className="contenu-partie">
          {gameShown.map(game => {
            if (filter === "All" || game.type === filter) {
              return (<button id={game.id} onClick={clickGame}>Game {`${game.id}\n${game.actualPlayerAmount}/${game.maxPlayerAmount}\n${game.type}`}</button>);
            }
          })}
        </div>
      </main>
    </div>
  );
}

export default PageChoix;
