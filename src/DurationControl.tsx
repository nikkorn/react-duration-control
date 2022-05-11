import * as React from "react";

import { DurationControlUnit, DurationControlUnitProps } from "./DurationControlUnit";
import { Spinner } from "./Spinner";

import "./DurationControl.css";

export type DurationControlProps = React.PropsWithChildren<{
    pattern: string; 

	value: number;
}>;

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
						<span style={{ whiteSpace: "pre" }}>Hours </span>
						<input style={{ width: "3em" }} type="text" maxLength={3} value={this.state.value} onChange={(event) => this.setState({ value: parseInt(event.target.value) })} />
						<span style={{ whiteSpace: "pre" }}> Minutes </span>
						<input type="text" maxLength={3} value={this.state.value} onChange={(event) => this.setState({ value: parseInt(event.target.value) })} />
                    </div>
                    <Spinner />
                </div>
            </div>
        );
	}
}