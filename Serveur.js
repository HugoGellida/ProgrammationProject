const Crazy8Game = require("./ServerParts/Crazy8/Crazy8Game.js");
const Crazy8Player = require("./ServerParts/Crazy8/Crazy8Player.js");
const WarGame = require("./ServerParts/War/WarGame.js");
const WarPlayer = require("./ServerParts/War/WarPlayer.js");
const Take6Game = require("./ServerParts/Take6/Take6Game.js");
const Take6Player = require("./ServerParts/Take6/Take6Player.js");


const express = require('express');
const app = express();
app.use((request, response, next) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "*");
    next();
});
const http = require('http');
const { dirname } = require('path');
const server = http.createServer(app);
const io = new require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});


const fs = require("fs");
const { syncBuiltinESMExports } = require("module");
const sql = require("sqlite3").verbose();

const db = new sql.Database("./Database.db");

class Joueur6quiprend { //Classe de joueur
    constructor(username, idGame, socketid) {
        this.username = username;
        this.idGame = idGame;
        this.carteJouee = null;
        this.listeCarte = [];
        this.score = 0;
        this.socketid = socketid;

    }
};

class Partie6quiprend {
    constructor(liste, idGame) {
        this.liste = liste;
        this.idGame = idGame;
    }
}

class JoueurBataille { //Classe de joueur
    constructor(username, idGame, socketid) {
        this.username = username;
        this.idGame = idGame;
        this.socketid = socketid;
        this.carteJouee = [];
        this.cartePioche = [];
        this.listeCarte = [];
        this.concerne = true;
        this.bloque = false;
    }
}

let listeJ = [];
let listeP = [];

let gameList = [];

//* New Database Model
//TODO Decomment all the following lines once, execute he server once, then recomment the lines
//db.run("CREATE TABLE User(username VARCHAR(10) PRIMARY KEY, password VARCHAR(10), isConnected BOOLEAN, socketid VARCHAR(50))");
//db.run("CREATE TABLE StatWar(username REFERENCES User(username), loseAmount INTEGER, winAmount INTEGER, tieAmount INTEGER)");
//db.run("CREATE TABLE StatTake6(username REFERENCES User(username), loseAmount INTEGER, winAmount INTEGER, best INTEGER, average FLOAT)");
//db.run("CREATE TABLE StatCrazy8(username REFERENCES User(username), loseAmount INTEGER, winAmount INTEGER)");
//TODO

db.run("UPDATE User SET isConnected = false");
//*




db.run("DROP TABLE JoueurPartie", (err) => {
    //db.run("DROP TABLE Joueur", (err) => {
    //    db.run("CREATE TABLE Joueur(pseudo VARCHAR(10) PRIMARY KEY, motdepasse VARCHAR(10), connecte BOOLEAN)");
    //});
    db.run("DROP TABLE Partie", (err) => {
        db.run("CREATE TABLE Partie(idP INTEGER PRIMARY KEY, typeDeJeu VARCHAR(15), nbJoueur INTEGER, partieLancee BOOLEAN, delai INTEGER, partiePause BOOLEAN)");
        db.run("UPDATE Joueur SET connecte = false");
    });
    db.run("CREATE TABLE JoueurPartie(idPartie REFERENCES Partie(idP), pseudoJoueur REFERENCES Joueur(pseudo), isCreator BOOLEAN, PRIMARY KEY (idPartie, pseudoJoueur))");
});

//db.run("CREATE TABLE StatCrazy8(pseudo REFERENCES Joueur(pseudo), winAmountCrazy8 INTEGER, loseAmountCrazy8 INTEGER)")
//db.run("DROP TABLE Stat6quiprend", (err) => {
//    db.run("CREATE TABLE Stat6quiprend(pseudo REFERENCES Joueur(pseudo), nbGagnee6quiprend INTEGER, record6quiprend INTEGER, nbPerdue6quiprend INTEGER, pointsmoyen6quiprend FLOAT)");
//});
//db.run("CREATE TABLE StatBataille(pseudo REFERENCES Joueur(pseudo), nbGagneeBataille INTEGER, nbPerdueBataille INTEGER, nbNulBataille INTEGER)");
//db.run("ALTER TABLE StatBataille ADD COLUMN nbNulBataille INTEGER");

server.listen(3001, () => {
    console.log('Le serveur écoute sur le port 3001');
});



