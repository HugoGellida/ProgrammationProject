import { socket } from "./socket.js";
import React, { useEffect, useRef, useState } from 'react';
import Bataille from './Bataille.js';
import Prendqui6 from './6quiprend.js';
import Crazy8 from './Crazy8.js';
import { useNavigate } from "react-router-dom";


export default function Partie() {
    const [messages, setMessages] = useState([]);
    const [messageSentValue, setMessageSentValue] = useState('');
    const [showLaunchButton, setShowLaunchButton] = useState(false);
    const [gameType, setGameType] = useState();
    const [launchGame, setLaunchGame] = useState(false);
    const [timer, setTimer] = useState(0);
    const [opponents, setOpponents] = useState([]);
    const [cardsGiven, setCardsGiven] = useState([]);
    const [showChat, setShowChat] = useState(true);
    const [unreadMessage, setUnreadMessage] = useState(false);
    const [infosSup, setInfosSup] = useState({});
    const messageEndRef = useRef(null);
    const [cardPlayed, setCardPlayed] = useState();

    const navigate = useNavigate()

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.emit("askLaunchButton", sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo"));
    }, []);

    useEffect(() => {


        const messageReceived = (message, username, color, title) => {
            setMessages([...messages, { context: message, username: username, color: color, title: title }]);
            if (!showChat) setUnreadMessage(true);
        }

        const launchButtonAllowed = (type) => {
            setShowLaunchButton(true);
            setGameType(type);
        }

        const fillInfo = (type, handCard, opponents, timer, infosSup) => {
            setGameType(type);
            setCardsGiven(handCard);
            setOpponents(opponents);
            setTimer(timer);
            setLaunchGame(true);
            setInfosSup(infosSup);
        }

        const pauseAllowed = () => {
            setLaunchGame(false);
            return navigate('/PageChoix');
        }

        const resumeTake6 = (handCard, cardPlayed, timer, opponents, infosSup) => {
            setGameType('6-qui-prend');
            setCardsGiven(handCard);
            setOpponents(opponents);
            setTimer(timer);
            setLaunchGame(true);
            setInfosSup(infosSup);
            setCardPlayed(cardPlayed);
        }

        const resumeCrazy8 = (handCard, timer, opponents, infosSup) => {
            setGameType('crazy8');
            setCardsGiven(handCard);
            setOpponents(opponents);
            setTimer(timer);
            setLaunchGame(true);
            setInfosSup(infosSup);
        }

        const resumeWar = (handCard, cardPlayed, timer, opponents) => {
            setGameType('jeu-de-bataille');
            setCardsGiven(handCard);
            setOpponents(opponents);
            setTimer(timer);
            setLaunchGame(true);
            setCardPlayed(cardPlayed);
        }

        socket.on("messageReceived", messageReceived);
        socket.on("showLaunchButton", launchButtonAllowed);
        socket.on("fillInfo", fillInfo);
        socket.on('pauseAllowed', pauseAllowed);
        socket.on('resumeTake6', resumeTake6);
        socket.on('resumeCrazy8', resumeCrazy8);
        socket.on('resumeWar', resumeWar);
        return () => {
            socket.off("messageReceived", messageReceived);
            socket.off("showLaunchButton", launchButtonAllowed);
            socket.off("fillInfo", fillInfo);
            socket.off('pauseAllowed', pauseAllowed);
            socket.off('resumeTake6', resumeTake6);
            socket.off('resumeCrazy8', resumeCrazy8);
            socket.off('resumeWar', resumeWar);
        }
    });

    const startGame = () => {
        socket.emit("launchGame", sessionStorage.getItem("idPartie"));
    }

    const PauseGame = () => {
        socket.emit("askPause", sessionStorage.getItem("idPartie"));
    }

    const sendMessage = () => {
        const messageWritten = document.getElementById('messageToSend').value;
        setMessageSentValue('');
        if (messageWritten.trim() !== "") socket.emit("messageSent", sessionStorage.getItem("idPartie"), messageWritten, sessionStorage.getItem("pseudo"));
    }

    const writeValue = (event) => {
        setMessageSentValue(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") sendMessage();
    }

    const clickChat = () => {
        setShowChat(!showChat);
        setUnreadMessage(false);
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
                    {gameType === "jeu-de-bataille" && (
                        <Bataille opponentInfos={opponents} cards={cardsGiven} time={timer} cardPlayed={cardPlayed}></Bataille>
                    )}
                    {gameType === '6-qui-prend' && (
                        <Prendqui6 opponentInfos={opponents} cards={cardsGiven} time={timer} infosSup={infosSup} cardPlayed={cardPlayed}></Prendqui6>
                    )}
                    {gameType === 'crazy8' && (
                        <Crazy8 opponentInfos={opponents} cards={cardsGiven} time={timer} infosSup={infosSup}></Crazy8>
                    )}
                </>
            )}
        </div>
    );
}