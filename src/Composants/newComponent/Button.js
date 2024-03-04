import React from "react";



export default function Button({name, id, innerText, functionCalled}){
    return(
        <button id={id} name={name} onClick={functionCalled} >{innerText}</button>
    );
}