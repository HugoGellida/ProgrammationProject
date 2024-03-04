import { useNavigate } from "react-router-dom";
import { socket } from './socket';



function Pagepause() {
  socket.on("demandePartiePause", data => {
    console.log(data);
    let div = document.getElementById("contenu-Parties");
    for (let i = 0; i < data.length; i++) {
      let b = document.createElement("button");
      b.addEventListener("click", (event) => {
        sessionStorage.setItem("idPartie", data[i][0])
        socket.emit("rejoindrePartiePause", [data[i][0], sessionStorage.getItem("pseudo")]);
        console.log(data[i][0]);
        navigate("/PageDeJeu");
      });
      b.innerText = "Rejoinde Partie" + data[i][0] + ":";
      div.appendChild(b);
  
    }
  });
  socket.emit("demandePartiePause", [sessionStorage.getItem("pseudo")]);
  const navigate = useNavigate();

  function Retour() {
    navigate('/PageChoix')
  }

  return (
    <div className="Pagepause">
      <button id='Retour' onClick={Retour}>Retour</button>
      <div id="contenu-Parties"></div>
    </div>
  );
}

export default Pagepause;