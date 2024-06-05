import './App.css';
import axios from 'axios'
import React, { useEffect, useState } from 'react';

function App() {
  
  const [appState, setAppState] = useState();
  
  useEffect(() => {
    const apiUrl = 'http://localhost:4000/test';
    axios.get(apiUrl).then((resp) => {
      const allPersons = resp.data;
      setAppState(allPersons);
    });
  }, [setAppState]);

 
  return (
    <div className="app">
    </div>
  );
}

export default App;