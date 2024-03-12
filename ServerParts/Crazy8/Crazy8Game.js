const Game = require("./../Game");
const Crazy8Card = require("./Crazy8Card");

class Crazy8Game extends Game{

    constructor(playerAmount, timer, idGame, status){
        super(playerAmount, timer, idGame, status);
        this.cardBoardList = [];
        this.cardPickList = [];
        this.cardNumber = this.setCardAmount();
        this.turn = 1;
        this.direction = "+";
        this.card1InARow = 0;
    }

    eliminatePlayer(player){
        this.cardPickList.push(...player.handCard);
        this.playerList = this.playerList.filter(p => p.username != player.username);
        this.playerAmount--;
    }

    getNextPlayer(){ // Donne le prochain joueur
        let count = -1;
        if (this.direction == "+"){
            if (this.turn == this.playerAmount) count = 1;
            else count = this.turn + 1;
        } else {
            if (this.turn - 1 == 0) count = this.playerAmount;
            else count = this.turn - 1;
        }
        return this.playerList[count - 1];
    }

    currentPlayer(){ // Donne le joueur courant
        return this.playerList[this.turn - 1];
    }

    prepareRound(){ // Prepare une manche
        if (this.playerList.length >= 2){
            let generatedCards = [];
            const types = ["heart", "tile", "clover", "spade"];
            for (let i = 0; i < 4; i++){
                for (let j = 1; j < 14; j++){
                    let card = new Crazy8Card(j, types[i]);
                    generatedCards.push(card);
                }
            }
            // OPTIONAL: const cardJoker = new Crazy8Card(14, "none"); generatedCards.push(cardJoker); generatedCards.push(cardJoker);
            generatedCards.sort(() => {return Math.random() - 0.5;});
            let currentCard = 0;
            for (let i = 0; i < this.playerList.length; i++){
                for (let j = currentCard; j < this.cardNumber + currentCard; j++){
                    this.playerList[i].handCard.push(generatedCards[j]);
                }
                currentCard += this.cardNumber;
            }
            this.cardBoardList.push(generatedCards[currentCard]); currentCard ++;
            for (let i = currentCard; i < generatedCards.length; i++){
                this.cardPickList.push(generatedCards[i]);
            }
        }
    }

    changeTurn(){ // Change le tour du joueur
        let count = -1;
        if (this.direction == "+"){
            if (this.turn == this.playerAmount) count = 1;
            else count = this.turn + 1;
        } else {
            if (this.turn - 1 == 0) count = this.playerAmount;
            else count = this.turn - 1;
        }
        this.turn = count;
    }

    changeDirection(){ // Change le sens
        if (this.direction == "+") this.direction = "-";
        else this.direction = "+";
    }

    getLastCard(){ // Donne la derniere carte jouée
        return this.cardBoardList[this.cardBoardList.length - 1];
    }

    reloadPickCard(){ // Recharge des cartes de la pioche
        for (let i = this.cardBoardList.length - 2; i > -1; i--){
            this.cardPickList.push(this.cardBoardList.pop());
        }
    }

    setCardAmount(){
        if (this.playerAmount <=3) return 7;
        else if (this.playerAmount <= 6) return 6;
        else return 5;
    }

    noPickCard(){
        return this.cardPickList.length == 0;
    }

    addCard(card){
        this.cardBoardList.push(card);
    }
}

module.exports = Crazy8Game;