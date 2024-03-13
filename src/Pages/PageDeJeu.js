import './PageDeJeu.css';
import { socket } from "./socket.js";
import EmplacementAdversaires from "./../Composants/EmplacementAdversaires"
import EmplacementJoueur from './../Composants/EmplacementJoueur';
import CartesJouees from './../Composants/CartesJouees'
import React, { useEffect, useState } from 'react';
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
  let Div;
  let Div2;
  let Div3;
  let a;
  const [launchTimer, setLaunchTimer] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [info, setInfo] = useState({});
  const [noClickLaunch, setNoClickLaunch] = useState(true);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const navigate = useNavigate();

  function Affichage() {
    console.log("oui");
    socket.emit("launchGame", sessionStorage.getItem("idPartie"));
  }

  socket.on("playerTurnCrazy8", (timer, playableCards, handCard) => {
    console.log(timer, playableCards, handCard);
  });

  function CartesJoueur(ListeCartes) {
    ListeCJ = ListeCartes.length;
    for (let i = 0; i < ListeCartes.length; i++) {
      if (ListeCartes[i].type && ListeCartes[i].value){
        if (!document.getElementById(`Cartes-${ListeCartes[i].value}-${ListeCartes[i].type}`)) {
          const a = document.createElement('div');
          a.id = `Cartes-${ListeCartes[i].value}-${ListeCartes[i].type}`;
          document.getElementById('Joueur').appendChild(a);
        }
      } else if (ListeCartes[i].value && !ListeCartes[i].type){
        if (!document.getElementById(`Cartes-${ListeCartes[i].value}`)) {
          const a = document.createElement('div');
          a.id = `Cartes-${ListeCartes[i].value}`;
          document.getElementById('Joueur').appendChild(a);
        }
      }
    }
  }

  function StyleCartesJoueurBataille(ListeCartes) {
    for (let i = 0; i < ListeCartes.length; i++) {
      a = document.getElementById(`Cartes-${ListeCartes[i].value}-${ListeCartes[i].type}`);
      if (a) {
        a.style.backgroundImage = `url('./imagesTest/${ListeCartes[i].value}-${ListeCartes[i].type}.png')`;
        a.style.marginTop = "2%";
        a.style.height = "15%";
        a.className = `${ListeCartes[i].value}-${ListeCartes[i].type}`;
        PosCarte[`${ListeCartes[i].value}-${ListeCartes[i].type}`] = i + 1
      }
    }
    document.getElementById('Joueur').style.width = "60%";
    document.getElementById('Joueur').style.top = "30%";
    document.getElementById('Joueur').style.left = "50%";


    if (!document.getElementById("CartesJ1")) {
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

  function StyleCartesJoueur6QP(ListeCartes) {
    for (let i = 0; i < ListeCartes.length; i++) {
      Div = document.getElementById(`Cartes-${ListeCartes[i].value}`);
      if (Div) {
        Div.style.display = "flex";
        Div.style.bottom = '0%'
        Div.style.height = '14%'
        Div.style.backgroundImage = `url('./images2/${ListeCartes[i].value}.svg')`;
        Div.className = ListeCartes[i].value;
        PosCarte[ListeCartes[i].value] = i + 1;
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

  function AttributionAdversaire(opponents) {
    let j = 1;
    for (let i = 0; i < opponents.length; i++) {
      ListeAdv[opponents[i]] = j;
      j++;
    }
  }

  function AffichageDecompte(Duree) {
    Delais = Duree
    document.getElementById("Decompte").style.display = "flex"
    document.getElementById("Decompte").innerText = Delais //
  }

  function EmplAdversaires(ListePseudosJoueur) {
    document.getElementById("Boutton").style.display = "none";
    for (let i = 1; i < ListePseudosJoueur.length + 1; i++) {
      if (!document.getElementById(`Adversaire-${i}`)) {
        Div = document.createElement('div');
        Div.id = `Adversaire-${i}`
        Div2 = document.createElement('div');
        Div2.id = `Pseudo-${i}`
        Div3 = document.createElement('div');
        Div3.id = `Case-${i}`
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

  function AffichagePlateau6QP(ListeCartesPlateau6QP) {
    let Div;
    for (let i = 1; i < 5; i++) {
      for (let j = 1; j < 7; j++) {
        if (!document.getElementById("CartesL" + i + "-" + j)) {
          let a;
          a = document.createElement('div');
          a.id = "CartesL" + i + "-" + j;
          document.getElementById('CartesJouees2').appendChild(a)
        }
        else {
          document.getElementById("CartesL" + i + "-" + j).style.backgroundImage = "none"
        }
      }
    }
    for (let i = 1; i < 5; i++) {
      for (let j = 1; j < ListeCartesPlateau6QP[i - 1].length + 1; j++){
        Div = document.getElementById("CartesL" + i + '-' + j);
        if (Div) {
          Div.style.backgroundImage = `url('./images2/${ListeCartesPlateau6QP[i - 1][j - 1].value}.svg')`;
        }
      }
    }

  }

  function AffichageScoreJoueur(Score) {
    let Div = document.getElementById("Scorejoueur");
    if (!document.getElementById('score')) {
      Div.style.display = "flex";
      let Elem = document.createElement('div');
      Elem.id = 'score'
      Elem.innerText = Score
      Div.appendChild(Elem)
    } else {
      const Elem = document.getElementById('score');
      Elem.innerText = Score;
    }
  }

  function LancerTour(ListeDesCartes, DossierImageExt, NomSocket) {
    setHasClicked(false);
    setShowPauseButton(true);
    for (let i = 0; i < ListeDesCartes.length; i++) {
      let b;
      if (ListeDesCartes[i].value && ListeDesCartes[i].type){
        b = document.getElementById(`Cartes-${ListeDesCartes[i].value}-${ListeDesCartes[i].type}`);
      }
      else if (ListeDesCartes[i].value && !ListeDesCartes[i].type) b = document.getElementById(`Cartes-${ListeDesCartes[i].value}`);
      if (b) {
        b.onclick = null;
        b.onclick = function (){
          CarteCliquee(b, ListeDesCartes, DossierImageExt, NomSocket);
        };
      }
    }
    setLaunchTimer(true);
    //Chrono(Delais, ListeDesCartes, DossierImageExt, NomSocket)
  }

  function CarteCliquee(b, ListeDesCartes, DossierImageExt, NomSocket) {
    ListeCJ = ListeCJ - 1;
    setLaunchTimer(false);
    setHasClicked(true);
    document.getElementById("Decompte").innerText = 0;
    document.getElementById("Decompte").style.backgroundColor = "transparent";
    document.getElementById("CartesJ1").style.backgroundImage = `url('./${DossierImageExt[0]}/${b.className}${DossierImageExt[1]}')`;
    b.style.backgroundImage = "none";
    if (ListeDesCartes[0].type && ListeDesCartes[0].value){
      const sep = b.className.split("-");
      socket.emit(NomSocket, sessionStorage.getItem("idPartie"), {value: sep[0], type: sep[1]}, sessionStorage.getItem("pseudo"))
      b.remove();
      for (let i = 0; i < ListeDesCartes.length; i++) {
        let b = document.getElementById(`Cartes-${ListeDesCartes[i].value}-${ListeDesCartes[i].type}`);
        if (b) {
          b.onclick = null;
        }
      }
    } else if (ListeDesCartes[0].value && !ListeDesCartes[0].type){
      socket.emit(NomSocket, sessionStorage.getItem("idPartie"), {value: b.className}, sessionStorage.getItem("pseudo"));
      b.remove();
      for (let i = 0; i < ListeDesCartes.length; i++) {
        let b = document.getElementById(`Cartes-${ListeDesCartes[i].value}`);
        if (b) {
          b.onclick = null;
        }
      }
    }
  }
  useEffect(() => {
    if (noClickLaunch){
      socket.emit("askLaunchButton", sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo"));
      setNoClickLaunch(false);
    }

    let intervalIDTimer;
    if (launchTimer){
      intervalIDTimer = setInterval(() => {
        document.getElementById("Decompte").innerText = info.timer - 1;
        if (document.getElementById("Decompte").style.backgroundColor == "red") document.getElementById("Decompte").style.backgroundColor = "";
        else document.getElementById("Decompte").style.backgroundColor = "red";
        setInfo({
          ...info,
          timer: info.timer - 1
        });
      }, 1000);
      if (!hasClicked && info.timer == 0){
        let i = Math.floor(Math.random() * ((info.handCard.length - 1) - 0 + 1));
        let Cal;
        if (info.handCard[i].type && info.handCard[i].value) Cal = document.getElementById(`Cartes-${info.handCard[i].value}-${info.handCard[i].type}`);
        else if (info.handCard[i].value && !info.handCard[i].type) Cal = document.getElementById(`Cartes-${info.handCard[i].value}`);
        CarteCliquee(Cal, info.handCard, [info.repertory, info.extension], info.socketEventName);
      }
    }

    const playerTurnWar = (handCard, opponents, timer) => {
      CartesJoueur(handCard)
      StyleCartesJoueurBataille(handCard)
      AttributionAdversaire(opponents)
      EmplAdversaires(opponents)
      AffichageDecompte(timer)
      setInfo({
        handCard: handCard,
        repertory: "imagesTest",
        extension: ".png",
        socketEventName: "chooseCardWar",
        opponents: opponents,
        timer: timer
      });
      LancerTour(handCard, ["imagesTest", ".png"], "chooseCardWar");
    }

    const playerHiddenTurnWar = (handCard, timer) => {
      for (let i in ListeAdv) {
        document.getElementById("Adversaire-" + ListeAdv[i]).style.backgroundImage = "none";
      }
      document.getElementById("CartesJ1").style.backgroundImage = "none";
      setInfo({
        ...info,
        handCard: handCard,
        repertory: "imagesTest",
        extension: ".png",
        socketEventName: "chooseHiddenCardWar",
        timer: timer
      });
      LancerTour(handCard, ["imagesTest", ".png"], "chooseHiddenCardWar");
    }

    const  messageReceived = (message, username, color, title) => {
      const divP = document.getElementById("Message");
      //const messageElement = document.createElement('div');
      document.getElementById("message").value = "";
      //* New model
      //messageElement.className = "playerMessage";
      const spanMessage = document.createElement('span');
      if (title){
        const strongTitle = document.createElement("strong");
        strongTitle.textContent = `[${title}]`;
        strongTitle.style.color = color;
        strongTitle.style.fontSize = "12px";
        divP.appendChild(strongTitle);
      }
      const strongUsername = document.createElement("strong");
      strongUsername.style.color = color;
      strongUsername.textContent = `${username}: `;
      strongUsername.style.fontSize = "12px";
      spanMessage.textContent = `${message}`;
      spanMessage.style.fontSize = "12.5px";
      divP.appendChild(strongUsername);
      divP.appendChild(spanMessage);
      //*
      //divP.appendChild(messageElement);
      divP.innerHTML += "</br>";
      divP.scrollTop = divP.scrollHeight;
    }

    const winWar = () => {
      alert("You won the game");
      setLaunchTimer(false);
      setHasClicked(true);
    }

    const loseWar = () => {
      alert("You lose the game");
      setLaunchTimer(false);
      setHasClicked(true);
    }
    const playerTurnTake6 = (handCard, opponents, cards, score, timer) => {
      CartesJoueur(handCard)
      StyleCartesJoueur6QP(handCard)
      AttributionAdversaire(opponents)
      EmplAdversaires(opponents)
      AffichagePlateau6QP(cards)
      AffichageScoreJoueur(score)
      AffichageDecompte(timer)
      setInfo({
        handCard: handCard,
        repertory: "images2",
        extension: ".svg",
        socketEventName: "chooseCardTake6",
        opponents: opponents,
        timer: timer,
        score: score
      });
      LancerTour(handCard, ["images2", ".svg"], "chooseCardTake6");
    }
  
    const endTake6 = (winners) => {
      setLaunchTimer(false);
      setHasClicked(true);
      setShowPauseButton(false);
      if (winners.includes(sessionStorage.getItem('pseudo'))) {
        alert("Vous avez gagné !!!\n+750 money");
      }
      else {
        alert(`Les joueurs ${winners} ont gagnés !!!`)
      }
      document.getElementById("RetourFin").style.display = "flex";
    }
  
    const refreshCardBoardTake6 = (lineUpdated, lineNumber) => {
      setShowPauseButton(false);
      for (let i = 1; i < lineUpdated.length + 1; i++){
        let Div = document.getElementById(`CartesL${lineNumber}-${i}`);
        Div.style.backgroundImage = `url(./images2/${lineUpdated[i - 1].value}.svg)`;
      }
      for (let i = lineUpdated.length + 1; i < 7; i++){
        let Div = document.getElementById(`CartesL${lineNumber}-${i}`);
        Div.style.backgroundImage = `none`;
      }
    }
  
    const refreshPlayerPointTake6 = (score, username) => {
      if (ListeAdv[username]){
        const scoreDiv = document.getElementById(`nbcartes${ListeAdv[username]}`);
        scoreDiv.innerText = score;
      } else {
        const scoreDiv = document.getElementById('score');
        scoreDiv.innerText = score;
      }
    }
  
    const resetCardPlayedTake6 = (username) => {
      if (ListeAdv[username]){
        const opponentDiv = document.getElementById(`Adversaire-${ListeAdv[username]}`);
        opponentDiv.style.backgroundImage = "none";
      } else {
        const carteDiv = document.getElementById('CartesJ1');
        carteDiv.style.backgroundImage = "none";
      }
    }

    const opponentPlayedTake6 = (username) => {CarteJoueeJ(username, "images2/boeuf.svg)");}

    const pauseAllowed = () => {
      setLaunchTimer(false);
      setHasClicked(true);
      setShowPauseButton(false);
      document.getElementById("RetourFin").style.display = "flex";
      alert("La partie a été mise en pause par le createur");
    }

    const showLaunchButton = () => {
      console.log("hi");
      setIsCreator(true);
      let Div = document.getElementById("Boutton");
      Div.style.display = "flex";
    }
  
    socket.on("opponentPlayedTake6", opponentPlayedTake6);
    socket.on("playerTurnTake6", playerTurnTake6);
    socket.on("endTake6", endTake6);
    socket.on("refreshCardBoardTake6", refreshCardBoardTake6);
    socket.on("refreshPlayerPointTake6", refreshPlayerPointTake6);
    socket.on("resetCardPlayedTake6", resetCardPlayedTake6);

    socket.on("loseWar", loseWar);
    socket.on("winWar", winWar);
    socket.on("playerHiddenTurnWar", playerHiddenTurnWar);
    socket.on("playerTurnWar", playerTurnWar);
    socket.on("refreshOponnentCardWar", username => {CarteJoueeJ(username, "imagesTest/Verso-Cartes.png)");});
    socket.on("revealAllCard", (cardPerPlayer, repertory) => {RetourneCartesJouees(cardPerPlayer, repertory);});
    socket.on("messageReceived", messageReceived);

    socket.on("pauseAllowed", pauseAllowed);
    socket.on("showLaunchButton", showLaunchButton);
    socket.on("Enregistrer", data => {
      navigate('/PageChoix');
    });

    return () => {
      clearInterval(intervalIDTimer);

      socket.off("opponentPlayedTake6", opponentPlayedTake6);
      socket.off("playerTurnTake6", playerTurnTake6);
      socket.off("endTake6", endTake6);
      socket.off("refreshCardBoardTake6", refreshCardBoardTake6);
      socket.off("refreshPlayerPointTake6", refreshPlayerPointTake6);
      socket.off("resetCardPlayedTake6", resetCardPlayedTake6);

      socket.off("playerHiddenTurnWar", playerHiddenTurnWar);
      socket.off("playerTurnWar", playerTurnWar);
      socket.off("loseWar", loseWar);
      socket.off("winWar", winWar);
      socket.off("refreshOponnentCardWar", username => {CarteJoueeJ(username, "imagesTest/Verso-Cartes.png)");});
      socket.off("revealAllCard", (cardPerPlayer, repertory) => {RetourneCartesJouees(cardPerPlayer, repertory);});
      socket.off("messageReceived", messageReceived);
      socket.off("pauseAllowed", pauseAllowed);
      socket.off("showLaunchButton", showLaunchButton);
    }
  });

  function CarteJoueeJ(Nom, DossierImageExt) {
    if (sessionStorage.getItem("pseudo") != Nom) {
      let Div = document.getElementById("Adversaire-" + ListeAdv[Nom]);
      if (Div) {
        Div.style.backgroundImage = "url(./" + DossierImageExt;
        Div.style.backgroundPosition = "center center";
        Div.style.backgroundRepeat = "no-repeat";
      }
    }
  }

  function RetourneCartesJouees(ListeCartesJ, DossierImageExt) {
    for (let i = 0; i < ListeCartesJ.length; i++) {
      const username = ListeCartesJ[i].username;
      const card = ListeCartesJ[i].card;
      if (ListeAdv[username]) {
        let NumCarte;
        if (card.value && card.type) NumCarte = `${card.value}-${card.type}`;
        else if (card.value && !card.type) NumCarte = `${card.value}`;
        console.log(JSON.stringify("Adversaire-" + ListeAdv[username]));
        document.getElementById("Adversaire-" + ListeAdv[username]).style.backgroundImage = `url('./${DossierImageExt[0]}/${NumCarte}${DossierImageExt[1]}')`;
        document.getElementById("Adversaire-" + ListeAdv[username]).style.backgroundPosition = "center center"
        document.getElementById("Adversaire-" + ListeAdv[username]).style.backgroundRepeat = "no-repeat"
      }
    }
  }

  function AlertMessage(Message) {
    alert(Message);
    setTimeout(() => {
      navigate('/PageChoix');
    }, 5000);
  }

  const Retour = () => {
    return navigate('/PageChoix');
  }

  function MesTchat() {
    let Message = document.getElementById('message')
    socket.emit("messageSent", sessionStorage.getItem("idPartie"), Message.value, sessionStorage.getItem("pseudo"));

  }

  function Enregistrer() {
    socket.emit("askPause", sessionStorage.getItem("idPartie"));
  }

//########################    Crazy 8    ################################





  //##############################################################################

  socket.on("playerTurnCrazy8",(gameTimer,playableCards,handCard)=>{
    console.log(handCard)
    CartesJoueur(handCard)
    StyleCartesJoueurBataille(handCard)
    AttributionAdversaire(["John"])
    EmplAdversaires(["John"])
  })





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
      <button id='Boutton' onClick={Affichage}>Commencer</button>
      <button id='RetourFin' onClick={Retour}>Retour</button>
      {(isCreator && showPauseButton) && (
        <button id='Enregistrer' onClick={Enregistrer}>Enregistrer</button>
      )}
      <div id='Decompte'></div>
    </div>
  );
}

export default PageDeJeu;
