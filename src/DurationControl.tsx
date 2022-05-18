import * as React from "react";

import "./DurationControl.css";

import { DurationControlUnitInput, DurationUnitType } from "./DurationControlUnitInput";
import { DurationControlInlineText } from "./DurationControlInlineText";
import { Spinner } from "./Spinner";

type DurationControlUnitValues = { [key in DurationUnitType]?: number }; 

type DurationControlUnit = {
	type: DurationUnitType;
	characters: number;
	value: number | null;
};

type DurationControlElement = DurationControlUnit | string;

/**
 * The DurationControl component props.
 */
export type DurationControlProps = {
	/** The pattern. */
    pattern: string; 

	/** The value in milliseconds. */
	value: number;

	onChange: (value: number) => void;
};

/**
 * The DurationControl component state.
 */
export type DurationControlState = {
	/** The pattern. */
	pattern: string; 

	/** The duration control elements. */
    elements: DurationControlElement[];

	/** The current value in milliseconds. */
	milliseconds: number;

	/** The last unit input to have focus. */
	lastFocusedInputUnitType: DurationUnitType | null;
};

/**
 * The DurationControl component.
 */
export class DurationControl extends React.Component<DurationControlProps, DurationControlState> {
	/** The mapping of time units to millisecond multipliers. */
	private static UNIT_MILLISECOND_MULTIPLIERS: { [key in DurationUnitType]: number } = {
		day: 86400000,
		hour: 3600000,
		minute: 60000,
		second: 1000,
		millisecond: 1
	};

	/**
	 * Creates the DurationControl element.
	 * @param props The control properties.
	 */
	public constructor(props: DurationControlProps) {
		super(props);

		const { pattern, value } = this.props;

		// Parse the pattern into some unit and string elements.
		const elements = DurationControl._parseElementsFromPattern(pattern);
		
		// Apply our initial value to the elements.
		DurationControl._spreadMillisAcrossUnitElements(value, elements);

		// TODO Default 'lastFocusedInputUnitType' to the unit element type with the smallest multiplier.

		// Set the initial state for the component.
		this.state = { pattern, elements, milliseconds: value, lastFocusedInputUnitType: null };

		this._onUnitValueChange = this._onUnitValueChange.bind(this);
		this._onUnitInputFocus = this._onUnitInputFocus.bind(this);
		this._onSpinnerButtonClick = this._onSpinnerButtonClick.bind(this);
	}

