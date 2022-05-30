import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DurationControl } from '../src/DurationControl';

const Tester = ({ label }) => {
  return <p>{label}</p>;
}

const DurationControlWrapper = ({ pattern, value, disabled, hideSpinner }) => {
  const [millis, setMillis] = useState(value);

  return <DurationControl
    disabled={disabled}
    hideSpinner={hideSpinner}
    pattern={pattern}
    value={millis}
    onChange={setMillis}
  />;
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/DurationControl',
  component: DurationControlWrapper
} as ComponentMeta<typeof DurationControlWrapper>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DurationControlWrapper> = (args) => <DurationControlWrapper {...args} />;

export const AllUnits = Template.bind({});
AllUnits.args = {
  pattern: "Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Millis {fff}",
  value: 0,
  disabled: false,
  hideSpinner: false
};