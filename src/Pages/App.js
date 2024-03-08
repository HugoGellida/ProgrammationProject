import React from 'react';
import { Route, Routes } from "react-router-dom";
import Inscription from './Inscription';
import Connex from './Connex';
import CreationPartie from './CreationPartie'
import PageChoix from './PageChoix'
import PageDeJeu from './PageDeJeu'
import PageScores from './PageScores'
import Pagepause from './Pagepause';
import Take6Opponent from '../Composants/ComponentTest/Take6Opponent';
import Parameters from './Parameters';

function App() {
  
  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<Inscription/>} />
        <Route path="/CreationPartie" element={<CreationPartie/>} />
        <Route path="/PageChoix" element={<PageChoix/>} />
        <Route path="/Connex" element={<Connex/>} />
        <Route path="/PageDeJeu" element={<PageDeJeu/>} />
        <Route path="/PageScores" element={<PageScores/>} />
        <Route path="/PagePause" element={<Pagepause/>} />
        <Route path="/Test" element={<Take6Opponent information={{username: "test", pointAmount: 0}}/>} />
        <Route path="/Parameters" element={<Parameters/>} />
      </Routes>
    </div>
  );
}

export default App;