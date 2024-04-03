import { useState, useEffect } from "react";
import { socket } from "../socket";


export default function Global() {
    const [global, setGlobal] = useState([]);
    const [targetStat, setTargetStat] = useState('');

    useEffect(() => {
        socket.emit('askGlobalStats');
    }, []);

    useEffect(() => {

        const sendGlobalStats = (info) => {
            setGlobal(info.sort((a, b) => b.all - a.all));
            setTargetStat('All');
        }

        socket.on('sendGlobalStats', sendGlobalStats)
        return () => {
            socket.off('sendGlobalStats')
        }
    });

    const handleStatClick = (event) => {
        setTargetStat(event.target.innerText);
        setGlobal(global.sort((a, b) => b[event.target.innerText.toLowerCase()] - a[event.target.innerText.toLowerCase()]));
    }

    return (
        <>
            <div className="StatisticFilter">
                <button className="StatisticChoice" style={{ backgroundColor: targetStat == 'All' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>All</button>
                <button className="StatisticChoice" style={{ backgroundColor: targetStat == 'War' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>War</button>
                <button className="StatisticChoice" style={{ backgroundColor: targetStat == 'Take6' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>Take6</button>
                <button className="StatisticChoice" style={{ backgroundColor: targetStat == 'Crazy8' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>Crazy8</button>
            </div>
            {targetStat && (
                <>
                    {global.map((player) => {
                        if (targetStat == 'All') return (<text className="StatisticInfo" style={{ color: "white" }}>{player.username}: {player.all}</text>);
                        else if (targetStat == 'War') return (<text className="StatisticInfo" style={{ color: "white" }}>{player.username}: {player.war}</text>);
                        else if (targetStat == 'Take6') return (<text className="StatisticInfo" style={{ color: "white" }}>{player.username}: {player.take6}</text>);
                        else return (<text className="StatisticInfo" style={{ color: "white" }}>{player.username}: {player.crazy8}</text>);
                    })}
                </>
            )}
        </>
    )
}