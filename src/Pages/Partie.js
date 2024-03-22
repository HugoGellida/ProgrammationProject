import './PageDeJeu.css';
import { socket } from "./socket.js";
import React, { useEffect, useRef, useState } from 'react';
import Bataille from './Bataille.js';
import Prendqui6 from './6quiprend.js';


export default function Partie() {
    const [messages, setMessages] = useState([]);
    const [messageSentValue, setMessageSentValue] = useState('');
    const [firstLaunch, setFirstLaunch] = useState(true);
    const [showLaunchButton, setShowLaunchButton] = useState(false);
    const [gameType, setGameType] = useState();
    const [launchGame, setLaunchGame] = useState(false);
    const [timer, setTimer] = useState(0);
    const [opponents, setOpponents] = useState([]);
    const [cardsGiven, setCardsGiven] = useState([]);
    const [showChat, setShowChat] = useState(true);
    const [unreadMessage, setUnreadMessage] = useState(false);
    const [cardBoard, setCardBoard] = useState({});
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (firstLaunch) {
            socket.emit("askLaunchButton", sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo"));
            setFirstLaunch(false);
        }

        if (showChat) setUnreadMessage(false);


        const messageReceived = (message, username, color, title) => {
            setMessages([...messages, { context: message, username: username, color: color, title: title }]);
            if (!showChat) setUnreadMessage(true);
        }

        const launchButtonAllowed = (type) => {
            setShowLaunchButton(true);
            setGameType(type);
        }

        const test = (handCard, opponents, timer) => {
            setGameType('jeu-de-bataille');
            setCardsGiven(handCard);
            setOpponents(opponents)
            setTimer(timer);
            setLaunchGame(true);
        }

        const test2 = (handCard, opponents, timer, cardB) => {
            setGameType('6-qui-prend');
            setCardsGiven(handCard);
            setOpponents(opponents)
            setTimer(timer);
            setLaunchGame(true);
            console.log(cardB);
            setCardBoard(cardB);
        }

        socket.on("messageReceived", messageReceived);
        socket.on("showLaunchButton", launchButtonAllowed);
        socket.on("testingResult", test);
        socket.on("testingResult2", test2);

        return () => {
            socket.off("messageReceived", messageReceived);
            socket.off("showLaunchButton", launchButtonAllowed);
            socket.off("testingResult", test);
            socket.off("testingResult2", test2);
        }
    });

    const startGame = () => {
        socket.emit("testing", sessionStorage.getItem("idPartie"));
    }

    const PauseGame = () => {
        console.log("hello2");
    }

    const sendMessage = () => {
        const messageWritten = document.getElementById('messageToSend').value;
        setMessageSentValue('');
        if (messageWritten !== "") socket.emit("messageSent", sessionStorage.getItem("idPartie"), messageWritten, sessionStorage.getItem("pseudo"));
    }

    const writeValue = (event) => {
        setMessageSentValue(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key == "Enter") sendMessage();
    }

    const clickChat = () => {
        setShowChat(!showChat);
    }

    return (
        <div className="PageDeJeu">
            {showChat && (
                <div className='Chat' style={{ bottom: '5%', left: '1%', position: 'absolute', zIndex: '1' }}>
                    <div id='messages' style={{ height: "300px", width: "200px", overflowY: 'auto', border: '2px inset rgb(90, 15, 15)', backgroundColor: 'rgb(0, 0, 0, 0.75)' }}>
                        {messages.map(message => {
                            if (message.title) {
                                return (
                                    <>
                                        <strong style={{ fontSize: "12px", color: message.color }}>[{message.title}]</strong>
                                        <strong style={{ fontSize: "12px", color: message.color }}>{message.username}</strong>
                                        <span style={{ fontSize: "12.5px", color: "white" }}> {message.context}</span>
                                        <br></br>
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <strong style={{ fontSize: "12px", color: message.color }}>{message.username}</strong>
                                        <span style={{ fontSize: "12.5px", color: "white" }}>{message.context}</span>
                                        <br></br>
                                    </>
                                );
                            }
                        })}
                        <div ref={messageEndRef}></div>
                    </div>
                    <input id='messageToSend' type='text' placeholder='Ecrivez votre message...' value={messageSentValue} onChange={writeValue} onKeyDown={handleKeyPress}></input>
                    <button onClick={sendMessage}>▸</button>
                </div>
            )}
            <button onClick={clickChat} style={{width: '30px', height: '30px', bottom: '0%', left: '1%', position: 'absolute', fontSize: '5px', borderRadius: '12.5px', backgroundColor: unreadMessage? 'rgb(90, 15, 15)': '', transition: '1s'}}>...</button>
            {!launchGame && showLaunchButton && (
                <button id='LaunchButton' onClick={startGame} style={{ position: 'absolute', top: '50%', left: '50%' }}>Commencer</button>
            )}
            {launchGame && (
                <>
                    {showLaunchButton && (
                        <button id='pause' onClick={PauseGame} style={{ top: '5%', left: '85%', position: 'absolute' }}>Enregistrer</button>
                    )}
                    {gameType == "jeu-de-bataille" && (
                        <Bataille opponentInfos={opponents} cards={cardsGiven} time={timer}></Bataille>
                    )}
                    {gameType == '6-qui-prend' && (
                        <Prendqui6 opponentInfos={opponents} cards={cardsGiven} time={timer} cardB={cardBoard}></Prendqui6>
                    )}
                </>
            )}
        </div>
    );
}