import React from "react";

export default function Trieur() {
  return (
    <select className="Select" id="Select">
      <option value="">Sélectionner un type de partie</option>
      <option value="jeu-de-bataille">Jeu de Bataille</option>
      <option value="6-qui-prend">6-qui-prend</option>
      <option value="crazy8">crazy8</option>
    </select>
  );
}