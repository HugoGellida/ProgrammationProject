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
const sql = require("sqlite3").verbose();
const db = new sql.Database("./Database.db");

let gameList = [];

//db.run("CREATE TABLE User(username VARCHAR(10) PRIMARY KEY, password VARCHAR(10), isConnected BOOLEAN, socketid VARCHAR(50), chatColor VARCHAR(10), title VARCHAR(20))");
//db.run("CREATE TABLE StatWar(username REFERENCES User(username), loseAmount INTEGER, winAmount INTEGER, tieAmount INTEGER)");
//db.run("CREATE TABLE StatTake6(username REFERENCES User(username), loseAmount INTEGER, winAmount INTEGER, best INTEGER, average FLOAT)");
//db.run("CREATE TABLE StatCrazy8(username REFERENCES User(username), loseAmount INTEGER, winAmount INTEGER)");
//db.run("CREATE TABLE BuyableColor(username REFERENCES User(username), cost INTEGER, color VARCHAR(10), isBought BOOLEAN)");
//db.run("CREATE TABLE BuyableTitle(username REFERENCES User(username), cost INTEGER, title VARCHAR(20), isBought BOOLEAN)");
db.run("UPDATE User SET isConnected = false");

function insertShop(username) {
    db.run(`INSERT INTO BuyableColor VALUES('${username}', 5000, 'yellow', false)`);
    db.run(`INSERT INTO BuyableColor VALUES('${username}', 5000, 'white', false)`);
    db.run(`INSERT INTO BuyableColor VALUES('${username}', 10000, 'silver', false)`);
    db.run(`INSERT INTO BuyableColor VALUES('${username}', 10000, 'cyan', false)`);
    db.run(`INSERT INTO BuyableColor VALUES('${username}', 25000, 'gold', false)`);

    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 2500, 'RELAX', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 3000, 'GAMER', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 3500, 'SUN', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 5000, 'WING', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 5000, 'SLEEP', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 7500, 'PREDATOR', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 10000, 'ANGEL', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 10000, 'DEMON', false)`);
    db.run(`INSERT INTO BuyableTitle VALUES('${username}', 20000, 'DOOM', false)`);
}


server.listen(3001, () => {
    console.log('Le serveur écoute sur le port 3001');
});


const rooms = { "preLobby": [], "lobby": [] };

io.on("connection", (socket) => {
    console.log(`presence detected on site: ${socket.id}`);

    socket.on("askChatTitles", async (username) => {
        const rowWar = await getStats("StatWar", username);
        const rowTake6 = await getStats("StatTake6", username);
        const rowCrazy8 = await getStats("StatCrazy8", username);
        const buyableTitles = await getBuyableTitles(username, true);
        let locked = [];
        let unlocked = [];
        if (rowWar.winAmount >= 50 && rowTake6.winAmount >= 50 && rowCrazy8.winAmount >= 50) unlocked.push("ULTIMATE");
        else locked.push({ name: "Player eradicator", title: "ULTIMATE", difficulty: "extreme", description: "Win 50 of every game" });
        if (rowWar.winAmount >= 30) unlocked.push("WAR GENERAL");
        else locked.push({ name: "War addict", title: "WAR GENERAL", difficulty: "hard", description: "Win 30 times at War" });
        if (rowTake6.winAmount >= 30) unlocked.push("NO GAIN NO LOSE");
        else locked.push({ name: "Don't take it or die", title: "NO GAIN NO LOSE", difficulty: "hard", description: "Win 30 times at Take6" });
        if (rowCrazy8.winAmount >= 30) unlocked.push("MANIAC");
        else locked.push({ name: "Crazier and crazier", title: "MANIAC", difficulty: "hard", description: "Win 30 times at Crazy8" });
        if (rowWar.winAmount >= 1 && rowTake6.winAmount >= 1 && rowCrazy8.winAmount >= 1) unlocked.push("STARTER");
        else locked.push({ name: "It's only the beggining", title: "STARTER", difficulty: "medium", description: "Win every game once" });
        unlocked.push("NOOBY"); unlocked.push("TESTER");
        buyableTitles.forEach(row => unlocked.push(row.title));
        socket.emit("sendChatTitles", locked, unlocked);
    });

    socket.on("chooseChatTitle", (username, title) => {
        db.run(`UPDATE User SET title = '${title}' WHERE username = '${username}'`);
    });

    socket.on("askChatColors", async (username) => {
        const rowWar = await getStats("StatWar", username);
        const rowTake6 = await getStats("StatTake6", username);
        const rowCrazy8 = await getStats("StatCrazy8", username);
        const buyableColors = await getBuyableColors(username, true);
        let locked = [];
        let unlocked = [];
        if (rowWar.winAmount >= 10 && rowTake6.winAmount >= 10 && rowCrazy8.winAmount >= 10) unlocked.push("red");
        else locked.push({ name: "A thirst for victory", color: "red", difficulty: "hard", description: "Win 10 of every game" });
        if (rowWar.winAmount >= 10) unlocked.push("blue");
        else locked.push({ name: "War veteran", color: "blue", difficulty: "medium", description: "Win 10 times at War" });
        if (rowTake6.winAmount >= 10) unlocked.push("purple");
        else locked.push({ name: "The only thing I will take", color: "purple", difficulty: "medium", description: "Win 10 times at Take6" });
        if (rowCrazy8.winAmount >= 10) unlocked.push("pink");
        else locked.push({ name: "Going crazy", color: "pink", difficulty: "medium", description: "Win 10 times at Crazy8" });
        if (rowWar.winAmount >= 1 || rowTake6.winAmount >= 1 || rowCrazy8.winAmount >= 1) unlocked.push("brown");
        else locked.push({ name: "Ready to triumph", color: "brown", difficulty: "easy", description: "Win your first game ever" });
        unlocked.push("gray");
        buyableColors.forEach(row => unlocked.push(row.color));
        socket.emit("sendChatColors", locked, unlocked);
    });

    socket.on("askShopStock", async (username) => {
        const buyableColors = await getBuyableColors(username, false);
        const buyableTitles = await getBuyableTitles(username, false);
        let notBoughtColors = [];
        let notBoughtTitles = [];
        buyableColors.forEach(row => notBoughtColors.push(row));
        buyableTitles.forEach(row => notBoughtTitles.push(row));
        db.get(`SELECT * FROM User WHERE username = ?`, [username], (err, row) => {
            socket.emit("sendShopStock", notBoughtColors, notBoughtTitles, row.money);
        });
    });

    socket.on("purchaseAttempt", async (username, objectName) => {
        const buyableColors = await getBuyableColors(username, false);
        const buyableTitles = await getBuyableTitles(username, false);
        let target;
        buyableColors.forEach(row => {
            if (row.color == objectName) {
                target = row;
            }
        });
        buyableTitles.forEach(row => {
            if (row.title == objectName) {
                target = row;
            }
        });
        db.get("SELECT * FROM User WHERE username = ?", [username], (err, row) => {
            if (target.cost > row.money) {
                socket.emit("deniedPurchase", target.cost - row.money);
            } else {
                if (target.title) {
                    db.run("UPDATE BuyableTitle SET isBought = true WHERE username = ? AND title = ?", [username, objectName], (err) => {
                        db.run("UPDATE User SET money = ? WHERE username = ?", [row.money - target.cost, username], (err) => {
                            socket.emit("acceptedPurchase");
                        });
                    });
                } else if (target.color) {
                    db.run("UPDATE BuyableColor SET isBought = true WHERE username = ? AND color = ?", [username, objectName], (err) => {
                        db.run("UPDATE User SET money = ? WHERE username = ?", [row.money - target.cost, username], (err) => {
                            socket.emit("acceptedPurchase");
                        });
                    });
                }
            }
        })
    })

    async function getStats(tableName, username) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${tableName} WHERE username = ?`, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async function getBuyableTitles(username, bought) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM BuyableTitle WHERE username = ? AND isBought = ?`, [username, bought], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async function getBuyableColors(username, bought) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM BuyableColor WHERE username = ? AND isBought = ?`, [username, bought], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    socket.on("chooseChatColor", (username, color) => {
        db.run(`UPDATE User SET chatColor = '${color}' WHERE username = '${username}'`);
    });

    socket.on("testing", (idGame) => {
        const game = getGameById(idGame);
        game.prepareRound();
        for (i = 0; i < game.playerAmount; i++) {
            let opponentsInfo = [];
            const player = game.playerList[i];
            for (j = 0; j < game.playerAmount; j++) {
                if (i != j) {
                    const opponent = game.playerList[j];
                    opponentsInfo.push({ username: opponent.username, card: null, cardAmount: opponent.handCard.length + opponent.pickCard.length });
                }
            }
            const handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
            io.to(player.socketid).emit("testingResult", handCard, opponentsInfo);
        }
    });


    socket.join('preLobby');
    socket.emit("goToPreLobby");
    rooms["preLobby"].push(socket.id);

    socket.on("disconnect", () => {
        db.run(`UPDATE User SET isConnected = false WHERE socketid = '${socket.id}'`, (err) => {
            console.log(`the player with socket ${socket.id} has been disconnected`);
            const roomKeys = Object.keys(rooms)
            const socketLastRoom = roomKeys.filter(key => rooms[key].includes(socket.id))[0];
            socket.leave(socketLastRoom);
            rooms[socketLastRoom] = rooms[socketLastRoom].filter(socketid => socketid != socket.id);
            const game = getGameById(socketLastRoom);
            if (game) {
                const playerSocket = game.playerList.filter(player => player.socketid == socket.id)[0];
                if (game.isLaunched) {
                    io.to(parseInt(game.idGame)).emit("messageReceived", `player ${playerSocket.username} had a skill issue and rage quitted`, "SERVER", "green");
                    game.eliminatePlayer(playerSocket);
                    if (game instanceof WarGame) {
                        db.get(`SELECT * FROM StatWar WHERE username = '${playerSocket.username}'`, (err, row) => {
                            db.run(`UPDATE StatWar SET loseAmount = ${(row.loseAmount + 1)} WHERE username = '${playerSocket.username}'`);
                        });
                        if (game.playerAmount == 1) {
                            db.get(`SELECT * FROM StatWar WHERE username = '${game.playerList[0].username}'`, (err, row) => {
                                db.run(`UPDATE StatWar SET winAmount = ${(row.winAmount + 1)} WHERE username = '${game.playerList[0].username}'`);
                            });
                            db.get(`SELECT * FROM User WHERE username = '${game.playerList[0].username}'`, (err, row) => {
                                db.run(`UPDATE User SET money = ${(row.money + 750)} WHERE username = '${game.playerList[0].username}'`);
                            });
                            game.isLaunched = false;
                            io.to(game.playerList[0].socketid).emit("winWar");
                        } if (game.allPlayed()) {
                            if (game.isHidden) return hiddenCardAnalyseWar(game);
                            else return cardAnalyseWar(game);
                        }
                    } else if (game instanceof Take6Game) {
                        db.get(`SELECT * FROM StatTake6 WHERE username = '${playerSocket.username}'`, (err, row) => {
                            const average = (((row.loseAmount + row.winAmount) * row.average) + 66) / (row.loseAmount + row.winAmount + 1);
                            db.run(`UPDATE StatTake6 SET loseAmount = ${(row.loseAmount + 1)}, average = ${average} WHERE username = '${playerSocket.username}'`);
                        });
                        if (game.playerAmount == 1) {
                            db.get(`SELECT * FROM StatTake6 WHERE username = '${game.playerList[0].username}'`, (err, row) => {
                                db.run(`UPDATE StatTake6 SET winAmount = ${(row.winAmount + 1)} WHERE username = '${game.playerList[0].username}'`);
                            });
                            db.get(`SELECT * FROM User WHERE username = '${game.playerList[0].username}'`, (err, row) => {
                                db.run(`UPDATE User SET money = ${(row.money + 750)} WHERE username = '${game.playerList[0].username}'`);
                            });
                            game.isLaunched = false;
                            io.to(game.playerList[0].socketid).emit("endTake6", [game.playerList[0].username]);
                        }
                        if (game.allPlayed()) {
                            game.sortPlayerList();
                            launchCardAnalyseTake6(game.playerList, game);
                        }
                    } else if (game instanceof Crazy8Game) {
                        db.get(`SELECT * FROM StatCrazy8 WHERE username = '${playerSocket.username}'`, (err, row) => {
                            db.run(`UPDATE StatCrazy8 SET loseAmount = ${(row.loseAmount + 1)} WHERE username = '${playerSocket.username}'`);
                            if (game.currentPlayer().username == playerSocket.username) {
                                game.changeTurn();
                                currentPlayer = game.currentPlayer();
                                boardAnalyseCrazy8(game, currentPlayer);
                            }
                        });
                    }
                } else {
                    io.to(game.idGame).emit("messageReceived", `The player ${playerSocket.username} has left`, "SERVER", "green");
                    if (!game.isPaused) {
                        if (game.playerList.length == 1) {
                            gameList = gameList.filter(g => g.idGame != game.idGame);
                            console.log(`game ${game.idGame} has been removed`);
                        } else {
                            game.playerList = game.playerList.filter(player => player.username != playerSocket.username);
                            if (playerSocket.isCreator) {
                                game.playerList[0].isCreator = true;
                                io.to(game.playerList[0].socketid).emit("showLaunchButton");
                            }
                        }
                        loadGames();
                    }
                }
            }
        });
    });

    //Page Connexion
    socket.on("connectionAttempt", (username, password) => {
        db.get(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}' AND isConnected = false`, (err, row) => {
            if (row) {
                console.log(`connection allowed for user ${username}`);
                socket.leave('preLobby')
                socket.join('lobby');
                rooms["preLobby"] = rooms["preLobby"].filter(socketid => socketid != socket.id);
                rooms["lobby"].push(socket.id);
                db.run(`UPDATE User SET isConnected = true, socketid = '${socket.id}' WHERE username = '${username}'`);
                socket.emit("connectionAllowed", username);
            } else {
                socket.emit("connectionDenied");
            }
        });
    });
    //Page Inscription
    socket.on("registrationAttempt", (username, password) => {
        db.get(`SELECT * FROM User WHERE username = '${username}'`, (err, row) => {
            if (!row) {
                socket.leave('preLobby');
                socket.join('lobby');
                rooms["lobby"].push(socket.id);
                rooms["preLobby"] = rooms["preLobby"].filter(socketid => socketid != socket.id);
                db.run(`INSERT INTO User VALUES ('${username}', '${password}', true, '${socket.id}', 'grey', 'NOOBY', 0)`, (err) => {
                    db.run(`INSERT INTO StatTake6 VALUES('${username}', 0, 0, -1, -1)`);
                    db.run(`INSERT INTO StatWar VALUES('${username}', 0, 0, 0)`);
                    db.run(`INSERT INTO StatCrazy8 VALUES('${username}', 0, 0)`);
                    insertShop(username);
                    console.log(`registration allowed for user ${username}`);
                    socket.emit("registrationAllowed", username);
                });
            }
        });
    });
    //Page CreationPartie
    socket.on("createGame", (gameInfo) => {
        let newIdGame = 1;
        for (let i = 0; i < gameList.length; i++) {
            if (gameList[i].idGame == newIdGame) newIdGame++;
            else if (gameList[i].idGame > newIdGame) break;
        }
        console.log(gameInfo);
        let newGame = null;
        if (gameInfo.type == "crazy8") {
            newGame = new Crazy8Game(gameInfo.playerAmount, gameInfo.timer, newIdGame, gameInfo.gameStatus);
        } else if (gameInfo.type == "jeu-de-bataille") {
            newGame = new WarGame(gameInfo.playerAmount, gameInfo.timer, newIdGame, gameInfo.gameStatus);
        } else if (gameInfo.type == "6-qui-prend") {
            newGame = new Take6Game(gameInfo.playerAmount, gameInfo.timer, newIdGame, gameInfo.gameStatus);
        }
        gameList.push(newGame);
        rooms[newIdGame] = [];
        affectPlayer(newIdGame, gameInfo.creator, true);
    });
    //Page Choix
    socket.on("loadGame", () => {
        loadGames();
    });

    function loadGames() {
        let games = [];
        console.log("hi");
        for (let i = 0; i < gameList.length; i++) {
            if (gameList[i].playerAmount != rooms[gameList[i].idGame].length && gameList[i].status == "public" && !gameList[i].isPaused) {
                console.log(`game ${gameList[i]} added`);
                games.push({ id: gameList[i].idGame, type: getStringOfGame(gameList[i]), actualPlayerAmount: gameList[i].playerList.length, maxPlayerAmount: gameList[i].playerAmount });
            }
        }
        io.to("lobby").emit("loadGame", games);
    }

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
                    console.log(players[i].handCard, players[i].cardPlayed, game.timer, usernameList);
                    io.to(players[i].socketid).emit("resumeWar", players[i].handCard, players[i].cardPlayed, game.timer, usernameList);
                }
            } else if (game instanceof Take6Game) {
                for (let i = 0; i < players.length; i++) {
                    io.to(players[i].socketid).emit("resumeTake6", players[i].handCard, players[i].cardPlayed, game.timer, usernameList);
                }
            } else if (game instanceof Crazy8Game) {
                for (let i = 0; i < players.length; i++) {
                    io.to(players[i].socketid).emit("resumeCrazy8", players[i].handCard, game.timer, game.currentPlayer().username, usernameList);
                }
            }
        } else if (game.playerAmount == game.playerList.length) {
            game.isLaunched = true;
            console.log(`the game ${idGame} has been launched`);
            if (game instanceof WarGame) {
                prepareWar(idGame);
            } else if (game instanceof Take6Game) {
                prepareTake6(idGame);
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
    });

    socket.on("messageSent", (idGame, message, username) => { // data = [idPartie, Message, username]
        db.get(`SELECT * FROM User WHERE username = '${username}'`, (err, row) => {
            io.to(parseInt(idGame)).emit("messageReceived", message, username, row.chatColor, row.title);
        });
    });

    socket.on("askPause", idGame => {
        const game = getGameById(idGame);
        game.isLaunched = false;
        game.isPaused = true;
        rooms[idGame] = [];
        rooms["lobby"].push(...game.playerList);
        for (let i = 0; i < game.playerAmount; i++) {
            io.sockets.sockets.get(game.playerList[i].socketid).join('lobby');
        }
        io.to(parseInt(idGame)).emit("pauseAllowed");
        io.socketsLeave(parseInt(idGame));
    });

    //* Crazy8
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
        if (game.getLastCard().value == 1 && (cardChosen.value != 1 || cardChosen.value != 8) && currentPlayer.needPlay) {
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
        db.get(`SELECT * FROM StatCrazy8, User WHERE User.username = StatCrazy8.username AND username = '${username}'`, (err, row) => {
            db.run(`UPDATE StatCrazy8 SET winAmount = ${(row.winAmount + 1)} WHERE username = '${username}'`);
            db.run(`UPDATE User SET money = ${(row.money + 750)} WHERE username = '${username}'`);
        });
        const opponents = player.getOpponents();
        for (let i = 0; i < opponents.length; i++) {
            db.get(`SELECT * FROM StatCrazy8 WHERE username = '${opponents[i].username}'`, (err, row) => {
                db.run(`UPDATE StatCrazy8 SET loseAmount = ${(row.loseAmount + 1)} WHERE username = '${opponents[i].username}'`);
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
        console.dir(game.playerList);
        for (let i = 0; i < game.playerAmount; i++) {
            const player = game.playerList[i];
            let handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
            const lastCardPlayed = {value: game.getLastCard().value, type: game.getLastCard().type}
            io.to(player.socketid).emit("prepareCrazy8", game.getOpponentsUsername(player.username), handCard, game.timer, lastCardPlayed);
        }
        const currentPlayer = game.currentPlayer();
        boardAnalyseCrazy8(game, currentPlayer);
    }

    function boardAnalyseCrazy8(game, currentPlayer) {
        setTimeout(() => {
            for (let i = 0; i < game.playerAmount; i++) {
                let handCard = currentPlayer.handCard.map(card => ({ value: card.value, type: card.type }));
                io.to(game.playerList[i].socketid).emit("refreshHandCardCrazy8", handCard);
            }
            console.log(`the last card played was a ${game.getLastCard().value} of ${game.getLastCard().type}`);
            if (!currentPlayer.canPlay()) {
                const cardPicked = currentPlayer.pickCard();
                if (cardPicked) {
                    if (cardPicked.value == game.getLastCard().value || cardPicked.type == game.getLastCard().type) {
                        socket.emit("placeOrPickCrazy8", cardPicked);
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
                console.log(handCard);
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

    //* War
    socket.on("chooseHiddenCardWar", (idGame, card, username) => {
        console.log(`the player ${username} chose a ${card.value} of ${card.type} for hidden`);
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        playerConcerned.playCard(card);
        socket.broadcast.to(parseInt(idGame)).emit("refreshOponnentCardWar", username);
        if (game.allPlayed()) {
            hiddenCardAnalyseWar(game);
        }
    });

    function hiddenCardAnalyseWar(game) {
        game.resetAllCardPlayed();
        game.updatePlayerStatus();
        game.updateFightingPlayers();
        if (game.isLocked()) {
            tieWar();
        } else if (game.isWarLocked()) {
            console.log("the fighting players are all locked in war, we must change fighting players")
            game.resetFightingPlayers();
            game.updateFightingPlayers();
            cardAnalyseWar(game);
        } else {
            for (let i = 0; i < game.fightingPlayers.length; i++) {
                const player = game.fightingPlayers[i];
                const handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
                io.to(player.socketid).emit("playerTurnWar", handCard, game.getOpponentsUsername(player.username), game.timer);
                const opponents = game.playerList.filter(p => p.username != player.username).map((opponent) => ({cardAmount: opponent.handCard.length + opponent.pickCard.length, username: opponent.username}));
                io.to(player.socketid).emit("thirdGameTest", opponents, handCard);
            }
        }
    }

    socket.on("chooseCardWar", (idGame, card, username) => {
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        playerConcerned.playCard(card);
        console.log(`the player ${username} chose a ${card.value} of ${card.type}, he has ${(playerConcerned.handCard.length + playerConcerned.pickCard.length)} in total`);
        socket.broadcast.to(parseInt(idGame)).emit("refreshOponnentCardWar", username);
        socket.broadcast.to(parseInt(idGame)).emit("firstGameTest", username, card);
        if (game.allPlayed()) {
            const cardPerPlayer = game.fightingPlayers.map(player => ({ username: player.username, card: { value: player.cardPlayed.value, type: player.cardPlayed.type } }));
            io.to(parseInt(idGame)).emit("revealAllCard", cardPerPlayer, ["imagesTest", ".png"]);
            io.to(parseInt(idGame)).emit("secondGameTest");
            cardAnalyseWar(game);
        }
    });

    function prepareWar(idGame) {
        const game = getGameById(idGame);
        game.prepareRound();
        nextTurnWar(game);
    }

    function nextTurnWar(game) {
        for (let i = 0; i < game.playerAmount; i++) {
            const player = game.playerList[i];
            const handCard = player.handCard.map(card => ({ value: card.value, type: card.type }));
            io.to(player.socketid).emit("playerTurnWar", handCard, game.getOpponentsUsername(player.username), game.timer);
            const opponents = game.playerList.filter(p => p.username != player.username).map((opponent) => ({cardAmount: opponent.handCard.length + opponent.pickCard.length, username: opponent.username}));
            io.to(player.socketid).emit("thirdGameTest", opponents, handCard);
        }
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
        setTimeout(() => {
            if (game.isWarTime()) {
                game.isHidden = true;
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
                        const opponents = game.playerList.filter(p => p.username != player.username).map((opponent) => ({cardAmount: opponent.handCard.length + opponent.pickCard.length, username: opponent.username}));
                        io.to(player.socketid).emit("fourthGameTest", opponents, handCard);
                    }
                }
            } else {
                game.isHidden = false;
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
                                    io.to(game.playerList[i].socketid).emit("loseWar");
                                    game.eliminatePlayer(game.playerList[i]);
                                    i--;
                                    resolve(row);
                                    if (playerWinnerRound.hasWon()) {
                                        db.get(`SELECT * FROM StatWar WHERE username = '${playerWinnerRound.username}'`, (err, row) => {
                                            db.run(`UPDATE StatWar SET winAmount = ${(row.winAmount + 1)} WHERE username = '${playerWinnerRound.username}'`);
                                        });
                                        db.get("SELECT * FROM User WHERE username = ?", [playerWinnerRound.username], (err, row) => {
                                            db.run("UPDATE User SET money = ? WHERE username = ?", [row.money + 750, playerWinnerRound.username]);
                                        })
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
                    } else {
                        game.isLaunched = false;
                        io.to(playerWinnerRound.socketid).emit("winWar");
                    }
                });
            }
        }, 1000 * game.playerAmount);
    }

    //* Take6
    socket.on("chooseCardTake6", (idGame, card, username) => {
        const game = getGameById(idGame);
        const playerConcerned = game.getPlayerByUsername(username);
        card = playerConcerned.chooseCard(card);
        console.log(`the player ${username} choose the card ${card.value} which is ${card.pointAmount} points`);
        io.to(idGame).emit("opponentPlayedTake6", username);
        if (game.allPlayed()) {
            const cardPerPlayer = game.playerList.map(player => ({ username: player.username, card: { value: player.cardPlayed.value } }));
            socket.emit("revealAllCard", cardPerPlayer, ["images2", ".svg"]);
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
                const keys = Object.keys(game.cardBoard);
                const cards = [];
                keys.forEach(key => {
                    cards.push(game.cardBoard[key].map(card => ({ value: card.value })));
                });
                io.to(player.socketid).emit("playerTurnTake6", handCard, game.getOpponentsUsername(player.username), cards, player.totalPoint, game.timer);
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
                    let [lineUpdated, lineNumber] = game.placeCard(player, player.cardPlayed);
                    lineUpdated = lineUpdated.map(card => ({ value: card.value }));
                    io.to(parseInt(game.idGame)).emit("refreshCardBoardTake6", lineUpdated, lineNumber);
                    io.to(game.idGame).emit("resetCardPlayedTake6", player.username);
                    io.to(game.idGame).emit("refreshPlayerPointTake6", player.totalPoint, player.username);
                    return launchCardAnalyseTake6(playerList.filter(p => p.username != player.username), game);
                }
            }, 1000);
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
                    db.get("SELECT * FROM User WHERE username = ?", [game.playerList[i].username], (err, rowUser) => {
                        db.run(`UPDATE User SET money = ${(rowUser.money + 750)} WHERE username = '${game.playerList[i].username}'`);
                    });
                    console.log(`the player ${game.playerList[i].username} has won`);
                } else {
                    db.run(`UPDATE StatTake6 SET loseAmount = ${(row.loseAmount + 1)}, best = ${row.best}, average = ${row.average} WHERE username = '${game.playerList[i].username}'`);
                    console.log(`the player ${game.playerList[i].username} has lost`);
                }
            });
        }
        io.to(game.idGame).emit("endTake6", winners.map(winner => winner.username));
        game.isLaunched = false;
    }

    //Page statistique
    socket.on("askStats", username => {
        let promises = [];
        let stats = {};
        let promise = new Promise((resolve, reject) => {
            db.get(`SELECT * FROM StatWar WHERE username = '${username}'`, (err, rowWar) => {
                stats["War"] = { winAmount: rowWar.winAmount, loseAmount: rowWar.loseAmount, tieAmount: rowWar.tieAmount };
                db.get(`SELECT * FROM StatTake6 WHERE username = '${username}'`, (err, rowTake6) => {
                    stats["Take6"] = { winAmount: rowTake6.winAmount, loseAmount: rowTake6.loseAmount, best: rowTake6.best, average: rowTake6.average };
                    db.get(`SELECT * FROM StatCrazy8 WHERE username = '${username}'`, (err, rowCrazy8) => {
                        stats["Crazy8"] = { winAmount: rowCrazy8.winAmount, loseAmount: rowCrazy8.loseAmount };
                        resolve("yes");
                    });
                });
            });
        });
        promises.push(promise);
        Promise.all(promises).then(() => {
            socket.emit("sendStats", stats);
        });
    });
    //Page reprendrePartie

    socket.on("askPausedGames", username => {
        const games = gameList.filter(game => {
            if (game.getPlayerByUsername(username)) return true;
            return false;
        });
        let gamesInformations = [];
        for (let i = 0; i < games.length; i++) {
            const stringType = getStringOfGame(games[i]);
            gamesInformations.push({ id: games[i].idGame, playerAmount: games[i].playerAmount, type: stringType });
        }
        socket.emit("sendPausedGames", gamesInformations);
    });

    socket.on("joinPausedGame", (idGame, username) => {
        const game = getGameById(idGame);
        const player = game.getPlayerByUsername(username);
        player.socketid = socket.id; //* Le joueur s'est peut-être connécté avec un autre socketid que celui précédent.
        socket.leave('lobby');
        rooms['lobby'].filter(socketid => socketid != socket.id);
        if (!rooms[idGame]) rooms[idGame] = [];
        rooms[idGame].push(socket.id);
        socket.join(parseInt(idGame));
        socket.broadcast.to(parseInt(idGame)).emit("messageReceived", `The player ${username} joined the game`, "SERVER", "green")
    });

    //! Function Part
    function affectPlayer(idGame, username, isPlayerCreator) { // Fonction générale
        socket.leave('lobby');
        socket.join(idGame);
        rooms[idGame].push(socket.id);
        rooms["lobby"] = rooms["lobby"].filter(socketid => socketid != socket.id);
        const game = getGameById(idGame);
        let newPlayer = null;
        if (game instanceof Take6Game) newPlayer = new Take6Player(username, game, socket.id);
        else if (game instanceof WarGame) newPlayer = new WarPlayer(username, game, socket.id);
        else if (game instanceof Crazy8Game) newPlayer = new Crazy8Player(username, game, socket.id);
        if (isPlayerCreator) {
            newPlayer.isCreator = true;
            io.to(newPlayer.socketid).emit("teleportCreator", idGame);
        } else {
            io.to(newPlayer.socketid).emit("teleportPlayer", idGame);
        }
        socket.broadcast.to(idGame).emit("messageReceived", `${username} has joined the game`, "SERVER", "green");
        game.addPlayer(newPlayer);
        loadGames();
        console.log(`user ${username} is now a player of ${idGame}`);
    }

    function getGameById(idGame) {
        return gameList.filter(g => g.idGame == idGame)[0];
    }

    function getStringOfGame(game) {
        if (game instanceof WarGame) return "jeu-de-bataille";
        else if (game instanceof Take6Game) return "6-qui-prend";
        else if (game instanceof Crazy8Game) return "crazy8";
    }


});