import { useState, useEffect } from "react";
import { socket } from "../socket";
import "./Global.css";
import { useTranslation } from "react-i18next";

export default function Global() {
    const [global, setGlobal] = useState([]);
    const [targetStat, setTargetStat] = useState('');
    const [globalShownMax, setGlobalShownMax] = useState();
    const [globalShownMin, setGlobalShownMin] = useState();
    const [max, setMax] = useState();

    const { t } = useTranslation();

    useEffect(() => {
        socket.emit('askGlobalStats');
    }, []);

    useEffect(() => {

        const sendGlobalStats = (info) => {
            setGlobal(info.sort((a, b) => b.all - a.all));
            setTargetStat('All');
            setMax(info.length);
            setGlobalShownMax(Math.min(info.length, 10));
            setGlobalShownMin(0);
        }

        socket.on('sendGlobalStats', sendGlobalStats)
        return () => {
            socket.off('sendGlobalStats');
        }
    });

    const handleStatClick = (event) => {
        setTargetStat(event.target.id);
        setGlobal(global.sort((a, b) => b[event.target.id.toLowerCase()] - a[event.target.id.toLowerCase()]));
    }

    const nextPage = () => {
        setGlobalShownMax(Math.min(max, globalShownMax + 10));
        setGlobalShownMin(globalShownMin + 10);
    }

    const previousPage = () => {
        setGlobalShownMax(globalShownMin);
        setGlobalShownMin(globalShownMin - 10);
    }

    return (
        <>
            <div className="StatisticFilter">
                <button id='All' className="StatisticChoice" style={{ backgroundColor: targetStat === 'All' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>{t('Parameters.Global.Choices.All')}</button>
                <button id='War' className="StatisticChoice" style={{ backgroundColor: targetStat === 'War' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>{t('Parameters.Global.Choices.War')}</button>
                <button id='Take6' className="StatisticChoice" style={{ backgroundColor: targetStat === 'Take6' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>{t('Parameters.Global.Choices.Take6')}</button>
                <button id='Crazy8' className="StatisticChoice" style={{ backgroundColor: targetStat === 'Crazy8' ? "rgb(60, 60, 60)" : "" }} onClick={handleStatClick}>{t('Parameters.Global.Choices.Crazy8')}</button>
            </div>
            {targetStat && (
                <div className="leaderBoard">
                    <div className="leaderBoardCategory">
                        <div className="leaderBoardCategoryTitle">{t('Parameters.Global.GlobalPlacement')}</div>
                        {global.map((player, index) => {
                            if (index < globalShownMax && index >= globalShownMin) {
                                if (targetStat === 'All') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>#{index + 1}</label>);
                                else if (targetStat === 'War') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>#{index + 1}</label>);
                                else if (targetStat === 'Take6') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>#{index + 1}</label>);
                                else return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>#{index + 1}</label>);
                            } else return (<></>);
                        })}
                    </div>
                    <div className="leaderBoardCategory">
                        <div className="leaderBoardCategoryTitle">{t('Parameters.Global.Username')}</div>
                        {global.map((player, index) => {
                            if (index < globalShownMax && index >= globalShownMin) {
                                if (targetStat === 'All') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.username === sessionStorage.getItem('pseudo') ? t('Parameters.Global.Self') : player.username}</label>);
                                else if (targetStat === 'War') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.username === sessionStorage.getItem('pseudo') ? t('Parameters.Global.Self') : player.username}</label>);
                                else if (targetStat === 'Take6') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.username === sessionStorage.getItem('pseudo') ? t('Parameters.Global.Self') : player.username}</label>);
                                else return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.username === sessionStorage.getItem('pseudo') ? t('Parameters.Global.Self') : player.username}</label>);
                            } else return (<></>);
                        })}
                    </div>
                    <div className="leaderBoardCategory">
                        <div className="leaderBoardCategoryTitle">{t('Parameters.Global.GlobalPoints')}</div>
                        {global.map((player, index) => {
                            if (index < globalShownMax && index >= globalShownMin) {
                                if (targetStat === 'All') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.all}</label>);
                                else if (targetStat === 'War') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.war}</label>);
                                else if (targetStat === 'Take6') return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.take6}</label>);
                                else return (<label className="simpleText" style={{ color: player.username === sessionStorage.getItem('pseudo') ? 'blueviolet' : index === 0? 'gold': index === 1? 'silver': index === 2? 'rgb(205, 127, 50)': 'white'}}>{player.crazy8}</label>);
                            } else return (<></>);
                        })}
                    </div>

                    {globalShownMax !== max && (
                        <button className="pageSwitcher" style={{ bottom: '0%', right: '0%' }} onClick={nextPage}>{t(`Parameters.Global.Next`)}</button>
                    )}
                    {globalShownMin !== 0 && (
                        <button className="pageSwitcher" style={{ bottom: '0%', left: '0%' }} onClick={previousPage}>{t(`Parameters.Global.Previous`)}</button>
                    )}
                    <div className="leaderBoardPlacement">{global.map((player, index) => {
                        if (player.username === sessionStorage.getItem('pseudo')) {
                            return `${t(`Parameters.Global.Placement`)} #${index + 1}`;
                        } else return (<></>);
                    })}</div>
                </div>
            )}
        </>
    )
}