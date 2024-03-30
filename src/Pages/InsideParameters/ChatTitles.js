import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./ChatTitles.css";

export default function ChatTitles() {
    const [unlockedTitles, setUnlockedTitles] = useState([]);
    const [lockedTitles, setLockedTitles] = useState([]);
    const [target, setTarget] = useState(-1);

    useEffect(() => {
        const sendChatTitles = (locked, unlocked) => {
            setLockedTitles(locked);
            setUnlockedTitles(unlocked);
        }

        socket.on("sendChatTitles", sendChatTitles);
        socket.emit("askChatTitles", sessionStorage.getItem("pseudo"));
        return () => {
            socket.off("sendChatTitles", sendChatTitles);
        }
    }, []);

    const clickTitle = (event) => {
        socket.emit("chooseChatTitle", sessionStorage.getItem("pseudo"), event.target.innerText);
        alert(`You chose the title ${event.target.innerText}`);
    }

    return (
        <div style={{backgroundImage: "url('./Backgrounds/ParametersBackground.jpg')"}}>
            <div className="unlockedTitles">
                <h10 className="unlockedTitlesTitle" style={{color: 'white'}}>Unlocked Titles: </h10>
                {unlockedTitles.map(title => (
                    <button className="unlockedTitle" onClick={clickTitle}>{title}</button>
                ))}
            </div>
            <div className="titleInfo">
                {target !== -1 && (
                    <>
                        <text style={{color: 'white'}}>Name: {lockedTitles[target].name}</text>
                        <text style={{color: 'white'}}>Difficulty: {lockedTitles[target].difficulty}</text>
                        <text style={{color: 'white'}}>Description: {lockedTitles[target].description}</text>
                    </>
                )}
            </div>
            <div className="lockedTitles">
                <h10 className="lockedTitlesTitle" style={{color: 'white'}}>Locked Titles: </h10>
                {lockedTitles.map((achievement, index) => (
                    <div className="lockedTitle" style={{ color: "white" }} onMouseEnter={() => {setTarget(index)}} onMouseLeave={() => {setTarget(-1)}}>
                        <text>{achievement.title}</text>
                    </div>
                ))}
            </div>
        </div>
    )
}