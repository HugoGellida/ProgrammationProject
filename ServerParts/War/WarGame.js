const Game = require("./../Game");
const WarCard = require("./WarCard");

class WarGame extends Game {
    constructor(playerAmount, timer, idGame, status) {
        super(playerAmount, timer, idGame, status);
        this.winableCards = [];
        this.fightingPlayers = [];
        this.isHidden = false;
    }

    getLockedPlayers() {
        return this.playerList.filter(player => player.isLocked);
    }

    isLocked() {
        const lockedPlayers = this.getLockedPlayers();
        return lockedPlayers.length == this.playerAmount;
    }

    isWarLocked() {
        return this.fightingPlayers.length == 0;
    }

    getHighestCardValue() {
        return Math.max(...this.fightingPlayers.map(player => player.cardPlayed.value));
    }

    isWarTime() {
        const highestCardValue = this.getHighestCardValue();
        return this.fightingPlayers.filter(player => player.cardPlayed.value == highestCardValue).length != 1;
    }

    updatePlayerStatus() {
        for (let i = 0; i < this.fightingPlayers.length; i++) {
            if (this.fightingPlayers[i].cardPlayed){
                if (this.fightingPlayers[i].cardPlayed.value != this.getHighestCardValue()) {
                    this.fightingPlayers[i].isAtWar = false;
                    console.log(`the player ${this.fightingPlayers[i].username} is not at war`);
                }
            }
            if (this.fightingPlayers[i].hasNoCard()) {
                this.fightingPlayers[i].isLocked = true;
                console.log(`the player ${this.fightingPlayers[i].username} is locked`);
            } else if (this.fightingPlayers[i].hasNoHandCard()) {
                this.fightingPlayers[i].reloadCard();
            }
        }
    }

    updateFightingPlayers() {
        console.log("updating fighting players");
        this.fightingPlayers = this.fightingPlayers.filter(player => player.isAtWar && !player.isLocked);
    }

    resetFightingPlayers() {
        console.log("resetting fighting players");
        for (let i = 0; i < this.playerAmount; i++) {
            this.playerList[i].isAtWar = true;
        }
        this.fightingPlayers = this.playerList;
    }

    prepareRound() {
        let generatedCards = [];
        const types = ["heart", "tile", "clover", "spade"];
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j < 15; j++) {
                let card = new WarCard(j, types[i]);
                generatedCards.push(card);
            }
        }
        generatedCards.sort(() => { return Math.random() - 0.5; });
        let currentCard = 0;
        let remainCardAmount = generatedCards.length % this.playerAmount;
        let dividendCardAmount = Math.floor(generatedCards.length / this.playerAmount);
        for (let i = 0; i < this.playerAmount; i++) {
            const player = this.playerList[i];
            for (let j = currentCard; j < currentCard + dividendCardAmount; j++) {
                player.handCard.push(generatedCards[j]);
            }
            currentCard += dividendCardAmount;
            if (remainCardAmount > 0) {
                player.handCard.push(generatedCards[currentCard]);
                remainCardAmount--;
                currentCard++;
            }
        }
        this.fightingPlayers = this.playerList;
    }

    eliminatePlayer(player) {
        this.playerList = this.playerList.filter(p => p.username != player.username);
        this.fightingPlayers = this.fightingPlayers.filter(p => p.username != player.username);
        this.playerAmount--;
    }

    winCard(player) {
        player.pickCard.push(...this.winableCards);
        this.resetAllCardPlayed();
        this.winableCards = [];
    }

    allPlayed() {
        return this.fightingPlayers.filter(player => player.cardPlayed != null).length == this.fightingPlayers.length;
    }

    resetAllCardPlayed() {
        for (let i = 0; i < this.playerAmount; i++) {
            this.playerList[i].cardPlayed = null;
        }
    }
}

module.exports = WarGame;