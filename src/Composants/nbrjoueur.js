import './nbrjoueur.css'
export default function nbrjoueur(){
    return(
        <input
        type="number"
        id="nbrjoueur"
        min="2"
        max="10"
        defaultValue={2}
        required
        />
    )
}