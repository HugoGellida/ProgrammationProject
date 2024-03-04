import "./Tchat.css";
import { socket } from "./../Pages/socket.js";
import Boutton from './Boutton.js'
export default function Tchat(Fonction) {

    return (
        <div className="tchat">
            <div id="Message"></div>
            <input id="message" type="text" placeholder="Ecrivez votre Message..." required />
            {Boutton("Envoyer", Fonction)}

        </div>
    )
}


