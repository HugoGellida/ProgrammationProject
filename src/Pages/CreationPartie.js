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
    let nbJoueur = document.getElementById("nbrjoueur").value;
    let Delais = document.getElementById("DelaisTour").value;
    let typedejeu = document.getElementById("Select").options[document.getElementById("Select").selectedIndex].value;
    setInfoGame({ playerAmount: nbJoueur, timer: Delais, type: typedejeu, creator: sessionStorage.getItem("pseudo")});
    setShowPrivateOption(true);
    console.log(nbJoueur, Delais, typedejeu);
    //socket.emit("createGame", nbJoueur, typedejeu, sessionStorage.getItem("pseudo"), Delais);
  }

  function stockGameStatus(){
    const gameStatus = document.getElementById("gameStatus").options[document.getElementById("gameStatus").selectedIndex].value;
    socket.emit("createGame", {...infoGame, gameStatus: gameStatus});
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
      <main>
        {!showPrivateOption && (
          <>
            <label htmlFor="nbrjoueur">Nombre de joueurs: </label>
            {nbrjoueur()}
            <div><br></br><label htmlFor="Type de jeu">Type de jeu: </label></div>
            {Trieur()}
            <div><br></br></div>
            <label htmlFor="nbrjoueur">Delais de Choix de Carte: </label>
            {DelaisTour()}
            {Boutton("Suivant", stockGameInfo)}
            <div><br></br></div>
          </>
        )}
        {showPrivateOption && (
          <>
            <select id='gameStatus'>
              <option value="public">Partie publique</option>
              <option value="private">Partie privée</option>
            </select>
            {Boutton("Suivant", stockGameStatus)}
          </>

        )}

      </main>
    </div>
  );
}

export default CreationPartie;
