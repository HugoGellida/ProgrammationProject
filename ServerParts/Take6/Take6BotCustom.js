const Player = require("../Player");
const Take6Card = require("./Take6Card");

class Take6BotCustom extends Player {
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
        this.cardPlayed = cardChosen;
        this.handCard = this.handCard.filter(card => card.value != cardChosen.value);
        return cardChosen;
    }

    makeBotMove(){
        const table = this.game.cardBoard;
        let minimalGap = -1;
        let minimalCardGap = 0;
        for (let row of Object.values(table)){
            for (let card of this.handCard){
                const gap = card.value - row[row.length - 1].value;
                if ((gap < minimalGap || minimalGap == -1) && gap > 0 && row.length != 5){
                    minimalGap = gap;
                    minimalCardGap = card;
                }
            }
        }
        if (minimalCardGap == 0){
            minimalCardGap = new Take6Card(Math.min(...this.handCard.map(card => card.value)));
        }
        return this.chooseCard(minimalCardGap);
    }

    removeCardPlayed(){
        this.cardPlayed = null;
    }
}

module.exports = Take6BotCustom;