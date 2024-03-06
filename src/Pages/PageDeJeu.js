import './PageDeJeu.css';
import { socket } from "./socket.js";
import EmplacementAdversaires from "./../Composants/EmplacementAdversaires"
import EmplacementJoueur from './../Composants/EmplacementJoueur';
import CartesJouees from './../Composants/CartesJouees'
import React from 'react';
import Tchat from './../Composants/Tchat.js'
import CartesGagnees from './../Composants/CartesGagnees.js'
import CartesJouees2 from './../Composants/CartesJouees2.js'
import Scorejoueur from './../Composants/ScoreJoueur'
import { useNavigate } from "react-router-dom";


function PageDeJeu() {
  let ListeAdv = {};
  let PosCarte = {};
  let Delais;
  let ListeCJ;
  let clic;
  let Div;
  let Div2;
  let Div3;
  let a;

  const navigate = useNavigate();

  function Affichage() {
    console.log("oui");
    socket.emit("LancementPartie", sessionStorage.getItem("idPartie"));
  }

  function CartesJoueur(ListeCartes){
    ListeCJ = ListeCartes.length;
    for (let i = 1; i < ListeCartes.length + 1; i++) {
      if (!document.getElementById("Cartes-" + i)) {
        let a;
        a = document.createElement('div');
        a.id = "Cartes-" + i
        document.getElementById('Joueur').appendChild(a)
      }
    }
  }

  function StyleCartesJoueurBataille(ListeCartes){
    for (let i = 1; i < ListeCartes.length+1; i++) {
        a = document.getElementById("Cartes-" + i);
        if (a) {
            a.style.backgroundImage = "url('./images/" + ListeCartes[i - 1] + ".png')";
            a.style.marginTop = "2%";
            a.style.height = "15%";
            a.className = ListeCartes[i - 1];
            PosCarte[ListeCartes[i - 1]] = i
        }
    }
    document.getElementById('Joueur').style.width = "60%";
    document.getElementById('Joueur').style.top = "30%";
    document.getElementById('Joueur').style.left = "50%";


    if (!document.getElementById("CartesJ1")){
        a = document.createElement('div');
        a.id = "CartesJ1"
        a.style.marginLeft = "none"
        a.style.width = "8%"
        document.getElementById('Joueur').appendChild(a)
    }
    else {
        document.getElementById("CartesJ1").style.backgroundImage = "none"
    }

  }

  function StyleCartesJoueur6QP(ListeCartes){
    for (let i = 1; i < ListeCartes.length+1; i++) {
        Div = document.getElementById("Cartes-" + i);
        if (Div) {
          Div.style.display = "flex";
          Div.style.bottom = '0%'
          Div.style.height = '14%'
          Div.style.backgroundImage = "url('./images2/" + ListeCartes[i - 1] + ".svg')";
          Div.className = ListeCartes[i - 1];
          PosCarte[ListeCartes[i - 1]] = i
          Div.style.backgroundSize = "cover";
        }
    }
    if (!document.getElementById("CartesJ1")) {
        let a;
        a = document.createElement('div');
        a.id = "CartesJ1"
        document.getElementById('CartesJouees2').appendChild(a)
  
  
      }
      else {
        document.getElementById("CartesJ1").style.backgroundImage = "none"
    }
  }

  function AttributionAdversaire(ListAdv){
    let j = 1;
    for (let i = 0; i < ListAdv.length; i++) {
      if (sessionStorage.getItem("pseudo") !=ListAdv[i]) {
        ListeAdv[ListAdv[i]] = j;
        j++;
      }
    }
  }

  function AffichageDecompte(Duree){
    Delais = Duree
    document.getElementById("Decompte").style.display = "flex"
    document.getElementById("Decompte").innerText = Delais //
  }

  function EmplAdversaires(ListePseudosJoueur) {
    document.getElementById("Boutton").style.display = "none";
    for (let i = 1; i < ListePseudosJoueur.length; i++) {
      if (!document.getElementById("Adversaire-" + i)) {
        Div = document.createElement('div');
        Div.id = "Adversaire-" + i
        Div2 = document.createElement('div');
        Div2.id = "Pseudo-" + i
        Div3 = document.createElement('div');
        Div3.id = "Case-" + i
        Div3.appendChild(Div)
        Div3.appendChild(Div2)
        document.getElementById('Adversaires').appendChild(Div3)
      }
      else {
        document.getElementById("Adversaire-" + i).style.backgroundImage = "none"
      }
    }



    for (let i in ListeAdv) {
        Div = document.getElementById("Pseudo-" + ListeAdv[i]);
        if (Div) {
          let Verif1 = document.getElementById('Infos' + ListeAdv[i])
          let Verif2 = document.getElementById('nbcartes' + ListeAdv[i])
          if (!Verif1 && !Verif2) {
            let Elem = document.createElement('div');
            Elem.id = 'Infos' + ListeAdv[i]
            Elem.innerText = i
            let Elem2 = document.createElement('div');
            Elem2.id = 'nbcartes' + ListeAdv[i];
            Elem2.innerText = 0;
            Div.appendChild(Elem);
            Div.appendChild(Elem2);
          }
        }
    }
  }

  function AffichagePlateau6QP(ListeCartesPlateau6QP){
    let Div;
    
    for (let i = 1; i < 5; i++) {
      for (let j = 1; j < 7; j++) {
        if (!document.getElementById("CartesL" + i + "-" + j)) {
          let a;
          a = document.createElement('div');
          a.id = "CartesL" + i + "-" + j
          document.getElementById('CartesJouees2').appendChild(a)

        }
        else {
          document.getElementById("CartesL" + i + "-" + j).style.backgroundImage = "none"
        }

      }
    }
    

    for (let i = 1; i < 5; i++) {
      Div = document.getElementById("CartesL" + i + '-' + 1);
      if (Div) {
        Div.style.backgroundImage = "url('./images2/" + ListeCartesPlateau6QP[i - 1] + ".svg')";

      }
    }

  }

  function AffichageScoreJoueur(Score){
   let Div = document.getElementById("Scorejoueur");
    if (!document.getElementById('score')) {
      Div.style.display = "flex";
      let Elem = document.createElement('div');
      Elem.id = 'score'
      Elem.innerText = Score
      Div.appendChild(Elem)
    }
  }

function LancerTour(ListeDesCartes,DossierImageExt,NomSocket) {
    clic=false
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
        b.onclick = function () {
            CarteCliquee(b, ListeDesCartes,DossierImageExt,NomSocket);
        };
      }
    }
    Chrono(Delais, ListeDesCartes,DossierImageExt,NomSocket)
  }

  function CarteCliquee(b, ListeDesCartes,DossierImageExt,NomSocket) {
    ListeCJ = ListeCJ - 1;
    clic = true;
    document.getElementById("Decompte").innerText = Delais ;
    document.getElementById("Decompte").style.backgroundColor = "transparent";
    document.getElementById("CartesJ1").style.backgroundImage = "url('./"+DossierImageExt[0]+"/" + b.className +DossierImageExt[1]+" ')";
    b.style.backgroundImage = "none";
    socket.emit(NomSocket, [b.className, sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo")])
    b.remove();
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
      }
    }
  }

  function Chrono(Decompte, Liste,DossierImageExt,NomSocket) {
    setTimeout(() => {
      if (Decompte > 0) {
        if (!clic) {
          document.getElementById("Decompte").innerText = Decompte - 1;
          if (Decompte % 2 == 0) {
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "red";
            }, 500);
          } else {
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "";
            }, 500);
          }
          return Chrono(Decompte - 1, Liste);
        }
      }
      else {
        let i = Math.floor(Math.random() * ((Liste.length - 1) - 0 + 1));
        let Cal = document.getElementById("Cartes-" + PosCarte[Liste[i]]);
        return CarteCliquee(Cal, Liste,DossierImageExt,NomSocket);
      }
    }, 1000);
  }

  function CarteJoueeJ(Nom,DossierImageExt){
    if (sessionStorage.getItem("pseudo") != Nom) {
        let Div = document.getElementById("Adversaire-" + ListeAdv[Nom]);
        if (Div) {
          Div.style.backgroundImage = "url(./"+DossierImageExt
          Div.style.backgroundPosition = "center center"
          Div.style.backgroundRepeat = "no-repeat"
        }
    }
}

  function RetourneCartesJouees(ListeCartesJ,DossierImageExt){
    for (let i in ListeCartesJ) {
        if (ListeAdv[i]) {
          let NumCarte=ListeCartesJ[i][ListeCartesJ[i].length-1]
          console.log(JSON.stringify("Adversaire-" + ListeAdv[i]));
          document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "url('./"+DossierImageExt[0]+"/" + NumCarte +DossierImageExt[1]+" ')";
          document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundPosition = "center center"
          document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundRepeat = "no-repeat"
        }
  
      }
}

  function AlertMessage(Message){
    alert(Message)
    setTimeout(() => {
      navigate('/PageChoix');
    }, 5000);
}

  function Retour() {
    navigate('/PageChoix');
  }

  function EtatBoutton() {
    socket.emit("EtatBoutton", [sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo")]);
  }

  function MesTchat() {
    let Message = document.getElementById('message')
    socket.emit("Message", [sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo"), Message.value]);

  }

  function Enregistrer() {
    socket.emit("Enregistrer", sessionStorage.getItem("idPartie"));
  }
  






















  socket.on("PrepaBataille", data => {
    CartesJoueur(data[0])
    StyleCartesJoueurBataille(data[0])
    AttributionAdversaire(data[1])
    EmplAdversaires(data[1])
    AffichageDecompte(data[2])
    LancerTour(data[0],["images",".png"],"joueCarteBataille")

  })

  socket.on("Prepa6quiprend", data => {
    CartesJoueur(data[0])
    StyleCartesJoueur6QP(data[0])
    AttributionAdversaire(data[1])
    EmplAdversaires(data[1])
    AffichagePlateau6QP(data[2])
    AffichageScoreJoueur(data[3])
    AffichageDecompte(data[4])
    LancerTour(data[0],["images2",".svg"],"joueCarte6quiprend")
  });

  socket.on("joueCarteBataille", data => {
    CarteJoueeJ(data,"images/Verso-Cartes.png)")
  })

  socket.on("joueCarteCacheeBataille", data => {
    CarteJoueeJ(data,"images/Verso-Cartes.png)")
  })

  socket.on("retourneCarte6quiprend", data => {
    RetourneCartesJouees(data,["images2",".svg"])
  })

  socket.on("retourneCarteBataille", data => {
    console.log(data)
    RetourneCartesJouees(data,["images",".png"])
  })

  socket.on("joueCarte6quiprend", data => {
    CarteJoueeJ(data,"images2/boeuf.svg)")
  })

  socket.on("choixCarteCacheeBataille", data => {
    for (let i in ListeAdv) {
      document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
    }
    document.getElementById("CartesJ1").style.backgroundImage = "none";
    LancerTour(data,["images",".png"],"joueCarteCacheeBataille")
    
  })

  socket.on("perduBataille", data => {
    AlertMessage("Vous avez perdu !!")
  })

  socket.on("victoireBataille", data => {
    AlertMessage("Vous avez gagné !!")
  })

  socket.on("retourInitialBataille", data => {
    for (let i in ListeAdv) {
      document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
    }
    document.getElementById("CartesJ1").style.backgroundImage = "none";
    if (ListeCJ == 0) {
        CartesJoueur(data)
        StyleCartesJoueurBataille(data)    
    }
    LancerTour(data,["images",".png"],"joueCarteBataille")
  })

  socket.on("retourInitial6quiprend", data => {
    for (let i in ListeAdv) {
      document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
    }
    document.getElementById("CartesJ1").style.backgroundImage = "none";
    LancerTour(data,["images2",".svg"],"joueCarte6quiprend")
  })

  socket.on("fin6quiprend", data => {
    if (sessionStorage.getItem('pseudo') == data) {
      AlertMessage("Vous avez gagné !!!")
    }
    else {
      AlertMessage("Le joueur " + data + " à gagné !!!")
    }
    document.getElementById("RetourFin").style.display = "flex";
  })

  
  socket.on("casAnormal6quiprend", data => {
    let Div;
    for (let i = 2; i < 7; i++) {
      Div = document.getElementById("CartesL" + data[0] + "-" + i);
      Div.style.backgroundImage = "none"
    }
    document.getElementById("CartesL" + data[0] + "-" + 1).style.backgroundImage = "url(./images2/" + data[1] + ".svg)";

    if (sessionStorage.getItem("pseudo") != data[2]) {
      document.getElementById("nbcartes" + ListeAdv[data[2]]).remove();
      let Elem = document.createElement('div');
      Elem.id = 'nbcartes' + ListeAdv[data[2]]
      Elem.innerText = data[3]
      document.getElementById("Pseudo-" + ListeAdv[data[2]]).appendChild(Elem)

    }
    else {
      document.getElementById("score").remove();
      let Elem = document.createElement('div');
      Elem.id = 'score'
      Elem.innerText = data[3]
      document.getElementById("Scorejoueur").appendChild(Elem)
    }
  })

  socket.on("casNormal6quiprend", data => {
    let Div;
    Div = document.getElementById("CartesL" + data[0] + "-" + data[1]);
    Div.style.backgroundImage = "url(./images2/" + data[2] + ".svg)"

  })

  socket.on("Enregistrer", data => {
    navigate('/PageChoix');
  })

  socket.on("Message", data => {
    if (data[0] == sessionStorage.getItem("idPartie")) {
      let divP = document.getElementById("Message");
      let messageElement = document.createElement('div');
      if (data[1] == sessionStorage.getItem("pseudo")) {
        messageElement.className = 'messageAuteur';
        messageElement.textContent = "Vous: " + data[2] + " ";
        divP.appendChild(messageElement);
        divP.innerText += "</br></br>";
        // Faire défiler vers le bas pour afficher le dernier message
        divP.scrollTop = divP.scrollHeight;
      }
      else {

        messageElement.className = 'messageAutres';
        messageElement.textContent = data[1] + ": " + data[2] + " ";
        divP.appendChild(messageElement);
        divP.innerText += "</br></br>";
        // Faire défiler vers le bas pour afficher le dernier message
        divP.scrollTop = divP.scrollHeight;
      }
    }
  })

  socket.on("EtatBoutton", data => {
    let Div = document.getElementById("Boutton");
    Div.style.display = "flex";
    let Div2 = document.getElementById("Enregistrer");
    Div2.style.display = "flex";
  });


//##############################################################################





  







  














  



  
//##############################################################################
  

  return (
    <div className="PageDeJeu">
      {Tchat(MesTchat)}
      {EmplacementAdversaires()}
      {CartesJouees()}
      {CartesJouees2()}
      {EmplacementJoueur()}
      {CartesGagnees()}
      {Scorejoueur()}
      {EtatBoutton()}
      <button id='Boutton' onClick={Affichage}>Commencer</button>
      <button id='RetourFin' onClick={Retour}>Retour</button>
      <button id='Enregistrer' onClick={Enregistrer}>Enregistrer</button>
      <div id='Decompte'></div>
    </div>
  );
}

export default PageDeJeu;
