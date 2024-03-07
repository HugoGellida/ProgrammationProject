import { useState, useEffect } from "react";
import { socket } from "./../../socket";

export default function Take6Opponent({information}){
    const [info, setInfo] = useState({
        username: information.username,
        pointAmount: information.pointAmount,
        played: false
    });
    
    function revealCard(card){
        document.getElementById("card").style.backgroundImage = `url('./images2/${card.value}')`;
    }

    useEffect(() => {
        if (!info.played){
            console.log("test");
            socket.emit("testing");
        } else {
            console.log("test2");
            socket.emit("testing2");
        }
        
        socket.on("opponentPlayedTake6", username => {
            console.log("e");
            if (info.username == username) setInfo({
                ...info,
                played: true
            });
        });

        socket.on("resetCardPlayedTake6", username => {
            console.log("ee");
            if (info.username == username) setInfo({
                ...info,
                played: false
            });
        });

        return () => {
            console.log("end");
            socket.off("refreshOpponentTake6", info.username);
            socket.off("resetCardPlayedTake6", info.username);
        }
    });

    return (
        <>
            <div className="opponentTake6" id={info.username}>
                {info.played && (
                    <div style={{backgroundImage: `url('./images2/boeuf.png)`}} id="card"></div>
                )}
                <div>{`${info.username}\n${info.pointAmount}`}</div>
            </div>
        </>
    );
}