import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import BackgroundAmbiance from "../BackgroundAmbiance";
import { useTranslation } from "react-i18next";

export default function Bataille({ opponentInfos, cards, time, cardPlayed }) {
    const [opponents, setOpponents] = useState(opponentInfos);
    const [handCard, setHandCard] = useState(cards);
    const [playedCard, setPlayedCard] = useState(cardPlayed);
    const [hasPlayedCard, setHasPlayedCard] = useState(cardPlayed !== undefined && cardPlayed !== null);
    const [showCard, setShowCard] = useState(false);
    const [targetCard, setTargetCard] = useState(-1);
    const [currentEmitter, setCurrentEmitter] = useState('chooseCardWar');
    const [mustClick, setMustClick] = useState(cardPlayed === undefined || cardPlayed === null);
    const timer = time;
    const [currentTimer, setCurrentTimer] = useState(time);
    const [launchTimer, setLaunchTimer] = useState(cardPlayed === undefined || cardPlayed === null);
    const [showEnd, setShowEnd] = useState(false);
    const [messageEnd, setMessageEnd] = useState('');
    const [endBackgroundAmbiance, setEndBackgroundAmbiance] = useState(false);
    const [playCardSound, setPlayCardSound] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

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

        const thirdGameTest = (opponents, handCard) => {
            initialState(opponents, handCard);
            setCurrentEmitter('chooseCardWar');
        }

        const fourthGameTest = (opponents, handCard) => {
            initialState(opponents, handCard);
            setCurrentEmitter('chooseHiddenCardWar');
        }

        const winWar = () => {
            setEndBackgroundAmbiance(false);
            setMessageEnd("Win");
            setShowEnd(true);
            setHandCard([]);
        }

        const loseWar = () => {
            setEndBackgroundAmbiance(false);
            setMessageEnd("Lose");
            setShowEnd(true);
            setHandCard([]);
        }

        const tieWar = () => {
            setEndBackgroundAmbiance(false);
            setMessageEnd("Tie");
            setShowEnd(true);
            setHandCard([]);
        }


        socket.on('firstGameTest', firstGameTest);
        socket.on('secondGameTest', secondGameTest);
        socket.on('thirdGameTest', thirdGameTest);
        socket.on('fourthGameTest', fourthGameTest);
        socket.on('winWar', winWar);
        socket.on('loseWar', loseWar);
        socket.on('tieWar', tieWar);
        return () => {
            socket.off('firstGameTest', firstGameTest);
            socket.off('secondGameTest', secondGameTest);
            socket.off('thirdGameTest', thirdGameTest);
            socket.off('fourthGameTest', fourthGameTest);
            socket.off('winWar', winWar);
            socket.off('loseWar', loseWar);
            socket.off('tieWar', tieWar);
        }
    });

    const initialState = (opponents, handCard) => {
        setMustClick(true);
        setShowCard(false);
        setLaunchTimer(true);
        setHasPlayedCard(false);
        setPlayedCard();
        setOpponents(opponents);
        setHandCard(handCard);
    }

    const changeTarget = (index) => {
        setTargetCard(index);
    }

    const selectCard = (cardChosen) => {
        if (mustClick) {
            setPlayCardSound(true);
            setHandCard(handCard.filter(card => card.value !== cardChosen.value || card.type !== cardChosen.type));
            socket.emit(currentEmitter, sessionStorage.getItem('idPartie'), cardChosen, sessionStorage.getItem('pseudo'));
            if (currentEmitter === 'chooseCardWar') {
                setPlayedCard(cardChosen);
                setHasPlayedCard(true);
            }
            setLaunchTimer(false);
            setCurrentTimer(timer);
            setMustClick(false);
            setTargetCard(-1);
        }
    }

    const handleEndClick = () => {
        return navigate('/PageChoix');
    }

    const rotation = (index) => {
        const angle = (Math.PI / handCard.length) * index;
        const x = Math.cos((Math.PI / 2) - angle) * 100;
        const y = Math.sin((Math.PI / 2) - angle) * 100;
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    const stopCardSound = () => {
        setPlayCardSound(false);
    }

    return (
        <>
            <div className="timer" style={{
                backgroundColor: currentTimer % 2 === 0 && launchTimer ? 'rgb(90, 15, 15)' : '',
                color: `rgb(255, ${255 - ((timer - currentTimer) / timer) * 255}, ${255 - ((timer - currentTimer) / timer) * 255})`
            }}>{currentTimer}</div>
            <div className="opponentContainer">
                {opponents.map((opponent) => (
                    <div className="opponent" id={opponent.username}>
                        {opponent.card && (
                            <div className="card" style={{ backgroundImage: showCard ? `url('./imagesTest/${opponent.card.value}-${opponent.card.type}.png')` : `url('./imagesTest/Verso-Cartes.png')`, position: 'relative' }}></div>
                        )}
                        <label>{opponent.username}</label>
                        <label>{t('Bataille.CardAmount')} {opponent.cardAmount}</label>
                    </div>
                ))}
            </div>
            {hasPlayedCard && (
                <div className="card" style={{ backgroundImage: `url('./imagesTest/${playedCard.value}-${playedCard.type}.png')`, left: '85%', top: '40%' }}></div>
            )}
            <div></div>
            <div className="cardsContainer" style={{ justifyContent: 'center', position: 'absolute', flexDirection: 'row', top: '50%', width: '90%', display: 'flex', left: '0%' }}>
                {handCard.map((card, index) => (
                    <div style={{
                        backgroundImage: `url('./imagesTest/${card.value}-${card.type}.png')`,
                        left: '50%',
                        transformOrigin: 'bottom right',
                        transform: mustClick ? `rotate(${rotation(index)}deg) ${index === targetCard ? `translateY(-${2 * handCard.length + 20}px)` : `translateY(-${2 * handCard.length}px)`}` : `rotate(${rotation(index)}deg)`,
                        transition: '0.2s'
                    }} className="card" onMouseEnter={() => { changeTarget(index) }} onMouseLeave={() => { changeTarget(-1) }} onClick={() => selectCard(card)}></div>
                ))}
            </div>
            {showEnd && (
                <div className="end" style={{bottom: '10%', left: '50%', position: 'absolute'}}>
                    <label className="simpleText">{t(`Bataille.${messageEnd}`)}</label>
                    <button className="endButton" onClick={handleEndClick}>{t('Bataille.End')}</button>
                </div>
            )}
            {!endBackgroundAmbiance && (
                <BackgroundAmbiance source={"./OST/backgroundAmbiance.mp3"} volume={0.05}/>
            )}
            {playCardSound && (
                <BackgroundAmbiance source={"./OST/CardNoise.mp3"} volume={0.05} noloop onEnded={stopCardSound}/>
            )}
        </>
    );
}