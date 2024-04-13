import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Inscription from './Inscription';
import Connex from './Connex';
import CreationPartie from './CreationPartie'
import PageChoix from './PageChoix'
import Pagepause from './Pagepause';
import Parameters from './Parameters';
import Partie from './Partie';
import CMD from '../Composants/CMD';

function App() {
  const [showCMD, setShowCMD] = useState(false);

  useEffect(() => {
    const keyDown = (event) => {
      if (event.key == '²' && event.ctrlKey) setShowCMD(true);
    }
    document.addEventListener('keydown', keyDown);
    console.log('event added');
    return () => {
      document.removeEventListener('keydown', keyDown);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Inscription/>} />
        <Route path="/CreationPartie" element={<CreationPartie/>} />
        <Route path="/PageChoix" element={<PageChoix/>} />
        <Route path="/Connex" element={<Connex/>} />
        <Route path="/PageDeJeu" element={<Partie/>} />
        <Route path="/PagePause" element={<Pagepause/>} />
        <Route path="/Parameters" element={<Parameters/>} />
      </Routes>
      {showCMD && (
        <CMD onClick={() => {setShowCMD(false)}} />
      )}
    </>
  );
}

export default App;