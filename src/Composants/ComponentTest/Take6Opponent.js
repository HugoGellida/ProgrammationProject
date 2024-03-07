import React from "react";
import { useState, useEffect } from "react";


export default function Take6Opponent({information}){
    const [info, setInfo] = useState({
        username: information.username,
        pointAmount: information.pointAmount,
        played: false
    });

    useEffect(() => {
        socket.on("refreshOpponentTake6", username => {
            if (info.username == username) played = true;
        });

        function insertCard(){
            const div = document.createElement("div");
            div.style.backgroundImage = `url('./images/Verso-Cartes.png)`;
            document.getElementById(info.username).insertBefore(div, document.getElementById(info.username).firstChild);
        }

        function resetCard(){
            
        }

        return () => {
            socket.off("refreshOpponentTake6", info.username);
        }
    });

    return (
        <>
            <div className="opponentTake6" id={info.username}>
                <div>{`${info.username}\n${info.pointAmount}`}</div>
            </div>
            {!info.played && resetCard()}
            {info.played && insertCard()}
        </>
    );
}