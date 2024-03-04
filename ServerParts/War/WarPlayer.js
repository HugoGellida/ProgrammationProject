const Player = require("./../Player");

class WarPlayer extends Player {
    constructor(username, game, socketid){
        super(username, game, socketid);
        this.handCard = [];
        this.pickCard = [];
        this.cardPlayed = null;
        this.isAtWar = true;
        this.isLocked = false;
    }

    playCard(cardChosen){
        this.handCard = this.handCard.filter(card => card.type != cardChosen.type || card.value != cardChosen.value);
        this.cardPlayed = cardChosen;
        this.game.winableCards.push(cardChosen);
    }

    hasNoCard(){
        return this.handCard.length == 0 && this.pickCard.length == 0;
    }

    hasNoHandCard(){
        return this.handCard.length == 0;
    }

    reloadCard(){
        console.log(`the player ${this.username} need to reload cards`);
        this.handCard = this.pickCard;
        this.pickCard = [];
    }

    hasWon(){
        return this.game.playerAmount == 1;
    }
}

module.exports = WarPlayer;