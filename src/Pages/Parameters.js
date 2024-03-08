import React, { useEffect, useState } from "react";
import Boutton from "../Composants/Boutton";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";

export default function Parameters(){

    const navigate = useNavigate();

    const [unlockedColors, setUnlockedColors] = useState([]);
    const [lockedColors, setLockedColors] = useState([]);
    const [showColors, setShowColors] = useState(false);

    const [unlockedTitles, setUnlockedTitles] = useState([]);
    const [lockedTitles, setLockedTitles] = useState([]);
    const [showTitles, setShowTitles] = useState(false);

    useEffect(() => {
        const f1 = (locked, unlocked) => {
            setLockedColors(locked);
            setUnlockedColors(unlocked);
            setShowTitles(false);
            setShowColors(true);
        }
        const f2 = (locked, unlocked) => {
            setLockedTitles(locked);
            setUnlockedTitles(unlocked);
            setShowColors(false);
            setShowTitles(true);
        }
        socket.on("sendChatColors", f1);
        socket.on("sendChatTitles", f2);

        return () => {
            socket.off("sendChatColors", f1);
            socket.off("sendChatTitles", f2);
        }
    });

    function handleClickColors(){
        socket.emit("askChatColors", sessionStorage.getItem("pseudo"));
    }

    function handleClickTitles(){
        socket.emit("askChatTitles", sessionStorage.getItem("pseudo"));
    }

    const clickColor = (event) => {
        console.log(event.target.innerText);
        socket.emit("chooseChatColor", sessionStorage.getItem("pseudo"), event.target.innerText);
        alert(`You chose the color ${event.target.innerText}`);
    }

    const clickTitle = (event) => {
        console.log(event.target.innerText);
        socket.emit("chooseChatTitle", sessionStorage.getItem("pseudo"), event.target.innerText);
        alert(`You chose the title ${event.target.innerText}`);
    }

    function leave(){
        navigate("/PageChoix");
    }


    return (
        <>
            {Boutton("Chat colors", handleClickColors)}
            {Boutton("Title chat", handleClickTitles)}
            {Boutton("Leave", leave)}
            {showColors && (
                <>
                <div className="unlockedColors">
                    {unlockedColors.map(color => (
                        <button style={{backgroundColor: color}} onClick={clickColor}>{color}</button>
                    ))}
                </div>
                <div className="lockedColors">
                    {lockedColors.map((achievement) => (
                        <div className="lockedColor" style={{backgroundColor: achievement.color}}>
                            <text>{`${achievement.name}(${achievement.description})\nDifficulty: ${achievement.difficulty}`}</text>
                        </div>
                    ))}
                </div>
            </>
            )}
            {showTitles && (
                <>
                    <div className="unlockedTitles">
                        {unlockedTitles.map(title => (
                            <button onClick={clickTitle}>{title}</button>
                        ))}
                    </div>
                    <div className="lockedTitles">
                        {lockedTitles.map((achievement) => (
                            <div className="lockedTitle" style={{backgroundColor: "white"}}>
                                <text>{`[${achievement.title}] ${achievement.name}(${achievement.description})\nDifficulty: ${achievement.difficulty}`}</text>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}