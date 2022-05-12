import * as React from "react";

import "./DurationControl.css";

import { DurationControlUnit, DurationControlUnitProps, DurationUnitType } from "./DurationControlUnit";
import { DurationControlInlineText } from "./DurationControlInlineText";
import { Spinner } from "./Spinner";

/**
 * The duration control unit values type.
 */
type DurationControlUnitValues = { [key in DurationUnitType]?: number }; 

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
	/** The duration control unit values. */
    values: DurationControlUnitValues;
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
		// TODO Should the statue include info about the parsed pattern?????
		// e.g. this.state = { units:[{ unit:"hour", value: 0}] }
		this.state = {
			values: this._convertMillisToUnitValues(this.props.value || 0)
		};
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

	private _convertMillisToUnitValues(millis: number): DurationControlUnitValues {
		// TODO Should this take the units that are includeed as part of the pattern?
		// There is no reason to convert our millis to values for units that we are not even showing inputs for.

		return  {
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		};
	}
}