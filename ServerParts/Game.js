class Game {
    constructor(playerAmount, timer, idGame){
        this.playerAmount = playerAmount;
        this.playerList = [];
        this.timer = timer;
        this.idGame = idGame;
        this.isPaused = false;
        this.creator = null;
        this.isJoinable = true;
    }

    addPlayer(player){
        this.playerList.push(player);
        if (this.playerAmount == this.playerList.length){
            this.isJoinable = false;
        }
    }

    getPlayerByUsername(username){
        return this.playerList.filter(p => p.username == username)[0];
    }
}

module.exports = Game;