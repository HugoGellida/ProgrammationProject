import { useState, useEffect } from "react";
import Take6Opponent from "./Take6Opponent";
import { socket } from "../../socket";

export default function Take6Game({opponents, handCard, timer, idGame, username, cardBoard}){
    const [info, setInfo] = useState({
        username: username,
        idGame: idGame,
        launchTimer: false,
        opponents: opponents,
        timer: timer,
        handCard: handCard,
        cardBoard: cardBoard,
        launchClickTime: false
    });
    const [seconds, setSeconds] = useState(timer);

    useEffect(() => {
        let interval;
        if (info.launchTimer){
            interval = setInterval(() => {
                setSeconds(seconds - 1);
                console.log(seconds);
            }, 1000);

            if (seconds == 0){
                launchTimer = false;
            }
        }
        socket.on("playerTurnTake6", (handCard) => {
            setInfo({
                ...info,
                handCard: handCard,
                launchTimer: true
            });
        });

        function clickCard(id){
            console.log(id);
            [type, value] = id.split("-");
            
        }

        return () => {
            clearInterval(interval);
            socket.off("playerTurnTake6", timer, playableCards, handCard);
        }
    });

    return (
        <>
            <div id="opponents">
                {info.opponents.map(opponent => (
                    <Take6Opponent information={opponent}></Take6Opponent>
                ))}
            </div>
            {!info.launchClickTime && info.handCard.map(card => (
                <div id={`${card.type}-${card.value}`} style={`url('./images/${card.type}-${card.value}.png')`}></div>
            ))}
            {info.launchClickTime && info.handCard.map(card => {
                document.getElementById(`${card.type}-${card.value}`).addEventListener("click", () => {
                    info.launchClickTime = false;
                    console.log(card.type, card.value);
                    socket.emit("chooseCardTake6", (idGame, {type: card.type, value: card.value}, username));
                });
            })}

        </>
    );
}