	public static getDerivedStateFromProps(nextProps: DurationControlProps, prevState: DurationControlState) {
		if (nextProps.value === prevState.milliseconds && nextProps.pattern === prevState.pattern) {
			return null;
		}

		// Parse the pattern into some unit and string elements.
		const elements = DurationControl._parseElementsFromPattern(nextProps.pattern);
		
		// Apply our initial value to the elements.
		DurationControl._spreadMillisAcrossUnitElements(nextProps.value, elements);

		// Set the initial state for the component.
		return { 
			pattern: nextProps.pattern, 
			elements, 
			milliseconds: nextProps.value,
			lastFocusedInputUnitType: null
		};
	}
	
	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		return (
            <div className="react-duration-control">
                <div className="control-wrapper" onBlur={() => console.log("BLUR")}>
                    <div className="elements-container">
						{this.state.elements.map(((element, index) => (
							typeof element === "string" ? (
								<DurationControlInlineText key={index} value={element} />
							) : (
								<DurationControlUnitInput 
									key={element.type} 
									type={element.type} 
									characterLength={element.characters} 
									value={element.value} 
									onChange={(value) => this._onUnitValueChange(element.type, value)}
									onFocus={() => this._onUnitInputFocus(element.type)}
								/>
							)
						)))}
                    </div>
                    <Spinner
						onUpButtonPress={() => this._onSpinnerButtonClick(true)}
						onDownButtonPress={() => this._onSpinnerButtonClick(false)}
					/>
                </div>
            </div>
        );
	}

	/**
	 * Handles the value changing for the specified unit duration type.
	 * @param type The unit input type.
	 * @param value The new value.
	 */
	private _onUnitValueChange(type: DurationUnitType, value: number | null): void {	
		// Get a copy of our elements array.
		const elements = this.state.elements.slice();

		// Find the unit that matches the updated unit.
		const unitElement = elements.find((element) => typeof element !== "string" && element.type === type) as DurationControlUnit;

		// There is nothing to do if the new value matches our old value.
		if (unitElement.value === value) {
			return;
		}

		// Get the previous and new unit values in millis.
		const previousUnitValueMillis = unitElement.value === null ? 0 : unitElement.value * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[type];
		const newUnitValueMillis      = value === null ? 0 : value * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[type];

		// Work out the difference between the new and previous unit values in millis.
		const unitValueMillisDifference = newUnitValueMillis - previousUnitValueMillis;

		const updatedMilliseconds = this.state.milliseconds + unitValueMillisDifference;

		console.log({ previousUnitValueMillis, newUnitValueMillis, unitValueMillisDifference, updatedMilliseconds });

		// Update the unit value.
		unitElement.value = value;
		
		this.setState({ elements, milliseconds: updatedMilliseconds });

		// Call our 'onChange' callback, but only if the milliseconds value has actually changed.
		if (unitValueMillisDifference) {
			this.props.onChange(updatedMilliseconds);
		}
	}

	/**
	 * Handles a unit input element getting focus.
	 * @param type The focused unit input type.
	 */
	private _onUnitInputFocus(type: DurationUnitType): void {	
		this.setState({ lastFocusedInputUnitType: type });
	}

	/**
	 * Handles a spinner button being clicked.
	 * @param wasUpPressed Whether the 'up' spinner button was pressed, rather than the 'down' button.
	 */
	private _onSpinnerButtonClick(wasUpPressed: boolean): void {
		if (!this.state.lastFocusedInputUnitType) {
			return;
		}

		// Find the unit that matches the updated unit.
		const unitElement = this.state.elements.find((element) => typeof element !== "string" && element.type === this.state.lastFocusedInputUnitType) as DurationControlUnit;

		let updatedUnitValue;
		
		if (wasUpPressed) {
			updatedUnitValue = (unitElement.value || 0) + 1;
		} else {
			updatedUnitValue = (unitElement.value || 0) - 1;
		}

		this._onUnitValueChange(this.state.lastFocusedInputUnitType, updatedUnitValue);
	}

	/**
	 * Takes a time value in milliseconds and spreads the value across all available unit elements.
	 * @param millis The milliseconds value to spread across the unit elements.
	 * @param elements The control elements.
	 */
	private static _spreadMillisAcrossUnitElements(millis: number, elements: DurationControlElement[]): void {
		// A function to get the unit element with the specified duration unit type.
		const getUnitElement = (type: DurationUnitType) => elements.find((element) => typeof element !== "string" && element.type === type) as DurationControlUnit;

		const unitTypeArray: DurationUnitType[] = ["day", "hour", "minute", "second", "millisecond"];

		let remainingMillis = millis;

		unitTypeArray.forEach((unitType) => {
			// Try to get the unit element for the current type.
			const unitElement = getUnitElement(unitType);

			// We may not have the element for the current unit.
			if (!unitElement) {
				return;
			}

			// Convert the remaining millis to the current unit.
			const unitValue = remainingMillis / DurationControl.UNIT_MILLISECOND_MULTIPLIERS[unitType];

			if (unitValue >= 1) {
				// Get the truncated unit value.
				const truncatedUnitValue = Math.trunc(unitValue);

				// Apply the unit value.
				unitElement.value = truncatedUnitValue;

				// Update the remaining millis.
				remainingMillis -= truncatedUnitValue * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[unitType];
			}
		})
	}

	/**
	 * Parse an array of duration control elements, either strings or unit input definitions, from the given pattern.
	 * @param pattern The patterp to parse the elments from.
	 * @returns An array of duration control elements, either strings or unit input definitions.
	 */
	private static _parseElementsFromPattern(pattern: string): DurationControlElement[] {
		const patternRegex = /(\{d+\}|\{h+\}|\{m+\}|\{s+\}|\{f+\})/g;
		const dayUnitRegex = /^{(d+)}$/g;
		const hourUnitRegex = /^{(h+)}$/g;
		const minuteUnitRegex = /^{(m+)}$/g;
		const secondUnitRegex = /^{(s+)}$/g;
		const millisecondUnitRegex = /^{(f+)}$/g;

		const elements = pattern
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

			// TODO Double check that we don't have duplicate unit types.
			// ["day","hour","minute","second","millisecond"].forEach((unit) => {});

		return elements;
	}
}