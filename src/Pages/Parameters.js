import React, { useEffect, useState } from "react";
import Boutton from "../Composants/Boutton";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import './Parameters.css';

export default function Parameters() {

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
    const [shopTargetInfo, setShopTargetInfo] = useState(false);

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
            console.log(colors);
            setShopTitles(titles);
            setShopMoney(money);
            resetShow();
            setShowShop(true);
        }

        const updateShop = () => {
            alert("Purchase made successfully");
            setShowShopWarning(false);
            socket.emit("askShopStock", sessionStorage.getItem("pseudo"));
        }

        const informUser = (remainingMoney) => {
            alert(`You need ${remainingMoney} money in order to purchase the item`);
            setShowShopWarning(false);
        }
        socket.on("sendChatColors", sendChatColors);
        socket.on("sendChatTitles", sendChatTitles);
        socket.on("sendStats", sendStats);
        socket.on("sendShopStock", sendShopStock);
        socket.on("acceptedPurchase", updateShop);
        socket.on("deniedPurchase", informUser);
        return () => {
            socket.off("sendChatColors", sendChatColors);
            socket.off("sendChatTitles", sendChatTitles);
            socket.off("sendStats", sendStats);
            socket.off("sendShopStock", sendShopStock);
            socket.off("acceptedPurchase", updateShop);
            socket.off("deniedPurchase", informUser);
        }
    });

    function resetShow() {
        setShowColors(false);
        setShowStats(false);
        setShowTitles(false);
        setShowShop(false);
    }

    function handleClickColors() {
        socket.emit("askChatColors", sessionStorage.getItem("pseudo"));
    }

    function handleClickTitles() {
        socket.emit("askChatTitles", sessionStorage.getItem("pseudo"));
    }

    function handleClickStats() {
        socket.emit("askStats", sessionStorage.getItem("pseudo"));
    }

    function handleClickShop() {
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

    const clickBuy = () => {
        setShowShopWarning(true);
    }

    const showTargetInfo = (event) => {
        let infoTarget;
        if (shopTitles.filter(infoTitle => infoTitle.title == event.target.innerText)[0]) infoTarget = shopTitles.filter(infoTitle => infoTitle.title == event.target.innerText)[0];
        else if (shopColors.filter(infoColor => infoColor.color == event.target.innerText)[0]) infoTarget = shopColors.filter(infoColor => infoColor.color == event.target.innerText)[0];
        setShopTarget(infoTarget);
        setShopTargetInfo(true);
    }

    const leaveTargetInfo = (event) => {
        setShopTargetInfo(false);
    }

    function leave() {
        navigate("/PageChoix");
    }

    function acceptedPurchase() {
        if (shopTarget.title) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.title);
        else if (shopTarget.color) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.color);
    }

    function deniedPurchase() {
        setShowShopWarning(false);
    }

    return (
        <div className="Parameters">
            {Boutton("Chat colors", handleClickColors)}
            {Boutton("Title chat", handleClickTitles)}
            {Boutton("Statistics", handleClickStats)}
            {Boutton("Shop", handleClickShop)}
            {Boutton("Leave", leave)}
            {showColors && (
                <>
                    <div className="unlockedColors">
                        {unlockedColors.map(color => (
                            <button style={{ backgroundColor: color }} onClick={clickColor}>{color}</button>
                        ))}
                    </div>
                    <div className="lockedColors">
                        {lockedColors.map((achievement) => (
                            <div className="lockedColor" style={{ backgroundColor: achievement.color }}>
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
                            <div className="lockedTitle" style={{ backgroundColor: "white" }}>
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
                            <div className={statCategory} style={{ color: "white" }}>{statCategory}<br></br><br></br>
                                {Object.keys(stats[statCategory]).map((statName) => (
                                    <>
                                        <text style={{ color: "white" }}>{statName}: {stats[statCategory][statName]}</text>
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
                    <div style={{ color: "white" }}>Money in bank: {shopMoney}</div>
                    {showShopWarning && (
                        <>
                            {shopTarget.title && (
                                <div style={{ color: "white" }}>Purchasing {shopTarget.title} for the cost of {shopTarget.cost}</div>
                            )}
                            {shopTarget.color && (
                                <div style={{ color: "white" }}>{shopTarget.color} for the cost of {shopTarget.cost}</div>
                            )}
                            <button onClick={acceptedPurchase}>Buy item</button>
                            <button onClick={deniedPurchase}>Don't buy item</button>
                        </>
                    )}
                    {!showShopWarning && (
                        <>
                            <div className="buyableTitles">
                                {shopTitles.map(infoTitle => (
                                    <button onClick={clickBuy} onMouseEnter={showTargetInfo} onMouseLeave={leaveTargetInfo}>{infoTitle.title}</button>
                                ))}
                            </div>
                            <div className="buyableColors">
                                {shopColors.map(infoColor => (
                                    <button onClick={clickBuy} style={{ backgroundColor: infoColor.color }} onMouseEnter={showTargetInfo} onMouseLeave={leaveTargetInfo}>{infoColor.color}</button>
                                ))}
                            </div>
                            {shopTargetInfo && (
                                <div className="targetInfo" style={{ color: "white", backgroundColor: "black" }}>Cost: {shopTarget.cost}</div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}