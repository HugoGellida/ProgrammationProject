class Game {
    constructor(playerAmount, timer, idGame, status){
        this.playerAmount = playerAmount;
        this.playerList = [];
        this.timer = timer;
        this.idGame = idGame;
        this.isPaused = false;
        this.creator = null;
        this.isLaunched = false;
        this.status = status;
    }

    addPlayer(player){
        this.playerList.push(player);
    }

    getPlayerByUsername(username){
        return this.playerList.filter(p => p.username == username)[0];
    }

    getOpponentsUsername(username){
        return this.playerList.filter(p => p.username != username).map(p => p.username);
    }
}

module.exports = Game;