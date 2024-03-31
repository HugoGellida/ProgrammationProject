import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Parameters.css';
import ChatColors from "./InsideParameters/ChatColors";
import ChatTitles from "./InsideParameters/ChatTitles";
import Shop from "./InsideParameters/Shop";
import Statistics from "./InsideParameters/Statistics";
import BackgroundAmbiance from "./BackgroundAmbiance.js";

export default function Parameters() {
    const navigate = useNavigate();

    const [showColors, setShowColors] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [showStats, setShowStats] = useState(true);
    const [showShop, setShowShop] = useState(false);

    function resetShow() {
        setShowColors(false);
        setShowStats(false);
        setShowTitles(false);
        setShowShop(false);
    }

    function handleClickColors() {
        resetShow();
        setShowColors(true);
    }

    function handleClickTitles() {
        resetShow();
        setShowTitles(true);
    }

    function handleClickStats() {
        resetShow();
        setShowStats(true);
    }

    function handleClickShop() {
        resetShow();
        setShowShop(true);
    }

    function leave() {
        navigate("/PageChoix");
    }

    return (
        <div className="Parameters">
            <div className="filter">
                <button className="choice" onClick={leave} style={{ alignSelf: 'flex-start', marginBottom: 'auto' }}>Leave</button>
                <button className="choice" onClick={handleClickColors} style={{ backgroundColor: showColors ? 'rgb(255, 0, 0)' : '' }}>Chat Colors</button>
                <button className="choice" onClick={handleClickTitles} style={{ backgroundColor: showTitles ? 'rgb(255, 0, 0)' : '' }}>Chat Titles</button>
                <button className="choice" onClick={handleClickShop} style={{ marginBottom: 'auto', backgroundColor: showShop ? 'rgb(255, 0, 0)' : '' }}>Shop</button>
                <button className="choice" onClick={handleClickStats} style={{ backgroundColor: showStats ? 'rgb(255, 0, 0)' : '' }}>Statistics</button>
            </div>
            <div className="container">
                {showColors && (
                    <ChatColors />
                )}
                {showTitles && (
                    <ChatTitles />
                )}
                {showStats && (
                    <Statistics />
                )}
                {showShop && (
                    <>
                        <BackgroundAmbiance source={"./OST/ShopMusic.mp3"} volume={0.05} noloop />
                        <Shop />
                    </>
                )}
            </div>
        </div>
    );
}