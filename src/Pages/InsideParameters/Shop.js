import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./Shop.css";

export default function Shop() {
    const [showShopWarning, setShowShopWarning] = useState(false);
    const [shopTarget, setShopTarget] = useState();
    const [shopMoney, setShopMoney] = useState();
    const [shopColors, setShopColors] = useState([]);
    const [shopTitles, setShopTitles] = useState([]);
    useEffect(() => {
        const updateShop = () => {
            alert("Purchase made successfully");
            setShowShopWarning(false);
            setShopTarget();
            socket.emit("askShopStock", sessionStorage.getItem("pseudo"));
        }

        const informUser = (remainingMoney) => {
            alert(`You need ${remainingMoney} money in order to purchase the item`);
            setShowShopWarning(false);
            setShopTarget();
        }

        const sendShopStock = (colors, titles, money) => {
            setShopColors(colors);
            setShopTitles(titles);
            setShopMoney(money);
        }

        socket.on("sendShopStock", sendShopStock);
        socket.on("acceptedPurchase", updateShop);
        socket.on("deniedPurchase", informUser);
        socket.emit("askShopStock", sessionStorage.getItem('pseudo'));
        return () => {
            socket.off("sendShopStock", sendShopStock);
            socket.off("acceptedPurchase", updateShop);
            socket.off("deniedPurchase", informUser);
        }
    }, []);

    const clickBuy = () => {
        setShowShopWarning(true);
    }

    function acceptedPurchase() {
        if (shopTarget.title) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.title);
        else if (shopTarget.color) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.color);
    }

    function deniedPurchase() {
        setShowShopWarning(false);
        setShopTarget();
    }

    return (
        <>
            <div className="moneyAmount" style={{ color: "white" }}>Money in bank: {shopMoney}</div>
            {showShopWarning && (
                <div className="shopWarning">
                    {shopTarget.title && (
                        <div style={{ color: "white", marginTop: 'auto', marginBottom: 'auto' }}>Purchasing {shopTarget.title} for the cost of {shopTarget.cost}</div>
                    )}
                    {shopTarget.color && (
                        <div style={{ color: "white", marginTop: 'auto', marginBottom: 'auto' }}>Purchasing {shopTarget.color} for the cost of {shopTarget.cost}</div>
                    )}
                    <button className="buyItem" onClick={acceptedPurchase}>Buy item</button>
                    <button className="dontBuyItem" onClick={deniedPurchase} style={{ marginBottom: 'auto', border: "2px inset red" }}>Don't buy item</button>
                </div>
            )}
            <div className="buyables">
                <div className="buyableTitles">
                    {shopTitles.map(infoTitle => (
                        <button className="buyableTitle" onClick={clickBuy} style={{ backgroundColor: shopTarget == infoTitle? "rgb(60, 60, 60)": "black" }} onMouseEnter={!showShopWarning ? () => {setShopTarget(infoTitle)} : null} onMouseLeave={!showShopWarning ? () => {setShopTarget()} : null}>{infoTitle.title}</button>
                    ))}
                </div>
                <div className="buyableColors">
                    {shopColors.map(infoColor => (
                        <button className="buyableColor" onClick={clickBuy} style={{ backgroundColor: shopTarget == infoColor? infoColor.color: "black", color: shopTarget == infoColor? "black": "white" }} onMouseEnter={!showShopWarning ? () => {setShopTarget(infoColor)} : null} onMouseLeave={!showShopWarning ? () => {setShopTarget()} : null}>{infoColor.color}</button>
                    ))}
                </div>
                {shopTarget && (
                    <div className="shopInfo" style={{ color: "white", backgroundColor: "black" }}>Cost: {shopTarget.cost}</div>
                )}
            </div>
        </>
    )
}