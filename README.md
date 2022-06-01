# react-duration-control

A time duration input component that allows the user to define a duration in days, hours, minutes, seconds and milliseconds. 

## Install

```sh
$ npm install react-duration-control
```

## Usage

```tsx
import DurationControl from "react-duration-control";

import "react-duration-control/dist/react-duration-control.css";

const [millis, setMillis] = useState(0);

<DurationControl 
    pattern={"Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Milliseconds {ff}"} 
    value={millis} 
    onChange={setMillis}
/>
```