import { useEffect, useState } from "react";
import './Bataille.css';
import { socket } from "./socket";

export default function Bataille({ opponentInfos, cards }) {
    const [opponents, setOpponents] = useState(opponentInfos);
    const [handCard, setHandCard] = useState(cards);
    const [playedCard, setPlayedCard] = useState();
    const [hasPlayedCard, setHasPlayedCard] = useState();
    const [showCard, setShowCard] = useState(false);
    const [targetCard, setTargetCard] = useState(-1);
    const [currentEmitter, setCurrentEmitter] = useState('chooseCardWar');
    const [mustClick, setMustClick] = useState(true);


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
            //need timer I think there
            setMustClick(true);
            setShowCard(false);
            setHasPlayedCard(false);
            setPlayedCard();
            setOpponents(opponents);
            setHandCard(handCard);
            setCurrentEmitter('chooseCardWar');
        }

        const fourthGameTest = (opponents, handCard) => {
            setMustClick(true);
            setShowCard(false);
            setHasPlayedCard(false);
            setPlayedCard();
            setOpponents(opponents);
            setHandCard(handCard);
            setCurrentEmitter('chooseHiddenCardWar');
        }


        socket.on('firstGameTest', firstGameTest);
        socket.on('secondGameTest', secondGameTest);
        socket.on('thirdGameTest', thirdGameTest);
        socket.on('fourthGameTest', fourthGameTest);
        return () => {
            socket.off('firstGameTest', firstGameTest);
            socket.off('secondGameTest', secondGameTest);
            socket.off('thirdGameTest', thirdGameTest);
            socket.off('fourthGameTest', fourthGameTest);
        }
    })

    const calculateMargin = (index) => {
        return `${250 - index * 23}px`;
    }

    const changeTarget = (index) => {
        setTargetCard(index);
    }

    const selectCard = (cardChosen) => {
        console.log(`you selected the ${cardChosen.value} of ${cardChosen.type}`);
        setHandCard(handCard.filter(card => card.value !== cardChosen.value || card.type !== cardChosen.type));
        socket.emit(currentEmitter, sessionStorage.getItem('idPartie'), cardChosen, sessionStorage.getItem('pseudo'));
        if (currentEmitter === 'chooseCardWar') {
            setPlayedCard(cardChosen);
            setHasPlayedCard(true);
        }
        setMustClick(false);
        setTargetCard(-1);
    }

    const cardStyle = (index) => {
        return {
            height: '150px',
            width: '100px',
            backgroundSize: 'cover',
            boxShadow: '0px, 0px, 10px, rgba(0, 0, 0, 0.75)',
            position: 'absolute',
            left: '50%',
            transformOrigin: 'bottom right',
            border: '1px inset rgb(90, 15, 15)'
        }
    }

    const rotation = (index) => {
        const angle = (Math.PI / handCard.length) * index;
        const x = Math.cos((Math.PI / 2) - angle) * 100;
        const y = Math.sin((Math.PI / 2) - angle) * 100;
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    return (
        <>
            <div className="opponentContainer">
                {opponents.map(opponent => (
                    <div className="opponent" id={opponent.username} style={{ color: "white", backgroundColor: 'rgb(0, 0, 0, 75)', border: '3px inset rgb(90, 15, 15)', backgroundSize: 'cover' }}>
                        {(showCard && opponent.card) && (
                            <div className="cardPlayed" style={{ backgroundImage: `url('./imagesTest/${opponent.card.value}-${opponent.card.type}.png')`, backgroundSize: 'cover', height: '150px', width: '100px' }}></div>
                        )}
                        {(!showCard && opponent.card) && (
                            <div className="cardPlayed" style={{ backgroundImage: `url('./imagesTest/Verso-Cartes.png')`, backgroundSize: 'cover', height: '150px', width: '100px' }}></div>
                        )}
                        <label>{opponent.username}</label>
                        <label>{opponent.cardAmount} cartes</label>
                    </div>
                ))}
            </div>
            {hasPlayedCard && (
                <div className="card" style={{ backgroundImage: `url('./imagesTest/${playedCard.value}-${playedCard.type}.png')`, height: '150px', width: '100px', backgroundSize: 'cover', left: '85%', top: '40%', position: 'absolute' }}></div>
            )}
            <div></div>
            <div className="cardsContainer" style={{ justifyContent: 'center', position: 'absolute', flexDirection: 'row', top: '50%', width: '90%', display: 'flex', left: '0%' }}>
                {mustClick && (
                    <>
                        {handCard.map((card, index) => (
                            <div style={{
                                backgroundImage: `url('./imagesTest/${card.value}-${card.type}.png')`,
                                ...cardStyle(index),
                                transform: `rotate(${rotation(index)}deg) ${index === targetCard ? 'translateY(-60px)' : 'translateY(-40px)'}`,
                                transition: '0.35s'
                            }} className="card" onMouseEnter={() => { changeTarget(index) }} onMouseLeave={() => { changeTarget(-1) }} onClick={() => selectCard(card)}></div>
                        ))}
                    </>
                )}
                {!mustClick && (
                    <>
                        {handCard.map((card, index) => (
                            <div style={{
                                backgroundImage: `url('./imagesTest/${card.value}-${card.type}.png')`,
                                ...cardStyle(index),
                                transform: `rotate(${rotation(index)}deg)`
                            }} className="card"></div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}