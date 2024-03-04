import React from "react";

export default function Number({name, id, min, max, defaultvalue}){
    return (
        <input type="number" name={name} id={id} min={min} max={max} defaultValue={defaultvalue}/>
    );
}