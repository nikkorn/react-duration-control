import * as React from "react";

import "./DurationControl.css";

import { DurationControlUnitInput, DurationUnitType } from "./DurationControlUnitInput";
import { DurationControlInlineText } from "./DurationControlInlineText";
import { Spinner } from "./Spinner";

type DurationControlUnitValues = { [key in DurationUnitType]?: number }; 

type DurationControlUnit = {
	type: DurationUnitType;
	characters: number;
	value: number;
};

type DurationControlElement = DurationControlUnit | string;

/**
 * The DurationControl component props.
 */
export type DurationControlProps = {
    pattern: string; 

	value: number;

	onChange: (value: number) => void;
};

/**
 * The DurationControl component state.
 */
export type DurationControlState = {
	/** The duration control elements. */
    elements: DurationControlElement[];
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
		this.state = {
			elements: DurationControl._parseElementsFromPattern(props.pattern)
		};

		this._onUnitValueChange = this._onUnitValueChange.bind(this);
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
						{this.state.elements.map((element => (
							typeof element === "string" ? (
								<DurationControlInlineText value={element} />
							) : (
								<DurationControlUnitInput type={element.type} characterLength={element.characters} value={element.value} onChange={(value) => this._onUnitValueChange(element.type, value)}></DurationControlUnitInput>
							)
						)))}
                    </div>
                    <Spinner />
                </div>
            </div>
        );
	}

	private _onUnitValueChange(type: DurationUnitType, value: number): void {
		console.log("VALUE: " + value);		
		const elements = this.state.elements.slice();
		const unitElement = elements.find((element) => typeof element !== "string" && element.type === type) as DurationControlUnit;
		if (unitElement.value !== value) {
			unitElement.value = value;
			this.setState({ elements })
		}
	}

	private static _parseElementsFromPattern(pattern: string): DurationControlElement[] {
		const patternRegex = /(\{d+\}|\{h+\}|\{m+\}|\{s+\}|\{f+\})/g;
		const dayUnitRegex = /^{(d+)}$/g;
		const hourUnitRegex = /^{(h+)}$/g;
		const minuteUnitRegex = /^{(m+)}$/g;
		const secondUnitRegex = /^{(s+)}$/g;
		const millisecondUnitRegex = /^{(f+)}$/g;

		return pattern
			.split(patternRegex)
			.reduce<DurationControlElement[]>((previous, current) => {
				if (!current) {
					return previous;
				}
			
				if ((current).match(dayUnitRegex)) {
					return [...previous, { type: "day", characters: current.length - 2, value: 0 }]; 
				} else if ((current).match(hourUnitRegex)) {
					return [...previous, { type: "hour", characters: current.length - 2, value: 0 }]; 
				} else if ((current).match(minuteUnitRegex)) {
					return [...previous, { type: "minute", characters: current.length - 2, value: 0 }]; 
				} else if ((current).match(secondUnitRegex)) {
					return [...previous, { type: "second", characters: current.length - 2, value: 0 }]; 
				} else if ((current).match(millisecondUnitRegex)) {
					return [...previous, { type: "millisecond", characters: current.length - 2, value: 0 }]; 
				}
			
				return [...previous, current]; 
			}, []);
	}

	private static _convertMillisToUnitValues(millis: number): DurationControlUnitValues {
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