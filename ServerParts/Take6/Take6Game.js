const Game = require("../Game");
const Take6Card = require("./Take6Card");

class Take6Game extends Game {
    constructor(playerAmount, timer, idGame, status){
        super(playerAmount, timer, idGame, status);
        this.cardBoard = {1: [], 2:[], 3:[], 4:[]};
    }

    eliminatePlayer(player){
        this.playerList = this.playerList.filter(p => p.username != player.username);
        this.playerAmount--;
    }

    placeCard(player, card){
        let lineNumberToPlace = this.getMinimalLine(card);
        if (lineNumberToPlace){
            player.removeCardPlayed();
            this.addCard(card, lineNumberToPlace);
            if (this.isLength6(lineNumberToPlace)){
                player.drawPoint(this.cardBoard[lineNumberToPlace]);
                this.replaceLine(lineNumberToPlace, card);
            }
        } else {
            lineNumberToPlace = this.getMinimalPointLine();
            player.removeCardPlayed();
            this.addCard(card, lineNumberToPlace);
            player.drawPoint(this.cardBoard[lineNumberToPlace]);
            this.replaceLine(lineNumberToPlace, card);
        }
        return [this.cardBoard[lineNumberToPlace], lineNumberToPlace];
    }

    prepareRound(){
        let generatedCards = [];
        for (let i = 1; i < 105; i++){
            const card = new Take6Card(i);
            generatedCards.push(card);
        }
        generatedCards.sort(() => {return Math.random() - 0.5;});
        let currentCard = 0;
        for (let i = 0; i < this.playerAmount; i++){
            const player = this.playerList[i];
            for (let j = currentCard; j < 10 + currentCard; j++){
                player.handCard.push(generatedCards[j]);
            }
            currentCard += 10;
        }
        Object.keys(this.cardBoard).forEach(lineNumber => {
            this.cardBoard[lineNumber].push(generatedCards[currentCard]);
            currentCard++;
        });
    }

    addCard(card, lineNumber){
        this.cardBoard[lineNumber].push(card);
    }

    isLength6(lineNumber){
        return this.cardBoard[lineNumber].length == 6;
    }

    getMinimalLine(card){
        let minimalLine = 0;
        let minimalGap = Infinity;
        Object.keys(this.cardBoard).forEach(lineNumber => {
            const lastCardOfLine = this.getLastCardOfLine(lineNumber);
            if (Math.abs(lastCardOfLine.value - card.value) < minimalGap && lastCardOfLine.value < card.value){
                minimalGap = Math.abs(lastCardOfLine.value - card.value);
                minimalLine = lineNumber;
            }
        });
        return minimalLine;
    }

    getLastCardOfLine(lineNumber){
        return this.cardBoard[lineNumber][this.cardBoard[lineNumber].length - 1];
    }

    replaceLine(lineNumber, card){
        this.cardBoard[lineNumber] = [card];
    }

    getMinimalPointLine(){
        let minimalPointLine = 0;
        let minimalPointAmount = Infinity;
        Object.keys(this.cardBoard).forEach(lineNumber => {
            let totalPointOfLine = 0;
            for (let i = 0; i < this.cardBoard[lineNumber].length; i++){
                const card = this.cardBoard[lineNumber][i]
                totalPointOfLine += card.pointAmount;
            }
            if (totalPointOfLine < minimalPointAmount){
                minimalPointAmount = totalPointOfLine;
                minimalPointLine = lineNumber;
            }
        });
        return minimalPointLine;
    }

    hasEndCondition(){
        return Math.max(...this.playerList.map(player => player.totalPoint)) >= 66;
    }

    allPlayed(){
        return this.playerList.filter(player => player.cardPlayed != null).length == this.playerAmount;
    }

    sortPlayerList(){
        this.playerList = this.playerList.sort((a, b) => a.cardPlayed.value - b.cardPlayed.value);
    }

    resetAll(){
        this.cardBoard = this.cardBoard = {1: [], 2:[], 3:[], 4:[]};
        for (let i = 0; i < this.playerAmount; i++){
            this.playerList[i].cardPlayed = null;
            this.playerList[i].handCard = [];
        }
    }

    getWinners(){
        return this.playerList.filter(player => player.totalPoint == Math.min(...this.playerList.map(p => p.totalPoint)));
    }

    needOtherRound(){
        return this.playerList[0].handCard.length == 0; 
    }
}

module.exports = Take6Game;