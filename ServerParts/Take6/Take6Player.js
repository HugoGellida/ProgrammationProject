const Player = require("../Player");

class Take6Player extends Player {
    constructor(username, game, socketid){
        super(username, game, socketid);
        this.handCard = [];
        this.totalPoint = 0;
        this.cardPlayed = null;
    }

    drawPoint(cardsOfLine){
        for (let i = 0; i < cardsOfLine.length - 1; i++){
            let card = cardsOfLine[i];
            if (card){
                this.totalPoint += card.pointAmount;
            }
        }
        console.log(`the player ${this.username} replaced a line, he his now at ${this.totalPoint} points`);
    }

    chooseCard(cardChosen){
        const cardClass = this.handCard.filter(card => card.value == cardChosen.value)[0];
        this.cardPlayed = cardClass;
        this.handCard = this.handCard.filter(card => card.value != cardChosen.value);
        return cardClass;
    }

    removeCardPlayed(){
        this.cardPlayed = null;
    }
}

module.exports = Take6Player;