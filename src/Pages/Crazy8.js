import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import BackgroundAmbiance from "./backgroundAmbiance";

export default function Crazy8({ opponentInfos, cards, time, infosSup }) {
    const [opponents, setOpponents] = useState(opponentInfos);
    const [handCard, setHandCard] = useState(cards);
    const [targetCard, setTargetCard] = useState(-1);
    const [mustClick, setMustClick] = useState(infosSup.isFirstPlayer);
    const [timer, setTimer] = useState(time);
    const [currentTimer, setCurrentTimer] = useState(time);
    const [launchTimer, setLaunchTimer] = useState(infosSup.isFirstPlayer);
    const [lastCardPlayed, setLastCardPlayed] = useState(infosSup.lastCardPlayed);
    const [showEnd, setShowEnd] = useState(false);
    const [messageEnd, setMessageEnd] = useState('');
    const [showTypeChoice, setShowTypeChoice] = useState(false);
    const [playableCards, setPlayableCards] = useState(infosSup.playableCards);
    const [waitingCard, setWaitingCard] = useState();
    const [showChoice, setShowChoice] = useState(false);
    const [currentEmitter, setCurrentEmitter] = useState('chooseCardCrazy8');
    const [showWinButton, setShowWinButton] = useState(false);
    const [winTimer, setWinTimer] = useState(5);
    const [currentWinTimer, setCurrentWinTimer] = useState(winTimer);
    const [opponentTarget, setOpponentTarget] = useState('');
    const [endBackgroundAmbiance, setEndBackgroundAmbiance] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        let intervalIDTimer;
        if (launchTimer) {
            intervalIDTimer = setInterval(() => {
                setCurrentTimer(currentTimer - 1);
            }, 1000);
            if (mustClick && currentTimer == 0) {
                socket.emit('timeOutCrazy8', sessionStorage.getItem('idPartie'), sessionStorage.getItem('pseudo'));
                setLaunchTimer(false);
                setCurrentTimer(timer);
                setMustClick(false);
                setPlayableCards([]);
            }
        }
        return () => {
            clearInterval(intervalIDTimer);
        }
    }, [currentTimer, launchTimer]);

    
    useEffect(() => {
        let intervalIDTimer;
        if (showWinButton) {
            intervalIDTimer = setInterval(() => {
                setCurrentWinTimer(currentWinTimer - 1);
            }, 1000);
            if (currentWinTimer === 0){
                socket.emit('missedWinCrazy8', sessionStorage.getItem('idPartie'), sessionStorage.getItem('pseudo'));
                setShowWinButton(false);
                setCurrentWinTimer(winTimer);
            }
        }
        return () => {
            clearInterval(intervalIDTimer);
        }
    }, [currentWinTimer, showWinButton]);


    useEffect(() => {
        const firstGameTest = (handCard, opponents, currentPlayer) => {
            setHandCard(handCard);
            setOpponents(opponents);
            setOpponentTarget(currentPlayer);
        }

        const secondGameTest = (handCard, playableCards) => {
            setMustClick(true);
            setLaunchTimer(true);
            setHandCard(handCard);
            setPlayableCards(playableCards);
        }

        const thirdGameTest = (lastCardPlayed) => {
            setLastCardPlayed(lastCardPlayed);
        }

        const clickToWinCrazy8 = () => {
            setShowWinButton(true);
            setLaunchTimer(false);
            setCurrentTimer(timer);
        }

        const placeOrPickCrazy8 = (cardPicked) => {
            setCurrentEmitter('placeOrPickCrazy8');
            setWaitingCard(cardPicked);
            setShowChoice(true);
        }

        const winCrazy8 = (winner) => {
            setShowEnd(true);
            if (winner === sessionStorage.getItem('pseudo')){
                setMessageEnd('Vous avez gagné la partie(+750g)');
            }
            else {
                setMessageEnd(`Le joueur ${winner} a gagné la partie`);
                setHandCard([]);
            }
        }


        socket.on('firstGameTest', firstGameTest);
        socket.on('secondGameTest', secondGameTest);
        socket.on('thirdGameTest', thirdGameTest);
        socket.on('clickToWinCrazy8', clickToWinCrazy8);
        socket.on('placeOrPickCrazy8', placeOrPickCrazy8);
        socket.on('winCrazy8', winCrazy8);
        return () => {
            socket.off('firstGameTest', firstGameTest);
            socket.off('secondGameTest', secondGameTest);
            socket.off('thirdGameTest', thirdGameTest);
            socket.off('clickToWinCrazy8', clickToWinCrazy8);
            socket.off('placeOrPickCrazy8', placeOrPickCrazy8);
            socket.off('winCrazy8', winCrazy8);
        }
    });

    const changeTarget = (index) => {
        setTargetCard(index);
    }

    const selectCard = (cardChosen) => {
        if (mustClick && cardInPlayableCards(cardChosen, playableCards)) {
            setHandCard(handCard.filter(card => card.value !== cardChosen.value || card.type !== cardChosen.type));
            if (cardChosen.value === 8) {
                setWaitingCard(cardChosen);
                setShowTypeChoice(true);
            } else {
                socket.emit('chooseCardCrazy8', sessionStorage.getItem('idPartie'), cardChosen, cardChosen.type);
                setPlayableCards([]);
                setLaunchTimer(false);
                setCurrentTimer(timer);
                setMustClick(false);
                setTargetCard(-1);
            }
        }
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

    const cardInPlayableCards = (card, playableCards) => {
        return playableCards.filter(c => c.value === card.value && c.type === card.type).length != 0;
    }

    const chooseType = (type) => {
        if (currentEmitter === 'placeOrPickCrazy8') {
            socket.emit('placeOrPickCrazy8', 'place', waitingCard, type, sessionStorage.getItem('idPartie'));
            setCurrentEmitter('chooseCardCrazy8');
        }
        else socket.emit('chooseCardCrazy8', sessionStorage.getItem('idPartie'), waitingCard, type);
        setPlayableCards([]);
        setLaunchTimer(false);
        setWaitingCard();
        setCurrentTimer(timer);
        setMustClick(false);
        setTargetCard(-1);
        setShowTypeChoice(false);
    }

    const chooseChoice = (choice) => {
        setShowChoice(false);
        if (waitingCard.value === 8 && choice === 'place'){
            setShowTypeChoice(true);
        } else {
            socket.emit('placeOrPickCrazy8', choice, waitingCard, waitingCard.type, sessionStorage.getItem('idPartie'));
            setCurrentEmitter('chooseCardCrazy8');
            setPlayableCards([]);
            setLaunchTimer(false);
            setWaitingCard();
            setCurrentTimer(timer);
            setMustClick(false);
            setTargetCard(-1);
        }
    }

    const clickPick = () => {
        socket.emit('pickCardCrazy8', sessionStorage.getItem('idPartie'));
        setPlayableCards([]);
        setLaunchTimer(false);
        setCurrentTimer(timer);
        setMustClick(false);
        setTargetCard(-1);
        setShowTypeChoice(false);
    }

    const clickWin = () => {
        socket.emit('clickedWinCrazy8', sessionStorage.getItem('idPartie'), sessionStorage.getItem('pseudo'));
        setShowWinButton(false);
        setCurrentWinTimer(winTimer);
        setEndBackgroundAmbiance(true);
    }

    const timerStyle = {
        backgroundColor: currentTimer % 2 == 0 ? 'rgb(90, 15, 15)' : '',
        transition: '0.75s',
        color: `rgb(255, ${255 - ((timer - currentTimer) / timer) * 255}, ${255 - ((timer - currentTimer) / timer) * 255})`,
        top: '20%',
        left: '90%',
        border: '2px inset rgb(90, 15, 15)',
        borderRadius: '5px',
        alignContent: 'center',
        position: 'absolute',
        width: '40px',
        height: '25px',
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'column',
        textShadow: '0 0 4px #FF0000, 0 0 50px #FF0000, 0px 0px 14px #FF0000, 0 0 100px #FF0000, 0 0 150px #FF0000, 0 0 150px #FF0000, 0 0 550px #CA0000, 0 0 250px #CA0000, 0 0 350px #CA0000, 0 0 250px #CA0000'
    }

    return (
        <>
            <div className="timer" style={timerStyle}>{currentTimer}</div>
            <div className="opponentContainer">
                {opponents.map((opponent, index) => (
                    <div className="opponent" id={opponent.username} style={{ color: "white", backgroundColor: (opponent.username !== opponentTarget)?'rgb(0, 0, 0, 75)': 'rgb(90, 15, 15)', border: '3px inset rgb(90, 15, 15)', backgroundSize: 'cover', left: `${(100 / (opponents.length + 1)) * (index + 1)}%`, position: 'absolute', transition: '0.3s' }}>
                        <label>{opponent.username}</label>
                        <label>{opponent.cardAmount} cartes</label>
                    </div>
                ))}
            </div>
            <div className="lastCardPlayed" style={{ ...cardStyle, left: `10%`, top: `40%`, backgroundImage: `url('./imagesCrazy8/${lastCardPlayed.value}-${lastCardPlayed.type}.png')` }}></div>
            <div className="pick" style={{ ...cardStyle, left: `20%`, top: `40%`, backgroundImage: `url('./imagesCrazy8/Verso-Cartes.png')` }} onClick={clickPick}></div>
            <div></div>
            <div className="cardsContainer" style={{ justifyContent: 'center', position: 'absolute', flexDirection: 'row', bottom: '41%', width: '90%', display: 'flex', left: '0%' }}>
                {handCard.map((card, index) => (
                    <div style={{
                        backgroundImage: `url('./imagesCrazy8/${card.value}-${card.type}.png')`,
                        ...cardStyle,
                        left: '50%',
                        transformOrigin: 'bottom right',
                        transform: (mustClick && cardInPlayableCards(card, playableCards)) ? `rotate(${rotation(index)}deg) ${index === targetCard ? `translateY(-${2 * handCard.length + 20}px)` : `translateY(-${2 * handCard.length}px)`}` : `rotate(${rotation(index)}deg)`,
                        transition: '0.2s',
                    }} className="card" onMouseEnter={() => { changeTarget(index) }} onMouseLeave={() => { changeTarget(-1) }} onClick={() => selectCard(card)}></div>
                ))}
            </div>
            {showEnd && (
                <div style={{ bottom: '10%', left: '50%', position: 'absolute' }}>
                    <label>{messageEnd}</label>
                    <button onClick={handleEndClick}>Retour</button>
                </div>
            )}
            {showTypeChoice && (
                <div style={{ left: '20%', top: '0%', position: 'absolute', width: '50%', height: '50%' }}>
                    <button style={{ left: '10%', top: '10%', position: 'absolute' }} onClick={() => chooseType('spade')}>spade</button>
                    <button style={{ left: '10%', top: '90%', position: 'absolute' }} onClick={() => chooseType('clover')}>clover</button>
                    <button style={{ left: '90%', top: '10%', position: 'absolute' }} onClick={() => chooseType('heart')}>heart</button>
                    <button style={{ left: '90%', top: '90%', position: 'absolute' }} onClick={() => chooseType('tile')}>tile</button>
                    <div style={{ left: '50%', top: '50%', ...cardStyle, backgroundImage: `url('./imagesCrazy8/8-${waitingCard.type}.png')` }}></div>
                </div>
            )}
            {showChoice && (
                <div style={{ left: '20%', top: '0%', position: 'absolute', width: '50%', height: '50%' }}>
                    <button style={{ left: '10%', top: '50%', position: 'absolute' }} onClick={() => chooseChoice('pick')}>pick</button>
                    <button style={{ left: '90%', top: '50%', position: 'absolute' }} onClick={() => chooseChoice('place')}>place</button>
                    <div style={{ left: '50%', top: '50%', ...cardStyle, backgroundImage: `url('./imagesCrazy8/${waitingCard.value}-${waitingCard.type}.png')` }}></div>
                </div>
            )}
            {showWinButton && (
                <button onClick={clickWin} style={{left: '70%', top: '70%', position: 'absolute'}}>WIN {currentWinTimer}</button>
            )}
            {!endBackgroundAmbiance && (
                <BackgroundAmbiance/>
            )}
        </>
    );
}