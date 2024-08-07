import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DurationControl } from "../src/DurationControl";

const DurationControlWrapper = ({ pattern, disabled, hideSpinner, label }) => {
	const [millis, setMillis] = useState(0);

	return (
		<div>
			<DurationControl
				disabled={disabled}
				hideSpinner={hideSpinner}
				pattern={pattern}
				label={label}
				value={millis}
				onChange={(value) => setMillis(value)}
				onUnitFocus={(unit) => console.log("Focus", unit)}
				onUnitBlur={(unit) => console.log("Blur", unit)}
			/>
			<h3>Millis</h3>
			<input
				size={60}
				type="number"
				value={millis}
				onChange={(event) => setMillis(parseInt(event.target.value))}
			></input>
		</div>
	);
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Example/DurationControl",
	component: DurationControlWrapper
} as ComponentMeta<typeof DurationControlWrapper>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DurationControlWrapper> = (args) => (
	<DurationControlWrapper {...args} />
);

export const AllUnits = Template.bind({});
AllUnits.args = {
	pattern: "Days {dd} Hours {hh} Minutes {mm} Seconds {ss} Millis {ff}",
	disabled: false,
	hideSpinner: false,
	label: ""
};
