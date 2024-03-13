import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import { useEffect, useState } from "react";



function Pagepause() {
  const [gamePaused, setGamePaused] = useState([]);
  const [firstLaunch, setFirstLaunch] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (firstLaunch){
      socket.emit("askPausedGames", sessionStorage.getItem("pseudo"));
      setFirstLaunch(false);
    }

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
    <>
      <button id='Retour' onClick={Retour}>Retour</button>
      <div id="contenu-Parties">
        {gamePaused.map(game => {
          return (<button id={game.id} onClick={handleClickGame}>Jeu {game.id} {game.playerAmount} players {game.type}</button>);
        })}
      </div>
    </>
  );
}

export default Pagepause;