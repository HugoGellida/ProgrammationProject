import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./ChatTitles.css";
import { useTranslation } from "react-i18next";

export default function ChatTitles() {
    const [unlockedTitles, setUnlockedTitles] = useState([]);
    const [lockedTitles, setLockedTitles] = useState([]);
    const [target, setTarget] = useState(-1);

    const { t } = useTranslation();

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
        alert(t('Parameters.ChatTitles.Equip', {title: event.target.innerText}));
    }

    return (
        <div style={{backgroundImage: "url('./Backgrounds/ParametersBackground.jpg')"}}>
            <div className="unlockedTitles">
                <h10 className="unlockedTitlesTitle" style={{color: 'white'}}>{t('Parameters.ChatTitles.Unlocked')}</h10>
                {unlockedTitles.map(title => (
                    <button className="unlockedTitle" onClick={clickTitle}>{t(`Parameters.Titles.${title.replace(/\s/g, "")}.Price`)}</button>
                ))}
            </div>
            <div className="titleInfo">
                {target !== -1 && (
                    <>
                        <text style={{color: 'white'}}>{t(`Parameters.Titles.${lockedTitles[target].title.replace(/\s/g, "")}.Name`)}</text>
                        <text style={{color: 'white'}}>{t(`Parameters.Titles.${lockedTitles[target].title.replace(/\s/g, "")}.Difficulty`)}</text>
                        <text style={{color: 'white'}}>{t(`Parameters.Titles.${lockedTitles[target].title.replace(/\s/g, "")}.Description`)}</text>
                    </>
                )}
            </div>
            <div className="lockedTitles">
                <h10 className="lockedTitlesTitle" style={{color: 'white'}}>{t('Parameters.ChatTitles.Locked')}</h10>
                {lockedTitles.map((achievement, index) => (
                    <div className="lockedTitle" style={{ color: "white" }} onMouseEnter={() => {setTarget(index)}} onMouseLeave={() => {setTarget(-1)}}>
                        <text>{t(`Parameters.Titles.${achievement.title.replace(/\s/g, "")}.Price`)}</text>
                    </div>
                ))}
            </div>
        </div>
    )
}