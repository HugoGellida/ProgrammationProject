import './CreationPartie.css';
import nbrjoueur from './../Composants/nbrjoueur';
import Trieur from './../Composants/Trieur';
import DelaisTour from './../Composants/DelaisTour';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import Boutton from './../Composants/Boutton';

function CreationPartie() {

  const navigate = useNavigate();

  function RedirectP() {
    let nbJoueur = document.getElementById("nbrjoueur").value;
    let Delais = document.getElementById("DelaisTour").value;
    let typedejeu = document.getElementById("Select").options[document.getElementById("Select").selectedIndex].value;
    console.log(nbJoueur, Delais, typedejeu);
    socket.emit("createGame", nbJoueur, typedejeu, sessionStorage.getItem("pseudo"), Delais);
  }

  //* Testing
  socket.emit("createGame", 3, "crazy8", sessionStorage.getItem("pseudo"), 20);
  //socket.emit("createGame", 3, "jeu-de-bataille", sessionStorage.getItem("pseudo"), 20);
  //socket.emit("createGame", 3, "6-qui-prend", sessionStorage.getItem("pseudo"), 20);
  //*

  socket.on("teleportCreator", data => {
    console.log(data);
    sessionStorage.setItem("idPartie", data);
    return navigate('/PageDeJeu');
  });

  return (
    <div className="CreationPartie">
      <h4>CreationPartie</h4>
      <main>
        <label htmlFor="nbrjoueur">Nombre de joueurs: </label>
        {nbrjoueur()}
        <div><br></br><label htmlFor="Type de jeu">Type de jeu: </label></div>
        {Trieur()}
        <div><br></br></div>
        <label htmlFor="nbrjoueur">Delais de Choix de Carte: </label>
        {DelaisTour()}
        <div><br></br></div>
        {Boutton("Suivant", RedirectP)}

      </main>
    </div>
  );
}

export default CreationPartie;
