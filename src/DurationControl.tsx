import * as React from "react";

import { DurationControlUnit, DurationControlUnitProps } from "./DurationControlUnit";
import { Spinner } from "./Spinner";

import "./DurationControl.css";
import { DurationControlInlineText } from "./DurationControlInlineText";

/**
 * The DurationControl component props.
 */
export type DurationControlProps = React.PropsWithChildren<{
    pattern: string; 

	value: number;

	onChange: (value: number) => void;
}>;

/**
 * The DurationControl component state.
 */
export type DurationControlState = {
    value: number; 
};

/**
 * The DurationControl component.
 */
export class DurationControl extends React.Component<DurationControlProps, DurationControlState> {
	/**
	 * Creates the DurationControl element.
	 * @param props The control properties.
	 */
	public constructor(props: DurationControlProps) {
		super(props);

		// Set the initial state for the component.
		this.state = { value: props.value };
	}

	/**
	 * Called when the component is mounted.
	 */
	public componentDidMount(): void {

	}

	/**
	 * Called when the component is about to be unmounted.
	 */
	public componentWillUnmount(): void {

	}

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		return (
            <div className="react-duration-control">
                <div className="control-wrapper">
                    <div className="elements-container">
						<DurationControlInlineText value="Hrs "/>
						<DurationControlUnit type="hour" characterLength={3} value={this.state.value} onChange={(value) => this.setState({ value })}></DurationControlUnit>
						<DurationControlInlineText value=" Mns "/>
						<DurationControlUnit type="minute" characterLength={3} value={this.state.value} onChange={(value) => this.setState({ value })}></DurationControlUnit>
                    </div>
                    <Spinner />
                </div>
            </div>
        );
	}
}