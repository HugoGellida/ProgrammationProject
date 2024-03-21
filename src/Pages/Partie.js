import './PageDeJeu.css';
import { socket } from "./socket.js";
import React, { useEffect, useRef, useState } from 'react';
import Tchat from './../Composants/Tchat.js'
import { useNavigate } from "react-router-dom";
import Bataille from './Bataille.js';


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
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth'});
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (firstLaunch) {
            socket.emit("askLaunchButton", sessionStorage.getItem("idPartie"), sessionStorage.getItem("pseudo"));
            setFirstLaunch(false);
        }


        const messageReceived = (message, username, color, title) => {
            setMessages([...messages, { context: message, username: username, color: color, title: title }]);
        }

        const launchButtonAllowed = (type) => {
            setShowLaunchButton(true);
            setGameType(type);
        }

        const test = (handCard, opponents) => {
            setGameType("jeu-de-bataille");
            setCardsGiven(handCard);
            setOpponents(opponents)
            setLaunchGame(true);
        }

        socket.on("messageReceived", messageReceived);
        socket.on("showLaunchButton", launchButtonAllowed);
        socket.on("testingResult", test);

        return () => {
            socket.off("messageReceived", messageReceived);
            socket.off("showLaunchButton", launchButtonAllowed);
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

    return (
        <div className="PageDeJeu">
            <div className='Chat' style={{top: '1%', left: '1%', position: 'absolute'}}>
                <div id='messages' style={{height: "300px", width: "200px", overflowY: 'auto', border: '2px inset rgb(90, 15, 15)', backgroundColor: 'rgb(0, 0, 0, 0.75)'}}>
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
            {!launchGame && showLaunchButton && (
                <button id='LaunchButton' onClick={startGame} style={{position: 'absolute', top: '50%', left: '50%'}}>Commencer</button>
            )}
            {launchGame && (
                <>
                    <div id='timer'></div>
                    {showLaunchButton && (
                        <button id='pause' onClick={PauseGame}>Enregistrer</button>
                    )}
                    {gameType == "jeu-de-bataille" && (
                        <Bataille opponentInfos={opponents} cards={cardsGiven}></Bataille>
                    )}
                </>
            )}
        </div>
    );
}