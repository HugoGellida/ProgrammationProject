class Player {
    constructor(username, game, socketid){
        this.username = username;
        this.game = game;
        this.socketid = socketid;
        this.isCreator = false;
    }
}

module.exports = Player;