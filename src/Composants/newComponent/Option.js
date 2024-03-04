import React from "react";

export default function Option({name, value, innerText}){
    return(
        <option name={name} value={value}>{innerText}</option>
    );
}