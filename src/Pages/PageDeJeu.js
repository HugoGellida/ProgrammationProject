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

  //! Complete the following sockets and try doing what I did for the servers

  //TODO socket.on("playerTurnCrazy8", (timer, playableCards, handCard) => {});     Interaction and visual update (only applies to current player)
  //TODO socket.on("refreshHandCardCrazy8", handCard => {});                        Visual update (only applies to opponent)
  //TODO socket.on("refreshCardBoardCrazy8", lastCardPlayed => {});                 Visual update
  //TODO socket.on("placeOrPickCrazy8", card => {});                                Interaction update
  //TODO socket.on("clickToWinCrazy8", () => {});                                   Interaction update

  //TODO socket.emit("missedWinCrazy8", idGame, username);
  //TODO socket.emit("clickedWinCrazy8", idGame, username);
  //TODO socket.emit("pickCardCrazy8", idGame);
  //TODO socket.emit("chooseCardCrazy8", idGame, cardChosen, typeChosen);
  //TODO socket.emit("placeOrPickCrazy8", choice, card, type, idGame);

  //!

  //*Testing zone
  socket.on("playerTurnCrazy8", (timer, playableCards, handCard) => {
    socket.emit("chooseCardCrazy8", sessionStorage.getItem("idPartie"), playableCards[0], playableCards[0].type);
  });
  socket.on("playerTurnWar", (handCard, timer) => {
    socket.emit("chooseCardWar", sessionStorage.getItem("idPartie"), handCard[0], sessionStorage.getItem("pseudo"));
  });

  socket.on("playerHiddenTurnWar", (handCard, timer) => {
    socket.emit("chooseHiddenCardWar", sessionStorage.getItem("idPartie"), handCard[0], sessionStorage.getItem("pseudo"));
  });

  socket.on("playerTurnTake6", (handCard, timer) => {
    socket.emit("chooseCardTake6", sessionStorage.getItem("idPartie"), handCard[0], sessionStorage.getItem("pseudo"));
  });
  //*

  let ListeAdv = {};
  let PosCarte = {};
  let Delais;
  let ListeCJ;
  let clic2 ;

  const navigate = useNavigate();

  function Affichage() {
    console.log("oui");
    socket.emit("launchGame", sessionStorage.getItem("idPartie"));
  }
  function GenereCartes(ListeCartes) {
    ListeCJ = ListeCartes.length;
    for (let i = 1; i < ListeCartes.length + 1; i++) {
      if (!document.getElementById("Cartes-" + i)) {
        let a;
        a = document.createElement('div');
        a.id = "Cartes-" + i
        a.style.backgroundImage = "url('./images/" + ListeCartes[i - 1] + ".png')";
        a.style.marginTop = "2%";
        a.style.height = "15%";
        a.className = ListeCartes[i - 1];
        PosCarte[ListeCartes[i - 1]] = i
        document.getElementById('Joueur').appendChild(a)
      }

    }
  }
  socket.on("PrepaBataille", data => {
    GenereCartes(data[0]);
    document.getElementById('Joueur').style.width = "60%";
    document.getElementById('Joueur').style.top = "30%";
    document.getElementById('Joueur').style.left = "50%";

    //-------------
    Delais = data[2]
    let j = 1;
    for (let i = 0; i < data[1].length; i++) {
      if (sessionStorage.getItem("pseudo") != data[1][i]) {
        ListeAdv[data[1][i]] = j;
        j++;
      }
    }

    document.getElementById("Decompte").style.display = "flex"
    document.getElementById("Decompte").innerText = Delais //

    let Div;
    let Div2;
    let Div3;
    console.log(data[1].length)
    Div = document.getElementById("Boutton");
    Div.style.display = "none";
    for (let i = 1; i < data[1].length; i++) {
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

      Div3 = document.getElementById("Pseudo-" + ListeAdv[i]);
      if (Div3) {
        let Verif1 = document.getElementById('Infos' + ListeAdv[i])
        let Verif2 = document.getElementById('nbcartes' + ListeAdv[i])
        if (!Verif1 && !Verif2) {
          console.log("ListeAdv[i] = " + ListeAdv[i] + "i = " + i)
          let Elem = document.createElement('div');
          Elem.id = 'Infos' + ListeAdv[i]
          Elem.innerText = i
          let Elem2 = document.createElement('div');
          Elem2.id = 'nbcartes' + ListeAdv[i];
          Elem2.innerText = 0;
          Div3.appendChild(Elem);
          Div3.appendChild(Elem2);
        }

      }

    }
    if (!document.getElementById("CartesJ1")) {
      let a;
      a = document.createElement('div');
      a.id = "CartesJ1"
      a.style.marginLeft = "none"
      a.style.width = "8%"

      document.getElementById('Joueur').appendChild(a)
    }
    clic = false;
    JouerBataille(data[0])
  })

  function JouerBataille(ListeDesCartes) {
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
        b.onclick = function () {
          clickBataille(b, ListeDesCartes);
        };
      }
    }
    document.getElementById("Decompte").style.backgroundColor = ""
    Chrono2(Delais, ListeDesCartes)
  }

  function clickBataille(b, ListeDesCartes) {
    ListeCJ = ListeCJ - 1
    clic = true;
    document.getElementById("Decompte").innerText = Delais //
    document.getElementById("Decompte").style.backgroundColor = "transparent"
    document.getElementById("CartesJ1").style.backgroundImage = "url('./images/" + b.className + ".png')";
    b.style.backgroundImage = "none";
    console.log(sessionStorage.getItem("pseudo") + " à joué");
    socket.emit("joueCarteBataille", [b.className, sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo")])
    b.remove();
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
      }
    }
  }

  function Chrono2(Decompte, Liste) {
    setTimeout(() => {
      if (Decompte > 0) {
        if (!clic) {
          document.getElementById("Decompte").innerText = Decompte - 1;
          if (Decompte % 2 == 0) {
            // Changement de couleur toutes les 500 ms (0.5 secondes)
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "red";
            }, 500);
          } else {
            // Retour à la couleur d'origine après 500 ms (0.5 secondes)
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "";
            }, 500);
          }
          return Chrono2(Decompte - 1, Liste);
        }
      }
      else {
        let i = Math.floor(Math.random() * ((Liste.length - 1) - 0 + 1));
        let Cal = document.getElementById("Cartes-" + PosCarte[Liste[i]]);
        return clickBataille(Cal, Liste);
      }
    }, 1000);
  }





  socket.on("joueCarteBataille", data => {
    if (sessionStorage.getItem("pseudo") != data) {
      let Div = document.getElementById("Adversaire-" + ListeAdv[data]);
      if (Div) {
        Div.style.backgroundImage = "url(./images/Verso-Cartes.png)"
        Div.style.backgroundPosition = "center center"
        Div.style.backgroundRepeat = "no-repeat"
      }
    }


  })

  socket.on("joueCarteCacheeBataille", data => {
    if (sessionStorage.getItem("pseudo") != data) {
      let Div = document.getElementById("Adversaire-" + ListeAdv[data]);
      if (Div) {
        Div.style.backgroundImage = "url(./images/Verso-Cartes.png)"
        Div.style.backgroundPosition = "center center"
        Div.style.backgroundRepeat = "no-repeat"
      }
    }


  })

  socket.on("retourneCarteBataille", data => {
    console.log(JSON.stringify(data));

    for (let i in data) {
      if (ListeAdv[i]) {
        console.log(JSON.stringify("Adversaire-" + ListeAdv[i] + " i= " + i + " data[i]= " + data[i]));

        if(data[i].length==1){

        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "url(./images/" + data[i] + ".png)";
        
        }
        else{
          document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "url(./images/" + data[i][data[i].length-1] + ".png)";
        }
        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundPosition = "center center"
        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundRepeat = "no-repeat"
      }
    }
  })

  socket.on("retourInitialBataille", data => {
    for (let i in ListeAdv) {
      document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
    }
    document.getElementById("CartesJ1").style.backgroundImage = "none";
    if (ListeCJ == 0) {
      GenereCartes(data)
    }
    clic = false;
    JouerBataille(data)
  })

  socket.on("perduBataille", data => {
    alert("Vous avez perdu !!")
    setTimeout(() => {
      navigate('/PageChoix');
    }, 5000);

  })

  socket.on("victoireBataille", data => {
    alert("Vous avez gagné !!")
    setTimeout(() => {
      navigate('/PageChoix');
    }, 5000);

  })

  socket.on("choixCarteCacheeBataille", data => {
    for (let i in ListeAdv) {
      document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
    }
    clic2 = false;
    document.getElementById("CartesJ1").style.backgroundImage = "none";
    JouerBataille2(data)
    
  })


  function JouerBataille2(ListeDesCartes) {
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
        b.onclick = function () {
          clickBataille2(b, ListeDesCartes);
        };
      }
    }
    document.getElementById("Decompte").style.backgroundColor = ""
    Chrono22(Delais, ListeDesCartes)
  }

  function clickBataille2(b, ListeDesCartes) {
    ListeCJ = ListeCJ - 1
    clic2 = true;
    document.getElementById("Decompte").innerText = Delais //
    document.getElementById("Decompte").style.backgroundColor = "transparent"
    document.getElementById("CartesJ1").style.backgroundImage = "url('./images/" + b.className + ".png')";
    b.style.backgroundImage = "none";
    console.log(sessionStorage.getItem("pseudo") + " à joué");
    socket.emit("joueCarteCacheeBataille", [b.className, sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo")])
    b.remove();
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
      }
    }
  }

  function Chrono22(Decompte, Liste) {
    setTimeout(() => {
      if (Decompte > 0) {
        if (!clic2) {
          document.getElementById("Decompte").innerText = Decompte - 1;
          if (Decompte % 2 == 0) {
            // Changement de couleur toutes les 500 ms (0.5 secondes)
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "red";
            }, 500);
          } else {
            // Retour à la couleur d'origine après 500 ms (0.5 secondes)
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "";
            }, 500);
          }
          return Chrono22(Decompte - 1, Liste);
        }
      }
      else {
        let i = Math.floor(Math.random() * ((Liste.length - 1) - 0 + 1));
        let Cal = document.getElementById("Cartes-" + PosCarte[Liste[i]]);
        return clickBataille2(Cal, Liste);
      }
    }, 1000);
  }











  // Jeu-2

  //[ListeCarteDuJoueur,ListePseudosJoueur]

  socket.on("Prepa6quiprend", data => {
    GenereCartes()


    function GenereCartes() {
      for (let i = 1; i < 11; i++) {
        if (!document.getElementById("Cartes-" + i)) {
          let a;
          a = document.createElement('div');
          a.id = "Cartes-" + i
          document.getElementById('Joueur').appendChild(a)
        }

      }
    }

    //-------------
    Delais = data[4]
    let j = 1;
    for (let i = 0; i < data[1].length; i++) {
      if (sessionStorage.getItem("pseudo") != data[1][i]) {
        ListeAdv[data[1][i]] = j;
        j++;
      }
    }

    document.getElementById("Decompte").style.display = "flex"
    document.getElementById("Decompte").innerText = Delais //

    let Div;
    let Div2;
    let Div3;
    console.log(data[1].length)
    Div = document.getElementById("Boutton");
    Div.style.display = "none";
    for (let i = 1; i < data[1].length; i++) {
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
    if (!document.getElementById("CartesJ1")) {
      let a;
      a = document.createElement('div');
      a.id = "CartesJ1"
      document.getElementById('CartesJouees2').appendChild(a)


    }
    else {
      document.getElementById("CartesJ1").style.backgroundImage = "none"
    }

    for (let i = 1; i < 5; i++) {
      Div = document.getElementById("CartesL" + i + '-' + 1);
      if (Div) {
        Div.style.backgroundImage = "url('./images2/" + data[2][i - 1] + ".svg')";
      }
    }
    Div2 = document.getElementById("Scorejoueur");
    if (!document.getElementById('score')) {
      Div2.style.display = "flex";
      let Elem = document.createElement('div');
      Elem.id = 'score'
      Elem.innerText = data[3]
      Div2.appendChild(Elem)
    }
    for (let i in ListeAdv) {
      Div3 = document.getElementById("Pseudo-" + ListeAdv[i]);
      if (Div3) {
        let Verif1 = document.getElementById('Infos' + ListeAdv[i])
        let Verif2 = document.getElementById('nbcartes' + ListeAdv[i])
        if (!Verif1 && !Verif2) {
          console.log("ListeAdv[i] = " + ListeAdv[i] + "i = " + i)
          let Elem = document.createElement('div');
          Elem.id = 'Infos' + ListeAdv[i]
          Elem.innerText = i
          let Elem2 = document.createElement('div');
          Elem2.id = 'nbcartes' + ListeAdv[i];
          Elem2.innerText = 0;
          Div3.appendChild(Elem);
          Div3.appendChild(Elem2);
        }
      }
    }
    for (let i = 1; i < 11; i++) {
      Div = document.getElementById("Cartes-" + i);
      if (Div) {
        Div.style.display = "flex";
        Div.style.bottom = '0%'
        Div.style.height = '14%'
      }
    }


    for (let i = 0; i < 10; i++) {
      Div = document.getElementById("Cartes-" + (i + 1));
      if (Div) {
        Div.style.backgroundImage = "url('./images2/" + data[0][i] + ".svg')";
        Div.className = data[0][i];
        PosCarte[data[0][i]] = i + 1
        Div.style.backgroundSize = "cover";
      }
    }

    Jouer6QuiPrend(data[0])


  });

  socket.on("joueCarte6quiprend", data => {
    if (sessionStorage.getItem("pseudo") != data) {
      let Div = document.getElementById("Adversaire-" + ListeAdv[data]);
      if (Div) {
        Div.style.backgroundImage = "url(./images2/boeuf.svg)"
        Div.style.backgroundPosition = "center center"
        Div.style.backgroundRepeat = "no-repeat"
      }
    }

  })
  // data=={clé=pseudo,valeur=cartejouée}
  socket.on("retourneCarte6quiprend", data => {
    for (let i in data) {
      if (ListeAdv[i]) {
        console.log(JSON.stringify("Adversaire-" + ListeAdv[i]));
        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "url(./images2/" + data[i] + ".svg)";
        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundPosition = "center center"
        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundRepeat = "no-repeat"
      }

    }
  })
  // data==[ligne,carte,pseudo,score]
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
  // data==[ligne,colonne,carte,]

  socket.on("casNormal6quiprend", data => {
    let Div;
    Div = document.getElementById("CartesL" + data[0] + "-" + data[1]);
    Div.style.backgroundImage = "url(./images2/" + data[2] + ".svg)"

  })

  let clic = false;

  socket.on("retourInitial6quiprend", data => {
    clic = false;
    for (let i in ListeAdv) {
      document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
    }
    document.getElementById("CartesJ1").style.backgroundImage = "none";
    Jouer6QuiPrend(data);
  })

  function Jouer6QuiPrend(ListeDesCartes) {
    console.log("probleme du chrono: enquete5");
    document.getElementById("Decompte").style.backgroundColor = "red"
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
        b.onclick = function () {
          click6QuiPrend(b, ListeDesCartes);
        };
      }
    }
    document.getElementById("Decompte").style.backgroundColor = "red"
    Chrono(Delais, ListeDesCartes)
  }

  function click6QuiPrend(b, ListeDesCartes) {
    clic = true;
    document.getElementById("Decompte").innerText = Delais //
    document.getElementById("Decompte").style.backgroundColor = "transparent"
    document.getElementById("CartesJ1").style.backgroundImage = "url('./images2/" + b.className + ".svg')";
    b.style.backgroundImage = "none";
    console.log(sessionStorage.getItem("pseudo") + " à joué");
    socket.emit("joueCarte6quiprend", [b.className, sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo")]);
    b.remove();
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b = document.getElementById("Cartes-" + PosCarte[ListeDesCartes[i]]);
      if (b) {
        b.onclick = null;
      }
    }
  }

  function Chrono(Decompte, Liste) {
    setTimeout(() => {
      if (Decompte > 0) {
        if (!clic) {
          document.getElementById("Decompte").innerText = Decompte - 1;
          if (Decompte % 2 == 0) {
            // Changement de couleur toutes les 500 ms (0.5 secondes)
            setTimeout(() => {
              document.getElementById("Decompte").style.backgroundColor = "red";
            }, 500);
          } else {
            // Retour à la couleur d'origine après 500 ms (0.5 secondes)
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
        return click6QuiPrend(Cal, Liste);
      }
    }, 1000);
  }

  socket.on("fin6quiprend", data => {
    if (sessionStorage.getItem('pseudo') == data) {
      alert("Vous avez gagné !!!");
    }
    else {
      alert("Le joueur " + data + " à gagné !!!")
    }
    document.getElementById("RetourFin").style.display = "flex";
  })

  function Retour() {
    navigate('/PageChoix');
  }

  function EtatBoutton() {
    socket.emit("askLaunchButton", sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo"));
  }

  socket.on("showLaunchButton", () => {
    console.log("showLaunchButton, start");
    let Div = document.getElementById("Boutton");
    Div.style.display = "flex";
    let Div2 = document.getElementById("Enregistrer");
    Div2.style.display = "flex";
    console.log("showLaunchButton, end");
  });

  function MesTchat() {
    let Message = document.getElementById('message')
    socket.emit("messageSent", sessionStorage.getItem("idPartie"), Message.value, sessionStorage.getItem("pseudo"));

  }
  function Enregistrer() {
    socket.emit("askPause", sessionStorage.getItem("idPartie"));
  }
  socket.on("pauseAllowed", () => {
    navigate('/PageChoix');
  });


  socket.on("messageReceived", (idGame, message, username) => {
    if (idGame == sessionStorage.getItem("idPartie")) {
      let divP = document.getElementById("Message");
      let messageElement = document.createElement('div');
      if (username == sessionStorage.getItem("pseudo")) {
        messageElement.className = 'messageAuteur';
        messageElement.textContent = `Vous: ${message}`;
        divP.appendChild(messageElement);
        divP.innerText += "</br></br>";
        // Faire défiler vers le bas pour afficher le dernier message
        divP.scrollTop = divP.scrollHeight;
      }
      else {
        messageElement.className = 'messageAutres';
        messageElement.textContent = `${username}: ${message}`;
        divP.appendChild(messageElement);
        divP.innerText += "</br></br>";
        // Faire défiler vers le bas pour afficher le dernier message
        divP.scrollTop = divP.scrollHeight;
      }
    }
  });


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
