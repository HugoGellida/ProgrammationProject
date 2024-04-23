const Player = require("../Player");

class Take6BotRandom extends Player {
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
        console.log(`the bot ${this.username} replaced a line, he his now at ${this.totalPoint} points`);
    }

    chooseCard(cardChosen){
        const cardClass = this.handCard.filter(card => card.value == cardChosen.value)[0];
        this.cardPlayed = cardClass;
        this.handCard = this.handCard.filter(card => card.value != cardChosen.value);
        return cardClass;
    }

    makeBotMove(){
        const randomIndex = Math.random() * this.handCard.length;
        const randomCard = this.handCard[randomIndex];
        return this.chooseCard(randomCard.value);
    }

    removeCardPlayed(){
        this.cardPlayed = null;
    }
}

module.exports = Take6BotRandom;