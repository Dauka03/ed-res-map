import React from 'react';
import './App.css';
import MapCanvas from './MapCanvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Interactive Map</h1>
      <MapCanvas />
    </div>
  );
};

export default App;
