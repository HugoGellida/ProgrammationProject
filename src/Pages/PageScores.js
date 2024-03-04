import './PageScores.css';
import { useNavigate } from "react-router-dom";
import { socket } from './socket';


function PageScores() {
  socket.emit("askStat", sessionStorage.getItem("pseudo"));
  socket.on("infoStat", data => { // data = [nbPartie gagnées, nbPartie perdues, record, moyenne de points];
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
    }
    infoStat6quiprend(data[0])
    infoStatBataille(data[1])
  });

  const navigate = useNavigate();


  function Retour() {
    navigate('/PageChoix')
  }

  function infoStat6quiprend(Infos) {
    let div = document.getElementById("J6QP")
    div.innerText = "Jeu : 6 Qui Prend " + "\n"
    div.innerText += "\n" + "Nombre de Parties Gagnées : " + Infos[0] + "\n" + "\n"
    div.innerText += "Nombre de Parties perdues : " + Infos[1] + "\n" + "\n"
    div.innerText += "Records : " + Infos[2] + "\n" + "\n"
    div.innerText += "Moyenne de points : " + Infos[3] + "\n"
  }
  function infoStatBataille(Infos) {
    let div = document.getElementById("Bataille")
    div.innerText = "Jeu : Bataille " + "\n"
    div.innerText += "\n" + "Nombre de Parties Gagnées : " + Infos[0] + "\n" + "\n"
    div.innerText += "Nombre de Parties perdues : " + Infos[1] + "\n" + "\n"
  }


  return (
    <div className="PageScores">
      <button id='Retour' onClick={Retour}>Retour</button>
      <div id="J6QP" className="J6QP">
      </div>
      <div id="Bataille" className="Bataille">
      </div>
    </div>
  );
}

export default PageScores;
