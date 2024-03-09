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

    const [stats, setStats] = useState({});
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const sendChatColors = (locked, unlocked) => {
            setLockedColors(locked);
            setUnlockedColors(unlocked);
            resetShow();
            setShowColors(true);
        }
        const sendChatTitles = (locked, unlocked) => {
            setLockedTitles(locked);
            setUnlockedTitles(unlocked);
            resetShow();
            setShowTitles(true);
        }
        const sendStats = (stats) => {
            console.log(stats)
            setStats(stats);
            resetShow();
            setShowStats(true);
        }
        socket.on("sendChatColors", sendChatColors);
        socket.on("sendChatTitles", sendChatTitles);
        socket.on("sendStats", sendStats);

        return () => {
            socket.off("sendChatColors", sendChatColors);
            socket.off("sendChatTitles", sendChatTitles);
            socket.off("sendStats", sendStats);
        }
    });

    function resetShow(){
        setShowColors(false);
        setShowStats(false);
        setShowTitles(false);
    }

    function handleClickColors(){
        socket.emit("askChatColors", sessionStorage.getItem("pseudo"));
    }

    function handleClickTitles(){
        socket.emit("askChatTitles", sessionStorage.getItem("pseudo"));
    }

    function handleClickStats(){
        socket.emit("askStats", sessionStorage.getItem("pseudo"));
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
            {Boutton("Statistics", handleClickStats)}
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
            {showStats && (
                <>
                    <div className="statistics">
                        {Object.keys(stats).map((statCategory) => (
                            <div className={statCategory} style={{color: "white"}}>{statCategory}<br></br><br></br>
                                {Object.keys(stats[statCategory]).map((statName) => (
                                    <>
                                        <text style={{color: "white"}}>{statName}: {stats[statCategory][statName]}</text>
                                        <br></br>
                                    </>
                                ))}
                                <br></br>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}