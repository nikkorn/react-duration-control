import React, { useState } from 'react';
import './App.css';

import { DurationControl } from './DurationControl';

function App() {
  const [ pattern, setPattern ] = useState('Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Millis {fff}');
  const [ millis, setMillis ] = useState(60000);

  return (
    <div className="App">
      <DurationControl
        dMax={10}
        disabled={false}
        hideSpinner={false}
        pattern={pattern}
        value={millis}
        onChange={(value) => setMillis(value)}/>

      <h3>Pattern</h3>
      <input
        size={60}
        type="text"
        value={pattern}
        onChange={(event) => setPattern(event.target.value)}>
      </input>

      <h3>Millis</h3>
      <input
        size={60}
        type="number"
        value={millis}
        onChange={(event) => setMillis(parseInt(event.target.value))}>
      </input>
    </div>
  );
}

export default App;
