import * as React from "react";

import "./DurationControl.css";

import { DurationControlUnitInput, DurationUnitType } from "./DurationControlUnitInput";
import { DurationControlInlineText } from "./DurationControlInlineText";
import { Spinner } from "./Spinner";
import { clamp } from "./Utilities";

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

		// Default 'lastFocusedInputUnitType' to the unit element type with the smallest multiplier.
		const lastFocusedInputUnitType = DurationControl._getSmallestUnitElementType(elements);

		// Set the initial state for the component.
		this.state = { pattern, elements, milliseconds: value, lastFocusedInputUnitType };

		this._updateUnitValue = this._updateUnitValue.bind(this);
		this._onUnitInputFocus = this._onUnitInputFocus.bind(this);
		this._incrementOrDecrementUnitValue = this._incrementOrDecrementUnitValue.bind(this);
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
			lastFocusedInputUnitType: DurationControl._getSmallestUnitElementType(elements)
		};
	}
	
	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		return (
            <div className="react-duration-control">
                <div className="control-wrapper">
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
									onChange={(value) => this._updateUnitValue(element.type, value)}
									onUpArrowKeyPress={() => this._incrementOrDecrementUnitValue(element.type, true)}
									onDownArrowKeyPress={() => this._incrementOrDecrementUnitValue(element.type, false)}
									onFocus={() => this._onUnitInputFocus(element.type)}
								/>
							)
						)))}
                    </div>
                    <Spinner
						onUpButtonPress={() => this._incrementOrDecrementUnitValue(this.state.lastFocusedInputUnitType, true)}
						onDownButtonPress={() => this._incrementOrDecrementUnitValue(this.state.lastFocusedInputUnitType, false)}
					/>
                </div>
            </div>
        );
	}

	/**
	 * Updates the value for the specified unit duration type.
	 * @param type The unit input type.
	 * @param value The new value.
	 */
	private _updateUnitValue(type: DurationUnitType, value: number | null): void {	
		// Get a copy of our elements array.
		const elements = this.state.elements.slice();

		// Find the unit that matches the updated unit.
		const unitElement = elements.find((element) => typeof element !== "string" && element.type === type) as DurationControlUnit;

		// Clamp the new value between zero and the maximum value defined by the unit character limit.
		// e.g. If we had a unit character limit of 2 then our value would be clamped between 0 and 99.
		const clampedValue = clamp(value, 0, Math.pow(10, unitElement.characters) - 1);

		// There is nothing to do if the new value matches our old value.
		if (unitElement.value === clampedValue) {
			return;
		}

		// Get the previous and new unit values in millis.
		const previousUnitValueMillis = unitElement.value === null ? 0 : unitElement.value * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[type];
		const newUnitValueMillis      = clampedValue === null ? 0 : clampedValue * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[type];

		// Work out the difference between the new and previous unit values in millis.
		const unitValueMillisDifference = newUnitValueMillis - previousUnitValueMillis;

		const updatedMilliseconds = this.state.milliseconds + unitValueMillisDifference;

		// Update the unit value.
		unitElement.value = clampedValue;
		
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
	 * Increments or decrements the current value for the specified unit.
	 * @param isIncrement Whether the the value should be incremented rather than decremeneted.
	 */
	private _incrementOrDecrementUnitValue(unitType: DurationUnitType | null, isIncrement: boolean): void {
		if (!unitType) {
			return;
		}

		// Find the unit that matches the updated unit.
		const unitElement = this.state.elements.find((element) => typeof element !== "string" && element.type === unitType) as DurationControlUnit;

		let updatedUnitValue;
		
		if (isIncrement) {
			updatedUnitValue = (unitElement.value || 0) + 1;
		} else {
			// Get the decremented unit value, but make sure we do not go lower than zero.
			updatedUnitValue = (unitElement.value || 0) - 1;
		}

		this._updateUnitValue(unitType, updatedUnitValue);
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

				// TODO Restrict truncatedUnitValue to the max value.

				// Apply the unit value.
				unitElement.value = truncatedUnitValue;

				// Update the remaining millis.
				remainingMillis -= truncatedUnitValue * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[unitType];
			}
		})
	}

	/**
	 * Gets the type of the smallest unit element present in the specified elements array.
	 * @param elements The control elements array.
	 * @returns The type of the smallest unit element present in the specified elements array.
	 */
	private static _getSmallestUnitElementType(elements: DurationControlElement[]): DurationUnitType | null {
		// Get an array of all possible element unit types ordered by size ascending.
		const unitsAscending: DurationUnitType[] = ["millisecond", "second", "minute", "hour", "day"];

		for (const unit of unitsAscending) {
			if (!!elements.find((element) => typeof element !== "string" && element.type === unit)) {
				return unit;
			}
		}

		return null;	
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