import './CreationPartie.css';
import nbrjoueur from './../Composants/nbrjoueur';
import Trieur from './../Composants/Trieur';
import DelaisTour from './../Composants/DelaisTour';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import Boutton from './../Composants/Boutton';
import { useEffect, useState } from 'react';

function CreationPartie() {

  const [infoGame, setInfoGame] = useState({});
  const [showPrivateOption, setShowPrivateOption] = useState(false);

  const navigate = useNavigate();

  function stockGameInfo() {
    let nbJoueur = document.getElementById("nbrJoueur").value;
    let Delais = document.getElementById("DelaisTour").value;
    console.log('hmm');
    let typedejeu = document.getElementById("Select").options[document.getElementById("Select").selectedIndex].value;
    setInfoGame({ playerAmount: nbJoueur, timer: Delais, type: typedejeu, creator: sessionStorage.getItem("pseudo") });
    setShowPrivateOption(true);
    console.log(nbJoueur, Delais, typedejeu);
    //socket.emit("createGame", nbJoueur, typedejeu, sessionStorage.getItem("pseudo"), Delais);
  }

  function stockGameStatus() {
    const gameStatus = document.getElementById("gameStatus").options[document.getElementById("gameStatus").selectedIndex].value;
    socket.emit("createGame", { ...infoGame, gameStatus: gameStatus });
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
      <h4>CreationPartie</h4>
      <div className='creationOptions'>
        {!showPrivateOption && (
          <>
            <label className='simpleText' htmlFor="playerAmount">Nombre de joueurs: </label>
            <input id='nbrJoueur' className='numberInput' type='number' max="10" min="2" defaultValue='2' required />
            <br></br>
            <label className='simpleText' htmlFor="Type de jeu">Type de jeu: </label>
            <select id='Select' className="gameChoice">
              <option value="jeu-de-bataille">Jeu de Bataille</option>
              <option value="6-qui-prend">6-qui-prend</option>
              <option value="crazy8">crazy8</option>
            </select>
            <br></br>
            <label className='simpleText' htmlFor="DelaisTour">Delais de Choix de Carte: </label>
            <input id='DelaisTour' className='numberInput' type='number' max="30" min="5" defaultValue="5" required />
            <br></br>
            <button className='button' onClick={stockGameInfo}>Suivant</button>
            <div><br></br></div>
          </>
        )}
        {showPrivateOption && (
          <>
            <select id='gameStatus' className='gameChoice'>
              <option value="public">Partie publique</option>
              <option value="private">Partie privée</option>
            </select>
            <button className='button' onClick={stockGameStatus}>Créer la partie</button>
          </>

        )}
      </div>
    </div>
  );
}

export default CreationPartie;
