class Player {
    constructor(username, game, socketid){
        this.username = username;
        this.game = game;
        this.socketid = socketid;
        this.isCreator = false;
        this.colorMessage = this.setRandomColorMessage();
    }

    setRandomColorMessage(){
        const colors = ["red", "blue", "yellow", "orange", "pink", "purple", "white", "gray"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

module.exports = Player;