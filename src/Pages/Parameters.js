import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Parameters.css';
import ChatColors from "./InsideParameters/ChatColors";
import ChatTitles from "./InsideParameters/ChatTitles";
import Shop from "./InsideParameters/Shop";
import Statistics from "./InsideParameters/Statistics";
import Languages from "./InsideParameters/Languages";
import BackgroundAmbiance from "./BackgroundAmbiance";
import Global from "./InsideParameters/Global.js";
import { useTranslation } from "react-i18next";
import { socket } from "./socket.js";

export default function Parameters() {
    const navigate = useNavigate();

    const [showColors, setShowColors] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [showStats, setShowStats] = useState(true);
    const [showShop, setShowShop] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const [showGlobal, setShowGlobal] = useState(false);

    const { t } = useTranslation();

    function resetShow() {
        setShowColors(false);
        setShowStats(false);
        setShowTitles(false);
        setShowShop(false);
        setShowLanguage(false);
        setShowGlobal(false);
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

    function handleClickLanguage() {
        resetShow();
        setShowLanguage(true);
    }

    function handleClickGlobal() {
        resetShow();
        setShowGlobal(true);
    }

    function handleClickProfile() {
        socket.emit('disconnection', sessionStorage.getItem('pseudo'));
        sessionStorage.removeItem('pseudo');
        navigate('/');
    }

    function leave() {
        navigate("/PageChoix");
    }

    return (
        <div className="Parameters">
            <div className="filter">
                <button className="choice" onClick={leave} style={{ alignSelf: 'flex-start', marginBottom: 'auto' }}>{t('Parameters.Exit')}</button>
                <button className="choice" onClick={handleClickColors} style={{ backgroundColor: showColors ? 'rgb(255, 0, 0)' : '' }}>{t('Parameters.ChatColors.Name')}</button>
                <button className="choice" onClick={handleClickTitles} style={{ backgroundColor: showTitles ? 'rgb(255, 0, 0)' : '' }}>{t('Parameters.ChatTitles.Name')}</button>
                <button className="choice" onClick={handleClickShop} style={{ marginBottom: 'auto', backgroundColor: showShop ? 'rgb(255, 0, 0)' : '' }}>{t('Parameters.Shop.Name')}</button>
                <button className="choice" onClick={handleClickStats} style={{ backgroundColor: showStats ? 'rgb(255, 0, 0)' : '' }}>{t('Parameters.Statistics.Name')}</button>
                <button className="choice" onClick={handleClickGlobal} style={{ backgroundColor: showGlobal ? 'rgb(255, 0, 0)' : '', marginBottom: 'auto' }}>{t('Parameters.Global.Name')}</button>
                <button className="choice" onClick={handleClickLanguage} style={{ backgroundColor: showLanguage ? 'rgb(255, 0, 0)' : '' }}>{t('Parameters.Languages.Name')}</button>
                <button className="choice" onClick={handleClickProfile}>{t('Parameters.Disconnect')}</button>
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
                {showLanguage && (
                    <Languages />
                )}
                {showGlobal && (
                    <Global />
                )}
            </div>
        </div>
    );
}