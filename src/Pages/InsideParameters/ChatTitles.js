import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./ChatTitles.css";
import { useTranslation } from "react-i18next";
import Alert from "../../Composants/Alert";

export default function ChatTitles() {
    const [unlockedTitles, setUnlockedTitles] = useState([]);
    const [lockedTitles, setLockedTitles] = useState([]);
    const [target, setTarget] = useState(-1);
    const [showAlert, setShowAlert] = useState(false);
    const [clickedTitle, setClickedTitle] = useState();

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
        setShowAlert(true);
        setClickedTitle(event.target.innerText);
    }

    return (
        <>
            <div className="unlockedTitles">
                <h10 className="unlockedTitlesTitle" style={{ color: 'white' }}>{t('Parameters.ChatTitles.Unlocked')}</h10>
                {unlockedTitles.map(title => (
                    <button className="unlockedTitle" onClick={clickTitle}>{t(`Parameters.Titles.${title.replace(/\s/g, "")}.Price`)}</button>
                ))}
            </div>
            {target !== -1 && (
                <div className="titleInfo">
                    <text style={{ color: 'white' }}>{t(`Parameters.Titles.${lockedTitles[target].title.replace(/\s/g, "")}.Name`)}</text>
                    <text style={{ color: 'white' }}>{t(`Parameters.Titles.${lockedTitles[target].title.replace(/\s/g, "")}.Difficulty`)}</text>
                    <text style={{ color: 'white' }}>{t(`Parameters.Titles.${lockedTitles[target].title.replace(/\s/g, "")}.Description`)}</text>
                </div>
            )}
            <div className="lockedTitles">
                <h10 className="lockedTitlesTitle" style={{ color: 'white' }}>{t('Parameters.ChatTitles.Locked')}</h10>
                {lockedTitles.map((achievement, index) => (
                    <div className="lockedTitle" onMouseEnter={() => { setTarget(index) }} onMouseLeave={() => { setTarget(-1) }}>
                        <label>{t(`Parameters.Titles.${achievement.title.replace(/\s/g, "")}.Price`)}</label>
                    </div>
                ))}
            </div>
            {showAlert && (
                <Alert message={t('Parameters.ChatTitles.Equip', { title: clickedTitle })} buttonMessage={t('Connection.FailedAttemptButton')} onClick={() => { setShowAlert(false) }} />
            )}
        </>
    )
}