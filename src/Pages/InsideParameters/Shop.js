import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { socket } from "../socket";
import "./Shop.css";

export default function Shop() {
    const [showShopWarning, setShowShopWarning] = useState(false);
    const [shopTarget, setShopTarget] = useState();
    const [shopMoney, setShopMoney] = useState();
    const [shopColors, setShopColors] = useState([]);
    const [shopTitles, setShopTitles] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        const updateShop = () => {
            alert(t('Parameters.Shop.PurchaseAccepted'));
            setShowShopWarning(false);
            setShopTarget();
            socket.emit("askShopStock", sessionStorage.getItem("pseudo"));
        }

        const informUser = (remainingMoney) => {
            alert(t('Parameters.Shop.PurchaseDeclined', {money: remainingMoney, item: shopTarget.title? t(`Parameters.Titles.${shopTarget.title}.Price`): t(`Parameters.Colors.${shopTarget.color}.Price`)}));
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
        return () => {
            socket.off("sendShopStock", sendShopStock);
            socket.off("acceptedPurchase", updateShop);
            socket.off("deniedPurchase", informUser);
        }
    });

    useEffect(() => {
        socket.emit("askShopStock", sessionStorage.getItem('pseudo'));
    }, []);

    const clickBuy = () => {
        setShowShopWarning(true);
    }

    function acceptedPurchase() {
        console.log(shopTarget);
        if (shopTarget.title) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.title);
        else if (shopTarget.color) socket.emit("purchaseAttempt", sessionStorage.getItem("pseudo"), shopTarget.color);
    }

    function deniedPurchase() {
        setShowShopWarning(false);
        setShopTarget();
    }

    return (
        <>
            <div className="moneyAmount" style={{ color: "white" }}>{t('Parameters.Shop.Bank')} {shopMoney}</div>
            {showShopWarning && (
                <div className="shopWarning">
                    {shopTarget && (
                        <div style={{ color: "white", marginTop: 'auto', marginBottom: 'auto' }}>{`${shopTarget.title? t(`Parameters.Titles.${shopTarget.title}.Price`): t(`Parameters.Colors.${shopTarget.color}.Price`)}: ${t(`Parameters.Shop.Warning`)} ${shopTarget.cost}?`}</div>
                    )}
                    <button className="buyItem" onClick={acceptedPurchase}>✓</button>
                    <button className="dontBuyItem" onClick={deniedPurchase} style={{ marginBottom: 'auto', border: "2px inset red" }}>X</button>
                </div>
            )}
            <div className="buyables">
                <div className="buyableTitles">
                    {shopTitles.map(infoTitle => (
                        <button className="buyableTitle" onClick={clickBuy} onMouseEnter={!showShopWarning ? () => { setShopTarget(infoTitle) } : null} onMouseLeave={!showShopWarning ? () => { setShopTarget() } : null}>{t(`Parameters.Titles.${infoTitle.title}.Price`)}</button>
                    ))}
                </div>
                <div className="buyableColors">
                    {shopColors.map(infoColor => (
                        <button className="buyableColor" onClick={clickBuy} style={{ backgroundColor: shopTarget == infoColor ? infoColor.color : "black",border: `2px inset ${infoColor.color}`, color: shopTarget == infoColor ? "black" : "white" }} onMouseEnter={!showShopWarning ? () => { setShopTarget(infoColor) } : null} onMouseLeave={!showShopWarning ? () => { setShopTarget() } : null}>{t(`Parameters.Colors.${infoColor.color}.Price`)}</button>
                    ))}
                </div>
                {shopTarget && (
                    <div className="shopInfo" style={{ color: "white", backgroundColor: "black" }}>{t('Parameters.Shop.Cost')}: {shopTarget.cost}</div>
                )}
            </div>
        </>
    )
}