io.on("connection", (socket) => {

    socket.join('preLobby');
    socket.emit("goToPreLobby");

    socket.on("disconnect", () => {
        db.run(`UPDATE User SET isConnected = false WHERE socketid = '${socket.id}'`, (err) => {
            console.log(`the player with socket ${socket.id} has been disconnected`);
            //TODO: Get the game id room of socket, analyse the type of game, and change database.
        });
    });

    //Page Connexion
    socket.on("connectionAttempt", (username, password) => {
        db.get(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}' AND isConnected = false`, (err, row) => {
            if (row) {
                console.log(`connection allowed for user ${username}`);
                socket.leave('preLobby')
                socket.join('lobby');
                db.run(`UPDATE User SET isConnected = true, socketid = '${socket.id}' WHERE username = '${username}'`);
                socket.emit("connectionAllowed");
            }
        });
    });
    //Page Inscription
    socket.on("registrationAttempt", (username, password) => {
        db.get(`SELECT * FROM User WHERE username = '${username}'`, (err, row) => {
            if (!row) {
                socket.join('choichePage');
                db.run(`INSERT INTO User VALUES ('${username}', '${password}', true, '${socket.id}')`, (err) => {
                    db.run(`INSERT INTO StatTake6 VALUES('${username}', 0, 0, -1, -1)`);
                    db.run(`INSERT INTO StatWar VALUES('${username}', 0, 0, 0)`);
                    db.run(`INSERT INTO StatCrazy8 VALUES('${username}', 0, 0)`);
                    console.log(`registration allowed for user ${username}`);
                    socket.emit("registrationAllowed");
                });
            }
        });
    });
    //Page CreationPartie
    socket.on("createGame", (playerAmount, typeOfGame, username, timer) => { // data = [nbJoueur, typedejeu, username, delai]
        const newIdGame = gameList.length + 1;
        io.to('lobby').emit("gameCreated", newIdGame, playerAmount, typeOfGame);
        //* New model
        let newGame = null;
        if (typeOfGame == "crazy8") {
            newGame = new Crazy8Game(playerAmount, timer, newIdGame);
        } else if (typeOfGame == "jeu-de-bataille") {
            newGame = new WarGame(playerAmount, timer, newIdGame);
        } else if (typeOfGame == "6-qui-prend") {
            newGame = new Take6Game(playerAmount, timer, newIdGame);
        }
        gameList.push(newGame);
        //*
        affectPlayer(newIdGame, username, true);
    });
    //Page Choix
    socket.on("loadGame", () => {
        let idParties = [];
        let nombredeJoueurs = [];
        let types = [];
        for (let i = 0; i < gameList.length; i++) {
            idParties.push(gameList[i].idGame);
            nombredeJoueurs.push(gameList[i].playerAmount);
            const type = getStringOfGame(gameList[i]);
            types.push(type);
        }
        socket.emit("loadGame", idParties, nombredeJoueurs, types);
    });

    socket.on("createPlayer", (idGame, username) => {
        affectPlayer(idGame, username, false);
    });

    socket.on("joinPerID", (idGame, username) => {
        const game = getGameById(idGame);
        if (game) {
            if (game.playerList.length != game.playerAmount) {
                affectPlayer(idGame, username, false);
            }
        }
    });
    //Page de jeu
    socket.on("launchGame", idGame => {
        const game = getGameById(idGame);
        const playerAmountInRoom = io.sockets.adapter.rooms.get(parseInt(idGame)).size;
        if (game.isPaused && game.playerAmount == playerAmountInRoom) {
            game.isPaused = false;
            const players = game.playerList;
            let usernameList = players.map(player => player.username);
            console.log(`the game ${idGame} has been resumed`);
            if (game instanceof WarGame) {
                for (let i = 0; i < players.length; i++) {
                    io.to(players[i].socketid).emit("resumeWar", players[i].handCard, game.timer, usernameList);
                }
            } else if (game instanceof Take6Game) {
                for (let i = 0; i < players.length; i++) {
                    io.to(players[i].socketid).emit("resumeTake6", players[i].handCard, game.timer, listePseudo);
                }
            } else if (game instanceof Crazy8Game) {
                for (let i = 0; i < players.length; i++) {
                    io.to(players[i].socketid).emit("resumeCrazy8", players[i].handCard, game.timer, listePseudo, game.currentPlayer().username);
                }
            }
        } else if (game.playerAmount == game.playerList.length) {
            console.log(`the game ${idGame} has been launched`);
            if (game instanceof WarGame) {
                prepareWar(idGame);
                //preparationBataille(data, row.delai);
            } else if (game instanceof Take6Game) {
                prepareTake6(idGame);
                //preparation6QP(data, row.delai);
            } else {
                console.log(`its a game of crazy8`);
                prepareCrazy8(idGame);
            }
        } else {
            console.log(`denyed the launching the game ${idGame}`);
        }
    });

    socket.on("askLaunchButton", (idGame, username) => {
        const game = getGameById(idGame);
        const player = game.getPlayerByUsername(username);
        if (player.isCreator) {
            socket.emit("showLaunchButton");
        }
    })

    socket.on("messageSent", (idGame, message, username) => { // data = [idPartie, Message, username]
        io.to(parseInt(idGame)).emit("messageReceived", idGame, message, username);
    });

    socket.on("askPause", idGame => {
        const game = getGameById(idGame);
        game.isPaused = true;
        io.to(parseInt(idGame)).emit("pauseAllowed");
    });

    socket.on("joueCarteBataille", data => { // data = [num carte jouée, id partie, username]
        for (let i = 0; i < listeJ.length; i++) {
            if (listeJ[i].username == data[2]) {
                listeJ[i].carteJouee.push(data[0]);
                listeJ[i].listeCarte = listeJ[i].listeCarte.filter(carte => carte != data[0]);
            }
        }
        let joueurs = listeJ.filter(joueur => joueur.concerne == true && joueur.idGame == data[1]);
        let x = true;
        for (let i = 0; i < joueurs.length; i++) {
            if (joueurs[i].listeCarte.length == 0) {
                joueurs[i].listeCarte = joueurs[i].cartePioche;
                joueurs[i].cartePioche = [];
            }
            if (joueurs[0].carteJouee.length != joueurs[i].carteJouee.length) {
                x = false;
                break;
            }
        }
        io.to(parseInt(data[1])).emit("joueCarteBataille", data[2]);
        if (x) {
            let dico = {};
            for (let i = 0; i < joueurs.length; i++) {
                dico[joueurs[i].username] = joueurs[i].carteJouee;
            }
            io.to(parseInt(data[1])).emit("retourneCarteBataille", dico);
            joueurs.sort((a, b) => valeurCarteBataille(b.carteJouee[b.carteJouee.length - 1]) - valeurCarteBataille(a.carteJouee[a.carteJouee.length - 1]));
            lancementTourBataille(data[1], joueurs);
        }
    })

    socket.on("joueCarteCacheeBataille", data => { // data = [num carte jouée, id partie, username]
        for (let i = 0; i < listeJ.length; i++) {
            if (listeJ[i].username == data[2]) {
                listeJ[i].carteJouee.push(data[0]);
                listeJ[i].listeCarte = listeJ[i].listeCarte.filter(carte => carte != data[0]);
                break;
            }
        }
        console.log(data[2] + " joue la carte cachée " + data[0]);
        let joueurs = listeJ.filter(joueur => joueur.concerne == true && joueur.bloque == false && joueur.idGame == data[1]);
        let x = true;
        for (let i = 0; i < joueurs.length; i++) {
            if (joueurs[0].carteJouee.length != joueurs[i].carteJouee.length) {
                x = false;
                break;
            }
        }
        io.to(parseInt(data[1])).emit("joueCarteCacheeBataille", data[2]);
        let joueurEvent = joueurs.filter(joueur => joueur.username == data[2]);
        if (joueurEvent[0].cartePioche.length == 0 && joueurEvent[0].listeCarte.length == 0) {
            joueurEvent[0].concerne = false;
            joueurEvent[0].bloque = true;
            joueurs = joueurs.filter(joueur => joueur != joueurs[i]);
        } else if (joueurEvent[0].listeCarte.length == 0) { // Il a encore des cartes dans sa pioche
            joueurEvent[0].listeCarte = joueurEvent[0].cartePioche;
            joueurEvent[0].cartePioche = [];
        }
        if (x) {
            for (let i = 0; i < joueurs.length; i++) {
                io.to(joueurs[i].socketid).emit("retourInitialBataille", joueurs[i].listeCarte);
            }
        }
    })

    socket.on("joueCarte6quiprend", data => { // data = [num carte jouée, id partie, username]
        // Completion
        for (let i = 0; i < listeJ.length; i++) {
            if (listeJ[i].username == data[2]) {
                listeJ[i].carteJouee = data[0];
                listeJ[i].listeCarte = listeJ[i].listeCarte.filter(carte => carte != data[0]);
            }
        }
        //
        // Verfification

        db.get("SELECT nbJoueur FROM Partie WHERE idGame = " + data[1], (err, row) => {
            let nbJoueurMax = row.nbJoueur;
            let x = 0;
            for (let i = 0; i < listeJ.length; i++) {
                if (listeJ[i].idGame == data[1] && listeJ[i].carteJouee != null) {
                    x++;
                }
            }
            io.to(parseInt(data[1])).emit("joueCarte6quiprend", data[2]);
            if (x == nbJoueurMax) {
                let dico = {};
                for (let i = 0; i < listeJ.length; i++) {
                    if (listeJ[i].idGame == data[1]) {
                        dico[listeJ[i].username] = listeJ[i].carteJouee;
                    }
                }
                io.to(parseInt(data[1])).emit("retourneCarte6quiprend", dico);
                const joueursRestants = listeJ.filter(joueur => joueur.idGame == data[1]);
                joueursRestants.sort((a, b) => a.carteJouee - b.carteJouee);
                lancementTour6QP(data[1], joueursRestants);
            }
        });
    });

    //* Nouveau modele

    socket.on("pickCardCrazy8", idGame => {
        const game = getGameById(idGame);
        const currentPlayer = game.currentPlayer();
        const lastCardPlayed = game.getLastCard();
        switch (lastCardPlayed) { //* Il existe 2 type d'atout: ceux que tu subis et ceux à choix. L'as et le 10 sont des cartes à choix.
            case 1: if (currentPlayer.needPlay) {
                currentPlayer.pickAce();
                currentPlayer.needPlay = false;
                const cardPicked = currentPlayer.pickCard();
                if (cardPicked) {
                    if (cardPicked.value == lastCardPlayed.value || cardPicked.type == lastCardPlayed.type) {
                        io.to(currentPlayer.socketid).emit("placeOrPickCrazy8", cardPicked);
                    } else {
                        game.changeTurn();
                        currentPlayer = game.currentPlayer();
                        boardAnalyseCrazy8(game, currentPlayer);
                    }
                } else {
                    game.changeTurn();
                    currentPlayer = game.currentPlayer();
                    boardAnalyseCrazy8(game, currentPlayer);
                }
                break;
            }
            case 10: if (currentPlayer.needPlay) {
                currentPlayer.pickCard(); currentPlayer.pickCard();
                currentPlayer.needPlay = false;
                game.changeTurn();
                currentPlayer = game.currentPlayer();
                boardAnalyseCrazy8(game, currentPlayer);
                break;
            }
            default: const cardPicked = currentPlayer.pickCard();
                if (cardPicked) {
                    if (cardPicked.value == lastCardPlayed.value || cardPicked.type == lastCardPlayed.type) {
                        io.to(currentPlayer.socketid).emit("placeOrPickCrazy8", cardPicked);
                    } else {
                        game.changeTurn();
                        currentPlayer = game.currentPlayer();
                        boardAnalyseCrazy8(game, currentPlayer);
                    }
                } else {
                    game.changeTurn();
                    currentPlayer = game.currentPlayer();
                    boardAnalyseCrazy8(game, currentPlayer);
                }
                break;
        }
    });

    socket.on("placeOrPickCrazy8", (choice, card, type, idGame) => {
        const game = getGameById(idGame);
        const currentPlayer = game.currentPlayer();
        if (choice == "place") {
            playCardCrazy8(card, type, currentPlayer);
        } else {
            game.changeTurn();
        }
        currentPlayer = game.currentPlayer();
        boardAnalyseCrazy8(game, currentPlayer);
    });

    socket.on("chooseCardCrazy8", (idGame, cardChosen, typeChosen) => {
        const game = getGameById(idGame);
        let currentPlayer = game.currentPlayer();
        console.log(`the player ${currentPlayer.username} chose a ${cardChosen.value} of ${cardChosen.type}`);
        if (game.lastCardPlayed.value == 1 && (cardChosen.vaule != 1 || cardChosen.value != 8) && currentPlayer.needPlay) {
            currentPlayer.pickAce();
            currentPlayer.needPlay = false;
        }
        playCardCrazy8(cardChosen, typeChosen, currentPlayer);
        io.to(parseInt(game.idGame)).emit("refreshCardBoardCrazy8", game.getLastCard());
        if (currentPlayer.hasWinCondition()) {
            console.log(`the player ${currentPlayer.username} has a win condition, he must click to win`);
            io.to(currentPlayer.socketid).emit("clickToWinCrazy8");
        } else {
            currentPlayer = game.currentPlayer();
            boardAnalyseCrazy8(game, currentPlayer);
        }
    });

    socket.on("clickedWinCrazy8", (idGame, username) => {
        const game = getGameById(idGame);
        const player = game.playerList.filter(p => p.username == username)[0];
        io.to(parseInt(idGame)).emit("winCrazy8", player);
        db.get(`SELECT * FROM StatCrazy8 WHERE username = '${username}'`, (err, row) => {
            db.run(`UPDATE StatCrazy8 SET winAmount = '${(row.winAmount + 1)}' WHERE username = '${username}'`);
        });
        const opponents = player.getOpponents();
        for (let i = 0; i < opponents.length; i++) {
            db.get(`SELECT * FROM StatCrazy8 WHERE username = '${opponents[i].username}'`, (err, row) => {
                db.run(`UPDATE StatCrazy8 SET loseAmount = '${(row.loseAmount + 1)}' WHERE username = '${opponents[i].username}'`);
            });
        }
        io.socketsLeave(parseInt(idGame));
        for (let i = 0; i < game.playerAmount; i++) {
            io.sockets.sockets.get(game.playerList[i].socketid).join('');
        }
    });

    socket.on("missedWinCrazy8", (idGame) => {
        const game = getGameById(idGame);
        const player = game.currentPlayer();
        player.pickCard();
        player.pickCard();
        game.changeTurn();
        const currentPlayer = game.currentPlayer();
        boardAnalyseCrazy8(game, currentPlayer);
    });

    function prepareCrazy8(idGame) {
        const game = getGameById(idGame);
        game.prepareRound();
        const currentPlayer = game.currentPlayer();
        boardAnalyseCrazy8(game, currentPlayer);
    }

    function boardAnalyseCrazy8(game, currentPlayer) {
        setTimeout(() => {
            for (let i = 0; i < game.playerAmount; i++) {
                io.to(game.playerList[i].socketid).emit("refreshHandCardCrazy8", handCard);
            }
            console.log(`the last card played was a ${game.getLastCard().value} of ${game.getLastCard().type}`);
            if (!currentPlayer.canPlay()) {
                const cardPicked = currentPlayer.pickCard();
                if (cardPicked) {
                    if (cardPicked.value == game.lastCardPlayed.value || cardPicked.type == game.lastCardPlayed.type) {
                        socket.emit("placeOrPickCrazy8", card);
                        return;
                    }
                }
                game.changeTurn();
                currentPlayer = game.currentPlayer();
                return boardAnalyseCrazy8(game, currentPlayer);
            }
            console.log(`the player ${currentPlayer.username} can play a card, we must let him choose his move`);
            for (let i = 0; i < game.playerAmount; i++) {
                let player = game.playerList[i];
                let handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
                if (player == currentPlayer) {
                    let playableCards = player.playableCards().map(card => ({ value: card.value, type: card.type }));
                    io.to(player.socketid).emit("playerTurnCrazy8", game.timer, playableCards, handCard);
                } else
                    io.to(player.socketid).emit("refreshHandCardCrazy8", handCard);
            }
        }, 5000);
    }

    function playCardCrazy8(cardChosen, typeChosen, currentPlayer) {
        switch (cardChosen.value) {
            case 1: currentPlayer.playCard1(cardChosen); break;
            case 2: currentPlayer.playCard2(cardChosen); break;
            case 7: currentPlayer.playCard7(cardChosen); break;
            case 8: currentPlayer.playCard8(cardChosen, typeChosen); break;
            case 10: currentPlayer.playCard10(cardChosen); break;
            case 11: currentPlayer.playCard11(cardChosen); break;
            default: currentPlayer.playNormalCard(cardChosen); break;
        }
    }

    socket.on("timeOutCrazy8", (idGame, username) => {
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        playerConcerned.pickCard();
        playerConcerned.pickCard();
        game.changeTurn();
        let handCard = playerConcerned.handCard.map(card => ({ value: card.value, type: card.type }));
        io.to(playerConcerned.socketid).emit("refreshHandCardCrazy8", handCard);
    });








    socket.on("chooseHiddenCardWar", (idGame, card, username) => {
        console.log(`the player ${username} chose a ${card.value} of ${card.type} for hidden`);
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        playerConcerned.playCard(card);
        socket.broadcast.to(parseInt(idGame)).emit("refreshOponnentCardWar", username);
        if (game.allPlayed()) {
            game.resetAllCardPlayed();
            game.updatePlayerStatus();
            game.updateFightingPlayers();
            if (game.isLocked()) {
                tieWar();
            } else if (game.isWarLocked()) {
                console.log("the fighting players are all locked in war, we must change fighting players")
                game.resetFightingPlayers();
                game.updateFightingPlayers();
                cardAnalyseWar();
            } else {
                for (let i = 0; i < game.fightingPlayers.length; i++) {
                    const player = game.fightingPlayers[i];
                    const handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
                    io.to(player.socketid).emit("playerTurnWar", handCard, game.timer);
                }
            }
        }
    });

    socket.on("chooseCardWar", (idGame, card, username) => {
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        playerConcerned.playCard(card);
        console.log(`the player ${username} chose a ${card.value} of ${card.type}, he has ${(playerConcerned.handCard.length + playerConcerned.pickCard.length)} in total`);
        socket.broadcast.to(parseInt(idGame)).emit("refreshOponnentCardWar", username);
        if (game.allPlayed()) {
            const cardPerPlayer = game.fightingPlayers.map(player => ({ username: player.username, card: { value: player.cardPlayed.value, type: player.cardPlayed.type } }));
            io.to(parseInt(idGame)).emit("revealAllCardWar", cardPerPlayer);
            cardAnalyseWar(game);
        }
    });

    function prepareWar(idGame) {
        const game = getGameById(idGame);
        game.prepareRound();
        nextTurnWar(game);
    }

    function nextTurnWar(game) {
        setTimeout(() => {
            for (let i = 0; i < game.playerAmount; i++) {
                const player = game.playerList[i];
                const handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
                io.to(player.socketid).emit("playerTurnWar", handCard, game.timer);
            }
        }, 1);
    }

    function tieWar(game) {
        console.log("the game is in a locked status, its a tie");
        for (let i = 0; i < game.playerAmount; i++) {
            const player = game.playerList[i];
            db.get(`SELECT * FROM StatWar WHERE username = '${player.username}'`, (err, row) => {
                db.run(`UPDATE StatWar SET tieAmount = ${(row.tieAmount + 1)} WHERE username = '${player.username}'`);
            });
        }
    }
    function cardAnalyseWar(game) {
        if (game.isWarTime()) {
            game.updatePlayerStatus();
            game.updateFightingPlayers();
            console.log(`the players ${game.fightingPlayers.map(player => player.username)} are in a war`);
            game.resetAllCardPlayed();
            if (game.isLocked()) {
                tieWar(game);
            } else if (game.isWarLocked()) {
                console.log("the fighting players are all locked in war, we must change fighting players");
                game.resetFightingPlayers();
                game.updateFightingPlayers();
                cardAnalyseWar(game);
            } else {
                for (let i = 0; i < game.fightingPlayers.length; i++) {
                    const player = game.fightingPlayers[i];
                    const handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
                    io.to(player.socketid).emit("playerHiddenTurnWar", handCard, game.timer);
                }
            }
        } else {
            const playerWinnerRound = game.fightingPlayers.filter(player => player.cardPlayed.value == game.getHighestCardValue())[0];
            console.log(`the player ${playerWinnerRound.username} won ${game.winableCards.length} cards`);
            game.winCard(playerWinnerRound);
            game.updatePlayerStatus();
            let updatesMade = []; let isGameEnd = false;
            for (let i = 0; i < game.playerAmount; i++) {
                if (game.playerList[i].hasNoCard()) {
                    let update = new Promise((resolve, reject) => {
                        db.get(`SELECT * FROM StatWar WHERE username = '${game.playerList[i].username}'`, (err, row) => {
                            db.run(`UPDATE StatWar SET loseAmount = ${(row.loseAmount + 1)} WHERE username = '${game.playerList[i].username}'`, (err) => {
                                console.log(`the player ${game.playerList[i].username} has been eliminated`);
                                game.eliminatePlayer(game.playerList[i]);
                                i--;
                                resolve(row);
                                if (playerWinnerRound.hasWon()) {
                                    db.get(`SELECT * FROM StatWar WHERE username = '${playerWinnerRound.username}'`, (err, row) => {
                                        db.run(`UPDATE StatWar SET winAmount = ${(row.winAmount + 1)} WHERE username = '${playerWinnerRound.username}'`);
                                    });
                                    console.log(`the player ${playerWinnerRound.username} has won the game`);
                                    isGameEnd = true;
                                }
                            });
                        });
                    });
                    updatesMade.push(update);
                }
            }

            Promise.all(updatesMade).then(() => {
                if (!isGameEnd) {
                    game.resetFightingPlayers();
                    nextTurnWar(game);
                }
            });
        }
    }






    socket.on("chooseCardTake6", (idGame, card, username) => {
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        playerConcerned.chooseCard(card);
        console.log(`the player ${username} choose the card ${card.value} which is ${card.pointAmount} points`);
        if (game.allPlayed()) {
            game.sortPlayerList();
            launchCardAnalyseTake6(game.playerList, game);
        }
    });

    function prepareTake6(idGame) {
        const game = getGameById(idGame);
        game.prepareRound();
        nextTurnTake6(game);
    }

    function nextTurnTake6(game) {
        setTimeout(() => {
            for (let i = 0; i < game.playerAmount; i++) {
                const player = game.playerList[i];
                const handCard = player.handCard.map(card => ({ value: card.value, pointAmount: card.pointAmount }));
                io.to(player.socketid).emit("playerTurnTake6", handCard, game.timer);
            }
        }, 1);
    }

    function launchCardAnalyseTake6(playerList, game) {
        if (game.hasEndCondition()) {
            return endTake6(game);
        } else {
            setTimeout(() => {
                if (playerList.length == 0) {
                    if (game.needOtherRound()) {
                        console.log(`starting another round`);
                        game.resetAll();
                        return prepareTake6(game.idGame);
                    } else {
                        return nextTurnTake6(game);
                    }
                } else {
                    const player = playerList[0];
                    game.placeCard(player, player.cardPlayed);
                    io.to(parseInt(game.idGame)).emit("refreshCardBoardTake6", game.cardBoard);
                    io.to(player.socketid).emit("refreshPlayerPointTake6", player.totalPoint);
                    return launchCardAnalyseTake6(playerList.filter(p => p.username != player.username), game);
                }
            }, 1);
        }
    }

    function endTake6(game) {
        const winners = game.getWinners();
        for (let i = 0; i < game.playerList.length; i++) {
            db.get(`SELECT * FROM StatTake6 WHERE username = '${game.playerList[i].username}'`, (err, row) => {
                const totalGamePlayed = row.winAmount + row.loseAmount;
                row.average = (row.average * totalGamePlayed + game.playerList[i].totalPoint) / (totalGamePlayed + 1);
                if (row.best > game.playerList[i].totalPoint || row.best == -1) {
                    row.best = game.playerList[i].totalPoint;
                }
                if (winners.includes(game.playerList[i])) {
                    db.run(`UPDATE StatTake6 SET winAmount = ${(row.winAmount + 1)}, best = ${row.best}, average = ${row.average} WHERE username = '${game.playerList[i].username}'`);
                    console.log(`the player ${game.playerList[i].username} has won`);
                } else {
                    db.run(`UPDATE StatTake6 SET loseAmount = ${(row.loseAmount + 1)}, best = ${row.best}, average = ${row.average} WHERE username = '${game.playerList[i].username}'`);
                    console.log(`the player ${game.playerList[i].username} has lost`);
                }
            });
        }
    }

    //*

    //Page statistique
    socket.on("askStat", username => {
        db.get(`SELECT * FROM StatWar WHERE username = '${username}'`, (err, row) => {
            console.dir(row);
            socket.emit("sendStatWar", row.winAmount, row.loseAmount, row.tieAmount);
        });
        db.get(`SELECT * FROM StatTake6 WHERE username = '${username}'`, (err, row) => {
            console.dir(row);
            socket.emit("sendStatTake6", row.winAmount, row.loseAmount, row.best, row.average);
        });
        db.get(`SELECT * FROM StatCrazy8 WHERE username = '${username}'`, (err, row) => {
            console.dir(row);
            socket.emit("sendStatCrazy8", row.winAmount, row.loseAmount);
        });
    });
    //Page reprendrePartie

    socket.on("demandePartiePause", username => {
        const games = gameList.filter(game => {
            if (game.getPlayerByUsername(username)) return true;
            return false;
        });
        let gamesInformations = [];
        for (let i = 0; i < games.length; i++) {
            let stringType = getStringOfGame(games[i]);
            gamesInformations.push({ idGame: games[i].idGame, playerAmount: games[i].playerAmount, timer: games[i].timer, typeOfGame: stringType });
        }
        socket.emit("demandePartiePause", gamesInformations);
    });

    socket.on("rejoindrePartiePause", (idGame, username) => {
        const game = getGameById(idGame);
        const player = game.getPlayerByUsername(username);
        player.socketid = socket.id; //* Le joueur s'est peut-être connécté avec un autre socketid que celui précédent.
        socket.leave('lobby');
        socket.join(parseInt(idGame));
    });


    //! FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS FONCTIONS


    function affectPlayer(idGame, username, isPlayerCreator) { // Fonction générale
        socket.leave('lobby');
        socket.join(idGame);
        const game = getGameById(idGame);
        let newPlayer = null
        if (game instanceof Take6Game) {
            //* Testing
            newPlayer = new Take6Player(username, game, socket.id);
            //let newPlayer = new Joueur6quiprend(username, idGame, socket.id);
            //listeJ.push(newPlayer);
            //*
        } else if (game instanceof WarGame) {
            //* Testing
            newPlayer = new WarPlayer(username, game, socket.id);
            //let newPlayer = new JoueurBataille(username, idGame, socket.id);
            //listeJ.push(newPlayer);
            //*
        } else if (game instanceof Crazy8Game) {
            newPlayer = new Crazy8Player(username, game, socket.id);
        }
        if (isPlayerCreator) {
            newPlayer.isCreator = true;
            socket.emit("teleportCreator", idGame);
        }
        game.addPlayer(newPlayer);
        if (game.playerList.length == game.playerAmount) {
            io.to('lobby').emit("gameUnableToJoin");
        }
        console.log(`user ${username} is now a player of ${idGame}`);
    }

    function preparationBataille(idGame, delai) { // Fonction Bataille (1 seul appel par partie)
        //Creation cartes + mélange
        let listeCarte = [];
        for (let i = 1; i < 53; i++) {
            listeCarte.push(i);
        }

        listeCarte.sort(() => {
            return Math.random() - 0.5;
        });
        //
        //Distribution des cartes
        let joueurs = listeJ.filter(joueur => joueur.idGame == idGame);
        let reste = 52 % joueurs.length;
        let nbCarteSansReste = Math.floor(52 / joueurs.length);
        let numCarte = 0;
        for (let i = 0; i < joueurs.length; i++) {
            let carteJoueur = [];
            for (let j = 0 + numCarte; j < nbCarteSansReste + numCarte; j++) {
                carteJoueur.push(listeCarte[j]);
            }
            if (reste != 0) {
                numCarte += nbCarteSansReste + 1;
                carteJoueur.push(listeCarte[numCarte - 1]);
                reste--;
            } else {
                numCarte += nbCarteSansReste;
            }
            let listePseudo = [];
            for (let j = 0; j < joueurs.length; j++) {
                listePseudo.push(joueurs[j].username);
            }
            joueurs[i].listeCarte = carteJoueur;
            io.to(joueurs[i].socketid).emit("PrepaBataille", [carteJoueur, listePseudo, delai]);
        }
    }

    function lancementTourBataille(idGame, joueurs) {
        setTimeout(async () => {

            let joueurCarteMax = joueurs.filter(joueur => valeurCarteBataille(joueurs[0].carteJouee[joueurs[0].carteJouee.length - 1]) == valeurCarteBataille(joueur.carteJouee[joueur.carteJouee.length - 1]));
            console.log("valeur de la carte à battre:", valeurCarteBataille(joueurs[0].carteJouee[joueurs[0].carteJouee.length - 1]));
            console.dir(joueurs.map(joueur => [joueur.username, joueur.listeCarte.length + joueur.cartePioche.length, joueur.carteJouee[joueur.carteJouee.length - 1]]));
            if (joueurCarteMax.length == 1) { // Cas 1 gagnant (!bataille)
                joueurs = listeJ.filter(joueur => joueur.idGame == idGame);
                let remainingPlayers = joueurs;
                for (let i = 0; i < joueurs.length; i++) { // Don des cartes au gagnant
                    for (let j = 0; j < joueurs[i].carteJouee.length; j++) {
                        joueurCarteMax[0].cartePioche.push(joueurs[i].carteJouee[j]);
                    }
                    joueurs[i].carteJouee = [];
                    joueurs[i].concerne = true;
                    joueurs[i].bloque = false;
                    if (joueurs[i].listeCarte.length == 0 && joueurs[i].cartePioche.length == 0) { //Cartes total advesaire = 0 => elimination
                        listeJ = listeJ.filter(joueur => joueur.username != joueurs[i].username);
                        db.get("SELECT * FROM StatBataille WHERE username = '" + joueurs[i].username + "'", (err, row) => {
                            db.run("UPDATE StatBataille SET nbPerdueBataille = " + (row.nbPerdueBataille + 1) + " WHERE username = '" + joueurs[i].username + "'");
                            db.run("DELETE FROM JoueurPartie WHERE idPartie = " + idGame + " AND pseudoJoueur = '" + joueurs[i].username + "'");
                            db.run("UPDATE Partie SET nbJoueur = " + (joueurs.length - 1) + " WHERE idGame = " + idGame);
                        });
                        const socket = await io.in(joueurs[i].socketid).fetchSockets();
                        console.log(joueurs[i].username + " éliminé");
                        socket[0].leave(parseInt(idGame));
                        socket[0].join('');
                        socket[0].emit("perduBataille");
                        remainingPlayers.filter(joueur => joueur != joueurs[i]);
                    }
                }
                if (remainingPlayers.length == 1) {
                    io.to(remainingPlayers[0].socketid).emit("victoireBataille");
                    return;
                }
                for (let i = 0; i < remainingPlayers.length; i++) {
                    io.to(remainingPlayers[i].socketid).emit("retourInitialBataille", remainingPlayers[i].listeCarte);
                }

                return;
            } else { // Cas gagnant multiples (bataille)
                console.log("BATAILLE!");
                let joueursC = joueurs.filter(joueur => {
                    if (valeurCarteBataille(joueur.carteJouee[joueur.carteJouee.length - 1]) != valeurCarteBataille(joueurs[0].carteJouee[joueurs[0].carteJouee.length - 1])) {
                        joueur.concerne = false;
                        return false;
                    } else {
                        return true;
                    }
                });
                for (let i = 0; i < joueursC.length; i++) {
                    if (joueursC[i].cartePioche.length == 0 && joueursC[i].listeCarte.length == 0) { // carteTotal = 0 => !(completer bataille) => !(concerné)
                        joueursC[i].concerne = false;
                        joueursC[i].bloque = true;
                        joueursC.filter(joueur => joueur != joueursC[i]);
                    }
                }
                if (joueursC.length == 0) {
                    console.log("joueursC bloques");
                    let carteABattre = valeurCarteBataille(joueurs[0].carteJouee[joueurs[0].carteJouee.length - 1]);
                    joueursC = listeJ.filter(joueur => {
                        if (!joueur.concerne && !joueur.bloque && joueur.listeCarte.length != 0 && joueur.cartePioche.length != 0) {
                            joueur.conerne = true;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    let carteMax = valeurCarteBataille(Math.max(...joueursC.map(joueur => Math.max(...joueur.listeCarte, ...joueur.cartePioche))));
                    if (carteMax <= carteABattre || carteMax == Infinity) {
                        for (let i = 0; i < joueurs.length; i++) {
                            io.to(joueurs[i].socketid).emit("egaliteBataille");//////////
                            db.get(`SELECT nbNulBataille FROM StatBataille WHERE username = '${joueurs[i].username}`, (err, row) => {
                                db.run(`UPDATE StatBataille SET nbNulBataille = ${row.nbNulBataille + 1} WHERE username = ${joueurs[i].username}`)
                            });
                            io.to(joueurs[i].socketid).join('');
                            io.to(joueurs[i].socketid).leave(parseInt(idGame));
                        }
                        listeJ.filter(joueur => joueur.idGame != idGame);
                    } else {
                        return lancementTourBataille(idGame, joueurs);
                    }
                }
                for (let i = 0; i < joueurs.length; i++) {
                    if (joueurs[i].listeCarte.length == 0) {
                        joueurs[i].listeCarte = joueurs[i].cartePioche;
                        joueurs[i].cartePioche = [];
                    }
                }
                let listePseudoC = [];
                for (let i = 0; i < joueursC.length; i++) {
                    listePseudoC.push(joueursC[i]);
                    io.to(joueursC[i].socketid).emit("choixCarteCacheeBataille", joueursC[i].listeCarte);//////////
                }
                io.to(parseInt(idGame)).emit("Bataille!", listePseudoC);//////////
            }
        }, joueurs.length * 1500);
    }

    function preparation6QP(data, Delais) { // Fonction 6 qui prend
        //Creation cartes + mélange
        let listeCarte = [];
        for (let i = 1; i < 105; i++) {
            listeCarte.push(i);
        }

        listeCarte.sort(() => {
            return Math.random() - 0.5;
        });
        //
        //Distribution des cartes
        let cartePlateau = [];
        for (let i = 0; i < 4; i++) {
            cartePlateau.push(listeCarte[i]);
        }
        let p = new Partie6quiprend([[cartePlateau[0]], [cartePlateau[1]], [cartePlateau[2]], [cartePlateau[3]]], data);
        listeP.push(p);

        let personnes = io.sockets.adapter.rooms.get(parseInt(data));

        let numJoueur = 0;
        personnes.forEach(socketid => {
            let carteJoueur = [];
            const joueur = listeJ.filter(joueur => joueur.idGame == data && socketid == joueur.socketid);
            for (let i = 4 + numJoueur * 10; i < 14 + numJoueur * 10; i++) {
                carteJoueur.push(listeCarte[i]);
            }
            db.all("SELECT pseudoJoueur FROM JoueurPartie WHERE idPartie = " + data, (err, rows) => {
                let listePseudo = [];
                rows.forEach(row => {
                    listePseudo.push(row.pseudoJoueur);
                });
                joueur[0].listeCarte = carteJoueur;
                io.to(socketid).emit("Prepa6quiprend", [carteJoueur, listePseudo, cartePlateau, joueur[0].score, Delais]);
            });
            numJoueur++;
        });
        return;
    }

    function lancementTour6QP(idGame, joueursRestants) { // Fonction 6 qui prend
        setTimeout(() => {
            1
            //Recuperation de la partie
            let partie;
            for (let i = 0; i < listeP.length; i++) {
                if (listeP[i].idGame == idGame) {
                    partie = listeP[i];
                }
            }
            //
            //Recuperation des dernieres cartes de chaque ligne
            let Lcarte = [];
            for (let j = 0; j < 4; j++) {
                Lcarte.push(partie.liste[j][partie.liste[j].length - 1]);
            }
            //
            let joueur = joueursRestants[0];
            let listeEcart = [parseInt(joueur.carteJouee) - Lcarte[0], parseInt(joueur.carteJouee) - Lcarte[1], parseInt(joueur.carteJouee) - Lcarte[2], parseInt(joueur.carteJouee) - Lcarte[3]];
            let ligneEcartMin = -1;
            let min = 104;
            for (let j = 0; j < 4; j++) {
                if (listeEcart[j] > 0 && min > listeEcart[j]) {
                    ligneEcartMin = j + 1;
                    min = listeEcart[j];
                }
            }
            if (ligneEcartMin == -1) {
                let Lpts = [0, 0, 0, 0];
                let ligne = -1;
                let L = partie.liste;
                //Calcul de la ligne avec le moins de points
                for (let j = 0; j < 4; j++) {
                    for (let k = 0; k < L[j].length; k++) {
                        Lpts[j] += comptePts6quiprend(L[j][k]);
                    }
                }
                for (let j = 0; j < 4; j++) {
                    if (min > Lpts[j]) {
                        ligne = j + 1;
                        min = Lpts[j];
                    }
                }
                //
                partie.liste[ligne - 1] = [parseInt(joueur.carteJouee)];
                joueur.score += min;
                io.to(parseInt(idGame)).emit("casAnormal6quiprend", [ligne, parseInt(joueur.carteJouee), joueur.username, joueur.score]);
                if (joueur.score >= 66) {
                    return fin6quiprend(idGame);
                }
                joueursRestants[0].carteJouee = null;
                let joueurs = joueursRestants.filter(joueur => joueur.username != joueursRestants[0].username);
                if (joueurs.length == 0) {
                    let joueursR = listeJ.filter(joueur => joueur.idGame == idGame);
                    if (joueursR[0].listeCarte.length == 0) {
                        setTimeout(() => {
                            listeP.filter(partie => partie.idGame != idGame);

                            db.get("SELECT delai FROM Partie WHERE idGame = " + idGame, (err, row) => {
                                preparation6QP(idGame, row.delai);
                            })
                            db.close;
                        }, 1000)
                        return;
                    }
                    for (let i = 0; i < joueursR.length; i++) {
                        io.to(joueursR[i].socketid).emit("retourInitial6quiprend", joueursR[i].listeCarte);
                    }
                    return;
                }
                return lancementTour6QP(idGame, joueurs);
            } else if (partie.liste[ligneEcartMin - 1].length == 5) {
                for (let j = 0; j < 5; j++) {
                    joueur.score += comptePts6quiprend(partie.liste[ligneEcartMin - 1][j]);
                }
                partie.liste[ligneEcartMin - 1] = [parseInt(joueur.carteJouee)];
                io.to(parseInt(idGame)).emit("casAnormal6quiprend", [ligneEcartMin, parseInt(joueur.carteJouee), joueur.username, joueur.score]);
                if (joueur.score >= 66) {
                    return fin6quiprend(idGame);
                }
                joueursRestants[0].carteJouee = null;
                let joueurs = joueursRestants.filter(joueur => joueur.username != joueursRestants[0].username);
                if (joueurs.length == 0) {
                    let joueursR = listeJ.filter(joueur => joueur.idGame == idGame);
                    if (joueursR[0].listeCarte.length == 0) {
                        setTimeout(() => {
                            listeP.filter(partie => partie.idGame != idGame);

                            db.get("SELECT delai FROM Partie WHERE idGame = " + idGame, (err, row) => {
                                preparation6QP(idGame, row.delai);
                            })
                            db.close;
                        }, 1000)
                        return;
                    }
                    for (let i = 0; i < joueursR.length; i++) {
                        io.to(joueursR[i].socketid).emit("retourInitial6quiprend", joueursR[i].listeCarte);
                    }
                    return;
                }
                return lancementTour6QP(idGame, joueurs);
            } else {
                partie.liste[ligneEcartMin - 1].push(parseInt(joueur.carteJouee));
                io.to(parseInt(idGame)).emit("casNormal6quiprend", [ligneEcartMin, partie.liste[ligneEcartMin - 1].length, parseInt(joueur.carteJouee)]);
                joueursRestants[0].carteJouee = null;
                let joueurs = joueursRestants.filter(joueur => joueur.username != joueursRestants[0].username);
                if (joueurs.length == 0) {
                    let joueursR = listeJ.filter(joueur => joueur.idGame == idGame);
                    if (joueursR[0].listeCarte.length == 0) {
                        setTimeout(() => {
                            listeP.filter(partie => partie.idGame != idGame);

                            db.get("SELECT delai FROM Partie WHERE idGame = " + idGame, (err, row) => {
                                preparation6QP(idGame, row.delai);
                            })
                            db.close;
                        }, 1000)
                        return;
                    }
                    for (let i = 0; i < joueursR.length; i++) {
                        io.to(joueursR[i].socketid).emit("retourInitial6quiprend", joueursR[i].listeCarte);
                    }
                    return;
                }
                return lancementTour6QP(idGame, joueurs);
            }
        }, 1500);

    }

    function fin6quiprend(idGame) { // Fonction 6 qui prend
        const joueursRestants = listeJ.filter(joueur => joueur.idGame == idGame);
        joueursRestants.sort((a, b) => a.score - b.score);
        io.to(parseInt(idGame)).emit("fin6quiprend", joueursRestants[0].username);

        //Cas gagnant
        db.get("SELECT nbGagnee6quiprend FROM Stat6quiprend WHERE username = '" + joueursRestants[0].username + "'", (err, row) => {
            let n = row.nbGagnee6quiprend;
            db.run("UPDATE Stat6quiprend SET nbGagnee6quiprend = " + (n + 1) + " WHERE username = '" + joueursRestants[0].username + "'");
            listeJ.filter(joueur => joueur != joueursRestants[0]);
        });
        db.get("SELECT record6quiprend FROM Stat6quiprend WHERE username = '" + joueursRestants[0].username + "'", (err, row) => {
            let n = parseInt(row.record6quiprend);
            if (joueursRestants[0].score < n || n == -1) {
                db.run("UPDATE Stat6quiprend SET record6quiprend = " + joueursRestants[0].score + " WHERE username = '" + joueursRestants[0].username + "'");
            }
        });
        db.get("SELECT pointsmoyen6quiprend, nbPerdue6quiprend, nbGagnee6quiprend FROM Stat6quiprend WHERE username = '" + joueursRestants[0].username + "'", (err, row) => {
            let nbPartieTotal = row.nbGagnee6quiprend + row.nbPerdue6quiprend;
            if (!row.pointsmoyen6quiprend) {
                db.run("UPDATE Stat6quiprend SET pointsmoyen6quiprend = " + joueursRestants[0].score + " WHERE username = '" + joueursRestants[0].username + "'");
            } else {
                db.run("UPDATE Stat6quiprend SET pointsmoyen6quiprend = " + ((joueursRestants[0].score + row.pointsmoyen6quiprend * nbPartieTotal) / (nbPartieTotal + 1)) + " WHERE username = '" + joueursRestants[0].username + "'");
            }
        });
        //
        //Cas perdants
        for (let i = 1; i < joueursRestants.length; i++) {
            db.get("SELECT nbPerdue6quiprend FROM Stat6quiprend WHERE username = '" + joueursRestants[i].username + "'", (err, row) => {
                let n = row.nbPerdue6quiprend;
                db.run("UPDATE Stat6quiprend SET nbPerdue6quiprend = " + (n + 1) + " WHERE username = '" + joueursRestants[i].username + "'");
                listeJ.filter(joueur => joueur != joueursRestants[i]);
            });
            db.get("SELECT pointsmoyen6quiprend, nbPerdue6quiprend, nbGagnee6quiprend FROM Stat6quiprend WHERE username = '" + joueursRestants[i].username + "'", (err, row) => {
                let nbPartieTotal = row.nbGagnee6quiprend + row.nbPerdue6quiprend;
                if (!row.pointsmoyen6quiprend) {
                    db.run("UPDATE Stat6quiprend SET pointsmoyen6quiprend = " + joueursRestants[i].score + " WHERE username = '" + joueursRestants[i].username + "'");
                } else {
                    db.run("UPDATE Stat6quiprend SET pointsmoyen6quiprend = " + ((joueursRestants[i].score + row.pointsmoyen6quiprend * nbPartieTotal) / (nbPartieTotal + 1)) + " WHERE username = '" + joueursRestants[i].username + "'");
                }
            });
        }
        //
        const sockets = io.sockets.adapter.rooms.get(parseInt(idGame));
        sockets.forEach(socketid => {
            io.sockets.sockets.get(socketid).join('');
        });
        io.socketsLeave(parseInt(idGame));
    }
});

function valeurCarteBataille(x) {
    if (x == 1) {
        return 14;
    }
    return Math.abs(x - 2) % 13 + 2;
}

function comptePts6quiprend(x) { // Fonction 6 qui prend
    if (x == 55) {
        return 7;
    } else if (x % 10 == 5) {
        return 2;
    } else if (x % 10 == 0) {
        return 3;
    } else if (x % 11 == 0) {
        return 5;
    } else {
        return 1;
    }
}







function getGameById(idGame) {
    return gameList.filter(g => g.idGame == idGame)[0];
}

function getStringOfGame(game) {
    if (game instanceof WarGame) return "jeu-de-bataille";
    else if (game instanceof Take6Game) return "6-qui-prend";
    else if (game instanceof Crazy8Game) return "crazy8";
}