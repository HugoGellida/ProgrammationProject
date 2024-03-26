import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import BackgroundAmbiance from "./backgroundAmbiance";

export default function Prendqui6({ opponentInfos, cards, time, infosSup }) {
    const [opponents, setOpponents] = useState(opponentInfos);
    const [handCard, setHandCard] = useState(cards);
    const [playedCard, setPlayedCard] = useState();
    const [hasPlayedCard, setHasPlayedCard] = useState();
    const [showCard, setShowCard] = useState(false);
    const [targetCard, setTargetCard] = useState(-1);
    const [mustClick, setMustClick] = useState(true);
    const timer = time;
    const [currentTimer, setCurrentTimer] = useState(time);
    const [launchTimer, setLaunchTimer] = useState(true);
    const [cardBoard, setCardBoard] = useState(infosSup);
    const [showEnd, setShowEnd] = useState(false);
    const [messageEnd, setMessageEnd] = useState('');
    const [endBackgroundAmbiance, setEndBackgroundAmbiance] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let intervalIDTimer;
        if (launchTimer) {
            intervalIDTimer = setInterval(() => {
                setCurrentTimer(currentTimer - 1);
            }, 1000);
            if (mustClick && currentTimer == 0) {
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
            if (username == sessionStorage.getItem('pseudo')){
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
            setEndBackgroundAmbiance(false);
            if (winners.includes(sessionStorage.getItem('pseudo'))){
                setMessageEnd("Vous avez gagné la partie (+750g)");
            } else {
                if (winners.length == 1){
                    setMessageEnd(`${winners[0]} a gagné la partie`);
                } else {
                    setMessageEnd(`Les joueurs ${winners} ont gagnés la partie`);
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
                    <div className="opponent" id={opponent.username} style={{ color: "white", backgroundColor: 'rgb(0, 0, 0, 75)', border: '3px inset rgb(90, 15, 15)', backgroundSize: 'cover', left: `${(100 / (opponents.length + 1)) * (index + 1)}%`, position: 'absolute' }}>
                        {opponent.card && (
                            <div className="cardPlayed" style={{ backgroundImage: showCard ? `url('./images2/${opponent.card.value}.svg')` : `url('./imagesTest/Verso-Cartes.png')`, ...cardStyle, position: 'relative' }}></div>
                        )}
                        <label>{opponent.username}</label>
                        <label>{opponent.pointAmount} points</label>
                    </div>
                ))}
            </div>
            <div className="cardBoard">
                {Object.keys(cardBoard).map(index => (
                    <>
                        {cardBoard[index].map((card, index2) => (
                            <div className="card" style={{ ...cardStyle, left: `${5 + 50 * index2}px`, top: `${75 + 75 * index}px`, width: '50px', height: '75px', position: 'absolute', backgroundImage: `url(./images2/${card.value}.svg)` }}></div>
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
                        ...cardStyle,
                        left: '50%',
                        transformOrigin: 'bottom right',
                        transform: mustClick ? `rotate(${rotation(index)}deg) ${index === targetCard ? `translateY(-${2 * handCard.length + 20}px)` : `translateY(-${2 * handCard.length}px)`}` : `rotate(${rotation(index)}deg)`,
                        transition: '0.2s'
                    }} className="card" onMouseEnter={() => { changeTarget(index) }} onMouseLeave={() => { changeTarget(-1) }} onClick={() => selectCard(card)}></div>
                ))}
            </div>
            {showEnd && (
                <div style={{ bottom: '10%', left: '50%', position: 'absolute' }}>
                    <label>{messageEnd}</label>
                    <button onClick={handleEndClick}>Retour</button>
                </div>
            )}
            {!endBackgroundAmbiance && (
                <BackgroundAmbiance/>
            )}
        </>
    );
}