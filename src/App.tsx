import React, { useState } from 'react';
import './App.css';

import DurationInput from 'react-duration';
import { TimeDurationInput } from 'react-time-duration-input';

import { DurationControl } from './DurationControl';

function App() {
  const [ value, setValue ] = useState(61);


  return (
    <div className="App">
      <p>DurationControl</p>
      <DurationControl 
        pattern='Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Millis {fff}'
        value={value}
        onChange={(val) => { setValue(val); console.log(val); }}/>
      <br/>

      <p>React-Duration</p>
        <DurationInput
                value={value}
                onChange={(val: any) => {setValue(val); console.log(val);}}
            />
      <br/>

      <p>TimeDurationInput</p>
      <TimeDurationInput value={value} onChange={(val: any) => {setValue(val); console.log(val);}}>
        <div></div>
      </TimeDurationInput>
    </div>
  );
}

export default App;
