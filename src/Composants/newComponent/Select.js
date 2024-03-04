import React from "react";
import Option from "./Option";

export default function Select({optionList, selectName, selectId}){
    return(
        <select id={selectId} name={selectName}>
            {optionList.map(option => {
                return <Option name={option.name} value={option.value} innerText={option.innerText}></Option>
            })}
        </select>
    );
}