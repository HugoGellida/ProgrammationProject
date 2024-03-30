import { useState, useEffect } from "react";
import { socket } from "../socket";
import './Statistics.css';


export default function Statistics() {

    const [stats, setStats] = useState({});
    const [targetStat, setTargetStat] = useState();

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
        setTargetStat(stats[event.target.innerText]);
    }

    return (
        <>
            <div className="StatisticFilter">
                {Object.keys(stats).map((statCategory) => (
                    <button className="StatisticChoice" style={{backgroundColor: targetStat == stats[statCategory]? "rgb(60, 60, 60)": ""}} onClick={handleStatClick}>{statCategory}</button>
                ))}
            </div>
            {targetStat && (
                <div className="Statistic">
                    {Object.keys(targetStat).map((key) => (
                        <text className="StatisticInfo" style={{ color: "white" }}>{key.toUpperCase()}: {targetStat[key]}</text>
                    ))}
                </div>
            )}
        </>
    )
}