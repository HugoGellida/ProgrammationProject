import { useEffect, useState } from "react";
import { socket } from "../socket";
import './ChatColors.css';
import { useTranslation } from "react-i18next";
import Alert from "../../Composants/Alert";

export default function ChatColors() {
    const [unlockedColors, setUnlockedColors] = useState([]);
    const [lockedColors, setLockedColors] = useState([]);
    const [target, setTarget] = useState(-1);
    const [unlockedTarget, setUnlockedTarget] = useState(-1);
    const [showAlert, setShowAlert] = useState(false);
    const [clickedColor, setClickedColor] = useState();

    const { t } = useTranslation();

    useEffect(() => {
        const sendChatColors = (locked, unlocked) => {
            setLockedColors(locked);
            setUnlockedColors(unlocked);
        }

        socket.on("sendChatColors", sendChatColors);
        socket.emit("askChatColors", sessionStorage.getItem('pseudo'));
        return () => {
            socket.off("sendChatColors", sendChatColors);
        }
    }, []);

    const clickColor = (event) => {
        socket.emit("chooseChatColor", sessionStorage.getItem("pseudo"), event.target.id);
        setShowAlert(true);
        setClickedColor(event.target.innerText);
    }

    return (
        <>
            <div className="unlockedColors">
                <h10 className="unlockedColorsTitle" style={{ color: 'white' }}>{t('Parameters.ChatColors.Unlocked')}</h10>
                {unlockedColors.map((color, index) => (
                    <button className="unlockedColor" id={color} style={{ backgroundColor: unlockedTarget == index ? color : "black", border: `2px inset ${color}`, transition: '0.5s', color: unlockedTarget == index ? "black" : "white" }} onClick={clickColor} onMouseEnter={() => { setUnlockedTarget(index) }} onMouseLeave={() => { setUnlockedTarget(-1) }}>{t(`Parameters.Colors.${color}.Price`)}</button>
                ))}
            </div>
            {target !== -1 && (
                <div className="colorInfo" style={{border: `2px inset ${lockedColors[target].color}`}}>
                    <text style={{ color: 'white' }}>{t(`Parameters.Colors.${lockedColors[target].color.replace(/\s/g, "")}.Name`)}</text>
                    <text style={{ color: 'white' }}>{t(`Parameters.Colors.${lockedColors[target].color.replace(/\s/g, "")}.Difficulty`)}</text>
                    <text style={{ color: 'white' }}>{t(`Parameters.Colors.${lockedColors[target].color.replace(/\s/g, "")}.Description`)}</text>
                </div>
            )}

            <div className="lockedColors">
                <h10 className="lockedColorsTitle" style={{ color: 'white' }}>{t('Parameters.ChatColors.Locked')}</h10>
                {lockedColors.map((achievement, index) => (
                    <div className="lockedColor" style={{ backgroundColor: target == index ? achievement.color : "black", border: `2px inset ${achievement.color}`, transition: '0.5s', color: target == index ? "black" : "white" }} onMouseEnter={() => { setTarget(index) }} onMouseLeave={() => { setTarget(-1) }}>
                        {t(`Parameters.Colors.${achievement.color}.Price`)}
                    </div>
                ))}
            </div>
            {showAlert && (
                <Alert message={t('Parameters.ChatColors.Equip', { color: clickedColor })} buttonMessage={t('Connection.FailedAttemptButton')} onClick={() => { setShowAlert(false) }} />
            )}
        </>
    );
}