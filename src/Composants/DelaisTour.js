import './DelaisTour.css'
export default function nbrjoueur(){
    return(
        <input
        type="number"
        id="DelaisTour"
        min="5"
        max="30"
        defaultValue={5}
        required
        />
    )
}