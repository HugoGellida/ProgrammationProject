import { useState, useEffect } from "react";
import { socket } from "../socket";
import './Statistics.css';
import { useTranslation } from "react-i18next";


export default function Statistics() {

    const [stats, setStats] = useState({});
    const [targetStat, setTargetStat] = useState();

    const { t } = useTranslation();

    useEffect(() => {
        const sendStats = (stats) => {
            setStats(stats);
            const keys = Object.keys(stats);
            setTargetStat(stats[keys[0]]);
        }
        socket.on("sendStats", sendStats);
        socket.emit("askStats", sessionStorage.getItem('pseudo'));
        return () => {
            socket.off("sendStats", sendStats);
        }
    }, []);

    const handleStatClick = (event) => {
        setTargetStat(stats[event.target.id]);
    }

    return (
        <>
            <div className="StatisticFilter">
                {Object.keys(stats).map((statCategory) => (
                    <button id={statCategory} className="StatisticChoice" style={{ backgroundColor: targetStat == stats[statCategory] ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>{t(`Parameters.Statistics.Games.${statCategory}`)}</button>
                ))}
            </div>
            {targetStat && (
                <div className="Statistic">
                    {Object.keys(targetStat).map((key) => (
                        <label className="simpleText" style={{marginBottom: 'auto', marginTop: 'auto'}}>{t(`Parameters.Statistics.${key}`)} {targetStat[key]}</label>
                    ))}
                </div>
            )}
        </>
    )
}