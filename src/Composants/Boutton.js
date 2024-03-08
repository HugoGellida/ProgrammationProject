import "./Boutton.css" ;

export default function Boutton(Contenu,NomFonction){
    return(
        <button id="Btn" onClick={() => NomFonction(Contenu)} >{Contenu} </button>
    );
}