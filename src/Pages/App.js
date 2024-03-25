import React from 'react';
import { Route, Routes } from "react-router-dom";
import Inscription from './Inscription';
import Connex from './Connex';
import CreationPartie from './CreationPartie'
import PageChoix from './PageChoix'
import Pagepause from './Pagepause';
import Parameters from './Parameters';
import Partie from './Partie';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Inscription/>} />
        <Route path="/CreationPartie" element={<CreationPartie/>} />
        <Route path="/PageChoix" element={<PageChoix/>} />
        <Route path="/Connex" element={<Connex/>} />
        <Route path="/PageDeJeu" element={<Partie/>} />
        <Route path="/PagePause" element={<Pagepause/>} />
        <Route path="/Parameters" element={<Parameters/>} />
      </Routes>
    </div>
  );
}

export default App;