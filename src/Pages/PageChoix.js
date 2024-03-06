import './PageChoix.css';
import Trieur from './../Composants/Trieur';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';
import Boutton from './../Composants/Boutton';

function PageChoix() {

  socket.on("loadGame", (allGameID, allGamePlayerAmount, allGameType, actualPlayerAmounts) => {
    let div = document.getElementById("contenu-Parties");
    div.innerHTML = "";
    for (let i = 0; i < allGameID.length; i++) {
      let b = document.createElement("button");
      b.addEventListener("click", (event) => {
        socket.emit("createPlayer", allGameID[i], sessionStorage.getItem("pseudo"));
        sessionStorage.setItem("idPartie", allGameID[i]);
        return navigate("/PageDeJeu");
      });
      b.innerText = `Game ${allGameID[i]}\n${actualPlayerAmounts[i]}/${allGamePlayerAmount[i]}\n${allGameType[i]}`;
      div.appendChild(b);
    }
  });

  socket.on("refreshGameList", () => {
    socket.emit("loadGame");
  })

  socket.emit("loadGame");

  const navigate = useNavigate();
  function Choix() {
    return navigate('/CreationPartie');
  }

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
