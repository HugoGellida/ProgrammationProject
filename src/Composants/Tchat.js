import "./Tchat.css";
import { socket } from "./../Pages/socket.js";
import Boutton from './Boutton.js'
export default function Tchat(Fonction) {

    const handleKeyDown = (event) => {
        if (event.key == "Enter") Fonction();
    }

    return (
        <div className="tchat">
            <div id="Message"></div>
            <input id="message" type="text" placeholder="Ecrivez votre Message..." onKeyDown={handleKeyDown}/>
            {Boutton("▸", Fonction)}
        </div>
    )
}


