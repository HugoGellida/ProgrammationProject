import { useState } from "react"
import { socket } from "../Pages/socket";
import { changeLanguage } from "i18next";



export default function CMD({ onClick }) {
    const [currentCMD, setCurrentCMD] = useState('');
    const [showAll, setShowAll] = useState(false);
    const cmds = {
        args2: {
            setMoney: ':sM',
            setWinWar: ':sWW',
            setWinTake6: ':sWT6',
            setWinCrazy8: ':sWC8',
            buyItem: ':bi'
        },
        args1: {
            changeLanguage: ':clg'
        },
        argsAll: {
            help: ':h'
        }
    }

    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            const args = currentCMD.split(' ');
            if (Object.values(cmds['args2']).includes(args[0])) socket.emit('cmdDev', ...args);
            else if (args[0] == ':clg') changeLanguage(args[1]);
            else if (args[0] == ':h') setShowAll(true);
            setCurrentCMD('');
        }
    }


    return (
        <div style={{ zIndex: '1', position: 'absolute', backgroundColor: 'black', color: 'green', width: '100%', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {showAll && (
                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {Object.keys(cmds).map((cmdNbArgs) => {
                        return Object.keys(cmds[cmdNbArgs]).map((cmdDesc) => {
                            return (<label className="simpleText" style={{ color: 'green', textShadow: 'inherit' }}>{cmdDesc}: {cmds[cmdNbArgs][cmdDesc]} {cmdNbArgs === 'args2' || cmdNbArgs === 'args1'? '<username>': ''} {cmdNbArgs === 'args2'? '<value>': ''}</label>);
                        });
                    })}
                </div>
            )}
            <input type="text" placeholder="Type :h for help" className="cmd" style={{ color: 'green' }} onChange={(event) => { setCurrentCMD(event.target.value) }} value={currentCMD} onKeyDown={handleKeyDown}></input>
            <button onClick={onClick}>Exit</button>
        </div>
    )
}