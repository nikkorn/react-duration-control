import React, { useState } from 'react';
import './App.css';

import DurationInput from 'react-duration';
import { TimeDurationInput } from 'react-time-duration-input';

import { DurationControl } from './DurationControl';

function App() {
  const [ millis, setMillis ] = useState(60000);

  return (
    <div className="App">
      <DurationControl 
        pattern='Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Millis {fff}'
        value={millis}
        onChange={(value) => {
          console.log(`millis: ${value}`);
          setMillis(value);
        }}/>

      <br/>

      <input
          type="number"
          value={millis}
          onChange={(event) => setMillis(parseInt(event.target.value))}>
      </input>
    </div>
  );
}

export default App;
