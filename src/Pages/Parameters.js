import React, { useEffect, useState } from "react";
import Boutton from "../Composants/Boutton";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";

export default function Parameters(){

    const navigate = useNavigate();

    const [unlockedColors, setUnlockedColors] = useState([]);
    const [lockedColors, setLockedColors] = useState([]);
    const [showColors, setShowColors] = useState(false);

    const [unlockedTitles, setUnlockedTitles] = useState([]);
    const [lockedTitles, setLockedTitles] = useState([]);
    const [showTitles, setShowTitles] = useState(false);

    const [stats, setStats] = useState({});
    const [showStats, setShowStats] = useState(false);

    const [shopColors, setShopColors] = useState([]);
    const [shopTitles, setShopTitles] = useState([]);
    const [showShop, setShowShop] = useState(false);
    const [showShopWarning, setShowShopWarning] = useState(false);
    const [shopTarget, setShopTarget] = useState();
    const [shopMoney, setShopMoney] = useState();

    useEffect(() => {
        const sendChatColors = (locked, unlocked) => {
            setLockedColors(locked);
            setUnlockedColors(unlocked);
            resetShow();
            setShowColors(true);
        }
        const sendChatTitles = (locked, unlocked) => {
            setLockedTitles(locked);
            setUnlockedTitles(unlocked);
            resetShow();
            setShowTitles(true);
        }
        const sendStats = (stats) => {
            setStats(stats);
            resetShow();
            setShowStats(true);
        }
        const sendShopStock = (colors, titles, money) => {
            setShopColors(colors);
            setShopTitles(titles);
            setShopMoney(money);
            resetShow();
            setShowShop(true);
        }
        socket.on("sendChatColors", sendChatColors);
        socket.on("sendChatTitles", sendChatTitles);
        socket.on("sendStats", sendStats);
        socket.on("sendShopStock", sendShopStock);

        return () => {
            socket.off("sendChatColors", sendChatColors);
            socket.off("sendChatTitles", sendChatTitles);
            socket.off("sendStats", sendStats);
            socket.on("sendShopStock", sendShopStock);
        }
    });

    function resetShow(){
        setShowColors(false);
        setShowStats(false);
        setShowTitles(false);
        setShowShop(false);
    }

    function handleClickColors(){
        socket.emit("askChatColors", sessionStorage.getItem("pseudo"));
    }

    function handleClickTitles(){
        socket.emit("askChatTitles", sessionStorage.getItem("pseudo"));
    }

    function handleClickStats(){
        socket.emit("askStats", sessionStorage.getItem("pseudo"));
    }

    function handleClickShop(){
        socket.emit("askShopStock", sessionStorage.getItem("pseudo"));
    }

    const clickColor = (event) => {
        socket.emit("chooseChatColor", sessionStorage.getItem("pseudo"), event.target.innerText);
        alert(`You chose the color ${event.target.innerText}`);
    }

    const clickTitle = (event) => {
        socket.emit("chooseChatTitle", sessionStorage.getItem("pseudo"), event.target.innerText);
        alert(`You chose the title ${event.target.innerText}`);
    }

    const clickBuy = (event) => {
        let infoTarget;
        if (event.target.title) infoTarget = shopTitles.filter(infoTitle => infoTitle.title == event.target.innerText)[0];
        else if (event.target.color) infoTarget = shopColors.filter(infoColor => infoColor.color == event.target.innerText)[0];
        setShopTarget(infoTarget);
        setShowShopWarning(true);
    }

    function leave(){
        navigate("/PageChoix");
    }

    function acceptedPurchase(){
        if (shopTarget.title) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.title);
        else if (shopTarget.color) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.color);
    }

    function deniedPurchase(){
        setShowShopWarning(false);
        setShopTarget();
    }

    return (
        <>
            {Boutton("Chat colors", handleClickColors)}
            {Boutton("Title chat", handleClickTitles)}
            {Boutton("Statistics", handleClickStats)}
            {Boutton("Shop", handleClickShop)}
            {Boutton("Leave", leave)}
            {showColors && (
                <>
                <div className="unlockedColors">
                    {unlockedColors.map(color => (
                        <button style={{backgroundColor: color}} onClick={clickColor}>{color}</button>
                    ))}
                </div>
                <div className="lockedColors">
                    {lockedColors.map((achievement) => (
                        <div className="lockedColor" style={{backgroundColor: achievement.color}}>
                            <text>{`${achievement.name}(${achievement.description})\nDifficulty: ${achievement.difficulty}`}</text>
                        </div>
                    ))}
                </div>
            </>
            )}
            {showTitles && (
                <>
                    <div className="unlockedTitles">
                        {unlockedTitles.map(title => (
                            <button onClick={clickTitle}>{title}</button>
                        ))}
                    </div>
                    <div className="lockedTitles">
                        {lockedTitles.map((achievement) => (
                            <div className="lockedTitle" style={{backgroundColor: "white"}}>
                                <text>{`[${achievement.title}] ${achievement.name}(${achievement.description})\nDifficulty: ${achievement.difficulty}`}</text>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {showStats && (
                <>
                    <div className="statistics">
                        {Object.keys(stats).map((statCategory) => (
                            <div className={statCategory} style={{color: "white"}}>{statCategory}<br></br><br></br>
                                {Object.keys(stats[statCategory]).map((statName) => (
                                    <>
                                        <text style={{color: "white"}}>{statName}: {stats[statCategory][statName]}</text>
                                        <br></br>
                                    </>
                                ))}
                                <br></br>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {showShop && (
                <>
                    <div>{shopMoney}</div>
                    {showShopWarning && (
                        <>
                            {shopTarget.title && (
                                <div>{shopTarget.title}</div>
                            )}
                            {shopTarget.color && (
                                <div>{shopTarget.color}</div>
                            )}
                            <button onClick={acceptedPurchase}>Buy item</button>
                            <button onClick={deniedPurchase}>Don't buy item</button>
                        </>
                    )}
                    <div className="buyableTitles">
                        {shopTitles.map(infoTitle => (
                            <button onClick={clickBuy}>{infoTitle.title}</button>
                        ))}
                    </div>
                    <div className="buyableColors">

                    </div>
                </>
            )}
        </>
    );
}