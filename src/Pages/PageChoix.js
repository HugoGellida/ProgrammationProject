import './PageChoix.css';
import Trieur from './../Composants/Trieur';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import Boutton from './../Composants/Boutton';

let listeTypes = [];

function PageChoix() {

  socket.on("loadGame", (allGameID, allGamePlayerAmount, allGameType) => {
    listeTypes = [];
    let div = document.getElementById("contenu-Parties");
    div.innerHTML = "";
    for (let i = 0; i < allGameID.length; i++) {
      let b = document.createElement("button");
      b.addEventListener("click", (event) => {
        socket.emit("createPlayer", allGameID[i], sessionStorage.getItem("pseudo"));
        sessionStorage.setItem("idPartie", allGameID[i]);
        return navigate("/PageDeJeu");
      });
      b.innerText = `Rejoinde Partie${allGameID[i]}| Nombre de joueur: ${allGamePlayerAmount[i]}| Type de jeu: ${allGameType[i]}`;
      div.appendChild(b);
      listeTypes.push(allGameType[i]);
    }
  });

  socket.on("gameUnableToJoin", () => {
    socket.emit("loadGame");
  })

  socket.emit("loadGame");

  const navigate = useNavigate();
  function Choix() {
    return navigate('/CreationPartie');
  }

  socket.on("gameCreated", (idGame, playerAmount, typeOfGame) => {
    let div = document.getElementById("contenu-Parties");
    div.innerHTML = "";
    let b = document.createElement("button");
    b.addEventListener("click", (event) => {
      socket.emit("createPlayer", idGame, sessionStorage.getItem("pseudo"));
      sessionStorage.setItem("idPartie", idGame);
      return navigate("/PageDeJeu");
    });
    b.innerText = `Rejoinde Partie${idGame}| Nombre de joueur: ${playerAmount}| Type de jeu: ${typeOfGame}`;
    div.appendChild(b);
    listeTypes.push(typeOfGame);
  });

  function RejoindrePartieParID() {
    let id = document.getElementById("zoneIDPartiePrivée").value;
    socket.emit("joinPerID", id, sessionStorage.getItem("pseudo"));
  }

  function Scores() {
    navigate("/PageScores");
  }

  function goToResumeGames() {
    navigate("./PagePause");
  }

  return (
    <div className="PageChoix">
      <h5>Choix de la Partie</h5>
      <button id='Scores' onClick={Scores}>Scores</button>
      {Boutton("Reprendre une partie", goToResumeGames())}
      <main>
        {Boutton("Créer une Partie", Choix)}
        {Trieur()}
        <div><br></br><input type='text' id='zoneIDPartiePrivée' placeholder="Tapez l'id d'une partie"></input><br></br>
          <br></br></div>
        {Boutton("Entrer", RejoindrePartieParID)}
        <div id="contenu-Parties" className="contenu-partie">
        </div>
      </main>
    </div>
  );
}

export default PageChoix;
