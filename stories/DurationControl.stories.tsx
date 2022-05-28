import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DurationControl } from '../src/DurationControl';

const Tester = ({ label }) => {
  return <p>{label}</p>;
}

const DurationControlWrapper = ({ pattern, value }) => {
  return <DurationControl
    disabled={false}
    hideSpinner={false}
    pattern={pattern}
    value={value}
    onChange={(value) => {console.log("What do we do with this?")}}
  />;
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/DurationControl',
  component: DurationControlWrapper
} as ComponentMeta<typeof DurationControlWrapper>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DurationControlWrapper> = (args) => <DurationControlWrapper {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  pattern: "Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Millis {fff}",
  value: 0
};