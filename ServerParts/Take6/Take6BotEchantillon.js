const Player = require("../Player");
const combinations = require("combinations-js");
const Take6Card = require("./Take6Card");

class Take6BotEchantillon extends Player {
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
        const allPlayedCards = this.game.alreadyPlayedCard.map(card => card.value);
        const HandCard = this.handCard.map(card => card.value);
        const allCards = [];
        for (let i = 1; i < 105; i++) allCards.push(i);
        let NotPlayedCards = allCards.filter(value => !allPlayedCards.includes(value) && !HandCard.includes(value));
        let ScoreFinal = this.Emulator(HandCard, NotPlayedCards, this.game.cardBoard, this.game.playerList.length);
        console.log('Echantillon obtenu : ', ScoreFinal)
        for (let i in ScoreFinal){
            let total = 0;
            for (let j of ScoreFinal[i]) total += j;
            ScoreFinal[i] = total/ScoreFinal[i].length;
            console.log('Carte : ', i,' Moyenne :',ScoreFinal[i]);
        }
        const response = Object.keys(ScoreFinal).filter(key => ScoreFinal[key] == Math.min(...Object.values(ScoreFinal)))[0];
        return this.chooseCard(this.handCard.filter(card => card.value == response)[0]);
    }

    Emulator(hand, ListOfCards, Plateau, NbJoueurs){
        let NotPlayedCards = ListOfCards;
        let Retour={};
        let newPlateau = Plateau;
        for (let i of hand){
            Retour[i] = [];
        }
        for (let j = 0; j < 50; j++){
            const Comb =  this.Combinaison(NotPlayedCards,NbJoueurs)
            for (let i of hand){
                Retour[i].push(this.Simulate_update_table(newPlateau, i, [...Comb, i]));
            }
        }
        return Retour;
    }

    Combinaison(liste, taille){
        const  toutes_combinaisons = CalculCombinaison(liste, taille - 1);
        const random = Math.floor(Math.random() * toutes_combinaisons.length);
        const combinaison_choisie = toutes_combinaisons[random];
        return combinaison_choisie;
    }

    Simulate_update_table(Table, handCard, Combinations){
        let Valeurs = {};
        Combinations = Combinations.sort((a, b) => a - b);
        for (let val of Combinations){
            Valeurs[val] = [];
            let placed = false;
            for (let i in Table){
                if (Table[i][Table[i].length - 1].value < val){
                    if (Table[i].length < 5) Valeurs[val].push(0);
                    else {
                        const cows = Table[i].map(card => card.pointAmount).reduce((acc, value) => acc + value, 0);
                        Valeurs[val].push(cows);
                        Table[i] = [new Take6Card(val)];
                    }
                    placed = true;
                    break;
                }
            }
            if (!placed){
                let minIndex = 0
                let minOfLine = -1
                for (let index in Table){
                    let total = Table[index].map(card => card.pointAmount).reduce((acc, value) => acc + value, 0);
                    if (total < minOfLine || minOfLine == -1){
                        minIndex = index;
                        minOfLine = total;
                    }
                }
                Valeurs[val].push(Table[minIndex].map(card => card.value).reduce((acc, value) => acc + value, 0));
                Table[minIndex - 1] = [new Take6Card(val)];
            }
        }
        return Valeurs[handCard][0];
    }

    removeCardPlayed(){
        this.cardPlayed = null;
    }
}

function CalculCombinaison(liste, nombre){
    let result = [];
    function CombRec(currentComb, start){
        if (currentComb.length === nombre){
            result.push(currentComb);
            return;
        }
        for (let i = start; i < liste.length; i++){
            const newComb = [...currentComb, liste[i]];
            CombRec(newComb, i + 1);
        }
    }
    CombRec([], 0)
    return result;
}

module.exports = Take6BotEchantillon;