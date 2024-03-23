const Player = require("./../Player");

class Crazy8Player extends Player {
    constructor(username, game, socketid){
        super(username, game, socketid);
        this.handCard = [];
        this.needPlay = false;
    }

    pickAce(){ // Gameplay avec as
        let aceAmount = this.game.card1InARow;
        for (let i = 0; i < aceAmount; i++){
            this.pickCard();
            this.pickCard();
        }
        this.game.card1InARow = 0;
    }

    playNormalCard(cardChosen){ //Gameplay autres cartes
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        this.game.addCard(cardChosen);
        this.game.changeTurn();
    }

    playCard1(cardChosen){
        const nextPlayer = this.game.getNextPlayer();
        nextPlayer.needPlay = true;
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        this.game.addCard(cardChosen);
        this.game.card1InARow ++;
        if (!nextPlayer.canPlay()){
            nextPlayer.pickAce();
            nextPlayer.needPlay = false;
        }
        this.game.changeTurn();
    }

    playCard2(cardChosen){
        const nextPlayer = this.game.getNextPlayer();
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        this.game.addCard(cardChosen);
        nextPlayer.pickCard(); nextPlayer.pickCard();
        this.game.changeTurn(); this.game.changeTurn();
    }

    playCard7(cardChosen){
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        this.game.addCard(cardChosen);
        this.game.changeTurn();
        this.game.changeTurn();
    }

    playCard8(cardChosen, typeChosen){
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        cardChosen.type = typeChosen;
        this.game.addCard(cardChosen);
        this.game.changeTurn();
        this.game.card1InARow = 0;
    }

    playCard10(cardChosen){
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        this.game.addCard(cardChosen);
        this.needPlay = true;
        if (!this.canPlay()){
            this.pickCard();this.pickCard();
            this.needPlay = false;
            this.game.changeTurn();
        }
    }

    playCard11(cardChosen){
        this.handCard = this.handCard.filter((card) => (card.type != cardChosen.type || card.value != cardChosen.value));
        this.game.addCard(cardChosen);
        this.game.changeDirection();
        this.game.changeTurn();
    }

    canPlay(){ // Donne l'etat du joueur
        return this.playableCards().length != 0;
    }

    pickCard(){ // Fait piocher un joueur
        if (this.game.noPickCard()){
            this.game.reloadPickCard();
        }
        if (!this.game.noPickCard()){
            const card = this.game.cardPickList.pop();
            console.log(`the player ${this.username} picked a ${card.value} of ${card.type}`);
            this.handCard.push(card);
            return card;
        }
    }

    playableCards(){
        const lastCardPlayed = this.game.getLastCard();
        return this.handCard.filter(card => card.type == lastCardPlayed.type || card.value == lastCardPlayed.value || (card.value == 8 && lastCardPlayed.value != 2));
    }

    hasWinCondition(){
        return this.handCard.length == 0;
    }

    getOpponents(){
        return this.game.playerList.filter(player => player != this);
    }
}

module.exports = Crazy8Player;