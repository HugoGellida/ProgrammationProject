import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import BackgroundAmbiance from "../BackgroundAmbiance";
import { useTranslation } from "react-i18next";


export default function Prendqui6({ opponentInfos, cards, time, infosSup, cardPlayed }) {
    const [opponents, setOpponents] = useState(opponentInfos);
    const [handCard, setHandCard] = useState(cards);
    const [playedCard, setPlayedCard] = useState(cardPlayed);
    const [hasPlayedCard, setHasPlayedCard] = useState(cardPlayed !== undefined && cardPlayed !== null);
    const [showCard, setShowCard] = useState(false);
    const [targetCard, setTargetCard] = useState(-1);
    const [mustClick, setMustClick] = useState(cardPlayed === undefined || cardPlayed === null);
    const timer = time;
    const [currentTimer, setCurrentTimer] = useState(time);
    const [launchTimer, setLaunchTimer] = useState(cardPlayed === undefined || cardPlayed === null);
    const [cardBoard, setCardBoard] = useState(infosSup);
    const [showEnd, setShowEnd] = useState(false);
    const [messageEnd, setMessageEnd] = useState('');
    const [endBackgroundAmbiance, setEndBackgroundAmbiance] = useState(false);
    const [playWinMusic, setPlayWinMusic] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const selectCard = (cardChosen) => {
        if (mustClick) {
            setHandCard(handCard.filter(card => card.value !== cardChosen.value || card.type !== cardChosen.type));
            socket.emit('chooseCardTake6', sessionStorage.getItem('idPartie'), cardChosen, sessionStorage.getItem('pseudo'));
            setPlayedCard(cardChosen);
            setHasPlayedCard(true);
            setLaunchTimer(false);
            setCurrentTimer(timer);
            setMustClick(false);
            setTargetCard(-1);
        }
    }

    useEffect(() => {
        let intervalIDTimer;
        if (launchTimer) {
            intervalIDTimer = setInterval(() => {
                setCurrentTimer(currentTimer - 1);
            }, 1000);
            if (mustClick && currentTimer === 0) {
                let i = Math.floor(Math.random() * handCard.length);
                selectCard(handCard[i]);
            }
        }
        return () => {
            clearInterval(intervalIDTimer);
        }
    }, [currentTimer, launchTimer]);


    useEffect(() => {
        const firstGameTest = (username, card) => {
            const otherOpponents = opponents.filter(player => player.username !== username);
            const opponentTarget = opponents.filter(player => player.username === username)[0];
            opponentTarget.card = card;
            setOpponents([...otherOpponents, opponentTarget]);
        }

        const secondGameTest = () => {
            setShowCard(true);
        }

        const thirdGameTest = (opponents, cardBoard, username) => {
            if (username === sessionStorage.getItem('pseudo')) {
                setHasPlayedCard(false);
                setPlayedCard();
            } else {
                setOpponents(opponents);
            }
            setCardBoard(cardBoard);
        }

        const fourthGameTest = (handCard, cardBoard) => {
            setMustClick(true);
            setLaunchTimer(true);
            setHandCard(handCard);
            setShowCard(false);
            setCardBoard(cardBoard);
        }

        const endTake6 = (winners) => {
            setEndBackgroundAmbiance(true);
            if (winners.includes(sessionStorage.getItem('pseudo'))) {
                setMessageEnd(t("6quiprend.Win"));
                setPlayWinMusic(true);
            } else {
                if (winners.length === 1) {
                    setMessageEnd(t('6quiprend.Lose_one', {username: winners[0]}));
                } else {
                    setMessageEnd(t('6quiprend.Lose_other', {usernames: winners}));
                }
            }
            setShowEnd(true);
            setHandCard([]);
        }


        socket.on('firstGameTest', firstGameTest);
        socket.on('secondGameTest', secondGameTest);
        socket.on('thirdGameTest', thirdGameTest);
        socket.on('fourthGameTest', fourthGameTest);
        socket.on('endTake6', endTake6);
        return () => {
            socket.off('firstGameTest', firstGameTest);
            socket.off('secondGameTest', secondGameTest);
            socket.off('thirdGameTest', thirdGameTest);
            socket.off('fourthGameTest', fourthGameTest);
            socket.off('endTake6', endTake6);
        }
    });

    const changeTarget = (index) => {
        setTargetCard(index);
    }

    const handleEndClick = () => {
        return navigate('/PageChoix');
    }

    const cardStyle = {
        height: '150px',
        width: '100px',
        backgroundSize: 'cover',
        boxShadow: '0px, 0px, 10px, rgba(0, 0, 0, 0.75)',
        position: 'absolute',
        border: '1px inset rgb(90, 15, 15)'
    }

    const rotation = (index) => {
        const angle = (Math.PI / handCard.length) * index;
        const x = Math.cos((Math.PI / 2) - angle) * 100;
        const y = Math.sin((Math.PI / 2) - angle) * 100;
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    return (
        <>
            <div className="timer" style={{
                backgroundColor: currentTimer % 2 === 0 && launchTimer ? 'rgb(90, 15, 15)' : '',
                color: `rgb(255, ${255 - ((timer - currentTimer) / timer) * 255}, ${255 - ((timer - currentTimer) / timer) * 255})`
            }}>{currentTimer}</div>
            <div className="opponentContainer">
                {opponents.map((opponent, index) => (
                    <div className="opponent" id={opponent.username}>
                        {opponent.card && (
                            <div className="card" style={{ backgroundImage: showCard ? `url('./images2/${opponent.card.value}.svg')` : `url('./imagesTest/Verso-Cartes.png')`, position: 'relative' }}></div>
                        )}
                        <label>{opponent.username}</label>
                        <label>{t('6quiprend.PointAmount')} {opponent.pointAmount}</label>
                    </div>
                ))}
            </div>
            <div className="cardBoard">
                {Object.keys(cardBoard).map(index => (
                    <>
                        {cardBoard[index].map((card, index2) => (
                            <div className="card" style={{ left: `${5 + 50 * index2}px`, top: `${75 + 75 * index}px`, width: '50px', height: '75px', backgroundImage: `url(./images2/${card.value}.svg)` }}></div>
                        ))}
                    </>
                ))}
            </div>
            {hasPlayedCard && (
                <div className="card" style={{ backgroundImage: `url('./images2/${playedCard.value}.svg')`, ...cardStyle, left: '85%', top: '40%' }}></div>
            )}
            <div></div>
            <div className="cardsContainer" style={{ justifyContent: 'center', position: 'absolute', flexDirection: 'row', bottom: '41%', width: '90%', display: 'flex', left: '0%' }}>
                {handCard.map((card, index) => (
                    <div style={{
                        backgroundImage: `url('./images2/${card.value}.svg')`,
                        left: '50%',
                        transformOrigin: 'bottom right',
                        transform: mustClick ? `rotate(${rotation(index)}deg) ${index === targetCard ? `translateY(-${2 * handCard.length + 20}px)` : `translateY(-${2 * handCard.length}px)`}` : `rotate(${rotation(index)}deg)`,
                        transition: '0.2s'
                    }} className="card" onMouseEnter={() => { changeTarget(index) }} onMouseLeave={() => { changeTarget(-1) }} onClick={() => selectCard(card)}></div>
                ))}
            </div>
            {showEnd && (
                <div className="end" style={{ bottom: '10%', left: '50%', position: 'absolute' }}>
                    <label className="simpleText">{messageEnd}</label>
                    <button className="endButton" onClick={handleEndClick}>{t('6quiprend.End')}</button>
                </div>
            )}
            {!endBackgroundAmbiance && (
                <BackgroundAmbiance source={"./OST/backgroundAmbiance.mp3"} volume={0.05}/>
            )}
            {playWinMusic && (
                <BackgroundAmbiance source={"./OST/victoryTheme.mp3"} volume={0.2}/>
            )}
        </>
    );
}