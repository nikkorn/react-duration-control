import * as React from "react";

import "./DurationControl.css";

import { DurationControlUnitInput, DurationUnitType } from "./DurationControlUnitInput";
import { DurationControlInlineText } from "./DurationControlInlineText";
import { Spinner } from "./Spinner";
import { clamp } from "./Utilities";

type DurationControlUnit = {
	type: DurationUnitType;
	characters: number;
	step: number;
	max: number;
	value: number | null;
};

type DurationControlElement = DurationControlUnit | string;

/**
 * The DurationControl component props.
 */
export type DurationControlProps = {
	/** The class to apply to the control. */
	className?: string | undefined;

	/** The pattern. */
	pattern: string;

	/** The value in milliseconds. */
	value: number;

	/** The change handler that is called whenever the control value changes. */
	onChange: (milliseconds: number) => void;

	/** The change handler that is called whenever a control unit gets the focus. */
	onUnitFocus?: (unit: DurationUnitType) => void;

	/** The change handler that is called whenever a control unit gets blurred. */
	onUnitBlur?: (unit: DurationUnitType) => void;

	/** The control label. */
	label?: string;

	/** A flag indicating whether the control is disabled. */
	disabled?: boolean;

	/** A flag indicating whether to hide the control spinner. */
	hideSpinner?: boolean;

	/** The maximum value for the day unit. Defaults to Number.MAX_SAFE_INTEGER */
	dMax?: number;

	/** The amount to increment/decrement the day unit value by when an up/down arrow key or spinner button is pressed. Defaults to 1. */
	dStep?: number;

	/** The maximum value for the hour unit. Defaults to Number.MAX_SAFE_INTEGER */
	hMax?: number;

	/** The amount to increment/decrement the hour unit value by when an up/down arrow key or spinner button is pressed. Defaults to 1. */
	hStep?: number;

	/** The maximum value for the minute unit. Defaults to Number.MAX_SAFE_INTEGER */
	mMax?: number;

	/** The amount to increment/decrement the minute unit value by when an up/down arrow key or spinner button is pressed. Defaults to 1. */
	mStep?: number;

	/** The maximum value for the second unit. Defaults to Number.MAX_SAFE_INTEGER */
	sMax?: number;

	/** The amount to increment/decrement the second unit value by when an up/down arrow key or spinner button is pressed. Defaults to 1. */
	sStep?: number;

	/** The maximum value for the millisecond unit. Defaults to Number.MAX_SAFE_INTEGER */
	fMax?: number;

	/** The amount to increment/decrement the millisecond unit value by when an up/down arrow key or spinner button is pressed. Defaults to 1. */
	fStep?: number;
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

	/** A flag indicating whether the control has focus. */
	focused: boolean;
};

/**
 * The DurationControl component.
 */
export class DurationControl extends React.Component<DurationControlProps, DurationControlState> {
	/** The mapping of time units to millisecond multipliers. */
	private static UNIT_MILLISECOND_MULTIPLIERS: {
		[key in DurationUnitType]: number;
	} = {
		day: 86400000,
		hour: 3600000,
		minute: 60000,
		second: 1000,
		millisecond: 1
	};

	/** The default component props. */
	static defaultProps = {
		dMax: Number.MAX_SAFE_INTEGER,
		dStep: 1,
		hMax: Number.MAX_SAFE_INTEGER,
		hStep: 1,
		mMax: Number.MAX_SAFE_INTEGER,
		mStep: 1,
		sMax: Number.MAX_SAFE_INTEGER,
		sStep: 1,
		fMax: Number.MAX_SAFE_INTEGER,
		fStep: 1
	};

	/**
	 * Creates the DurationControl element.
	 * @param props The control properties.
	 */
	public constructor(props: DurationControlProps) {
		super(props);

		const { pattern, value } = this.props;

		// Parse the props into some unit and string elements.
		const elements = DurationControl._parseElementsFromProps(props);

		// Apply our initial value to the elements.
		DurationControl._spreadMillisAcrossUnitElements(value, elements);

		// Default 'lastFocusedInputUnitType' to the unit element type with the smallest multiplier.
		const lastFocusedInputUnitType = DurationControl._getSmallestUnitElementType(elements);

		// Set the initial state for the component.
		this.state = {
			pattern,
			elements,
			milliseconds: value,
			lastFocusedInputUnitType,
			focused: false
		};

		this._updateUnitValue = this._updateUnitValue.bind(this);
		this._onUnitInputFocus = this._onUnitInputFocus.bind(this);
		this._onUnitInputBlur = this._onUnitInputBlur.bind(this);
		this._incrementOrDecrementUnitValue = this._incrementOrDecrementUnitValue.bind(this);
	}

	/** Gets the control class name. */
	private get _controlClassName(): string {
		const classes = ["react-duration-control"];

		if (this.props.className) {
			classes.push(this.props.className);
		}

		if (this.props.disabled) {
			classes.push("disabled");
		}

		if (this.state.focused) {
			classes.push("focused");
		}

		return classes.join(" ");
	}

	/**
	 * Gets the state derived from the given props.
	 * @param nextProps The next props.
	 * @param prevState The previous state.
	 * @returns The state derived from the given props.
	 */
	public static getDerivedStateFromProps(
		nextProps: DurationControlProps,
		prevState: DurationControlState
	) {
		if (nextProps.value === prevState.milliseconds && nextProps.pattern === prevState.pattern) {
			return null;
		}

		// Parse the props into some unit and string elements.
		const elements = DurationControl._parseElementsFromProps(nextProps);

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
			<div className={this._controlClassName}>
				<fieldset className="react-duration-control-fieldset">
					{this.props.label && (
						<legend className="react-duration-control-label">{this.props.label}</legend>
					)}
					<div className="react-duration-control-elements-container">
						{this.state.elements.map((element, index) =>
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
									onDownArrowKeyPress={() =>
										this._incrementOrDecrementUnitValue(element.type, false)
									}
									onFocus={() => this._onUnitInputFocus(element.type)}
									onBlur={() => this._onUnitInputBlur(element.type)}
									disabled={this.props.disabled}
								/>
							)
						)}
					</div>
					{this.props.hideSpinner ? (
						<></>
					) : (
						<Spinner
							onUpButtonPress={() =>
								this._incrementOrDecrementUnitValue(this.state.lastFocusedInputUnitType, true)
							}
							onDownButtonPress={() =>
								this._incrementOrDecrementUnitValue(this.state.lastFocusedInputUnitType, false)
							}
							disabled={this.props.disabled}
						/>
					)}
				</fieldset>
			</div>
		);
	}

	/**
	 * Updates the value for the specified unit duration type.
	 * @param unitType The unit input type.
	 * @param value The new value.
	 */
	private _updateUnitValue(unitType: DurationUnitType, value: number | null): void {
		// Get a copy of our elements array.
		const elements = this.state.elements.slice();

		// Find the unit that matches the updated unit.
		const unitElement = elements.find(
			(element) => typeof element !== "string" && element.type === unitType
		) as DurationControlUnit;

		// Clamp the new value between zero and either the maximum value defined by the unit character limit or the explict unit max.
		// e.g. If we had a unit character limit of 2 then our value would be clamped between 0 and 99 if no explicit unit max is defined.
		const clampedValue = clamp(value, 0, unitElement.max);

		// There is nothing to do if the new value matches our old value.
		if (unitElement.value === clampedValue) {
			return;
		}

		// Get the previous and new unit values in millis.
		const previousUnitValueMillis =
			unitElement.value === null
				? 0
				: unitElement.value * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[unitType];
		const newUnitValueMillis =
			clampedValue === null
				? 0
				: clampedValue * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[unitType];

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
		this.setState({
			lastFocusedInputUnitType: type,
			focused: true
		});

		if (this.props.onUnitFocus) {
			this.props.onUnitFocus(type);
		}
	}

	/**
	 * Handles a unit input element getting blur.
	 * * @param type The blurred unit input type.
	 */
	private _onUnitInputBlur(type: DurationUnitType): void {
		this.setState({ focused: false });

		if (this.props.onUnitBlur) {
			this.props.onUnitBlur(type);
		}
	}

	/**
	 * Increments or decrements the current value for the specified unit.
	 * @param isIncrement Whether the the value should be incremented rather than decremeneted.
	 */
	private _incrementOrDecrementUnitValue(
		unitType: DurationUnitType | null,
		isIncrement: boolean
	): void {
		if (!unitType) {
			return;
		}

		// Find the unit that matches the updated unit.
		const unitElement = this.state.elements.find(
			(element) => typeof element !== "string" && element.type === unitType
		) as DurationControlUnit;

		let updatedUnitValue;

		if (isIncrement) {
			// Get the incremeneted unit value.
			updatedUnitValue = (unitElement.value || 0) + unitElement.step;
		} else {
			// Get the decremented unit value, but make sure we do not go lower than zero.
			updatedUnitValue = (unitElement.value || 0) - unitElement.step;
		}

		this._updateUnitValue(unitType, updatedUnitValue);
	}

	/**
	 * Gets the max and step prop values for the given unit type.
	 * @param unitType The unit type.
	 * @param props The component props.
	 * @returns The max and step prop values for the given unit type.
	 */
	private static _getUnitPropValues(
		unitType: DurationUnitType,
		props: DurationControlProps
	): { step: number; max: number } {
		switch (unitType) {
			case "day":
				return {
					step: props.dStep!,
					max: props.dMax!
				};

			case "hour":
				return {
					step: props.hStep!,
					max: props.hMax!
				};

			case "minute":
				return {
					step: props.mStep!,
					max: props.mMax!
				};

			case "second":
				return {
					step: props.sStep!,
					max: props.sMax!
				};

			case "millisecond":
				return {
					step: props.fStep!,
					max: props.fMax!
				};

			default:
				throw new Error(`unexpected unit type: ${unitType}`);
		}
	}

	/**
	 * Takes a time value in milliseconds and spreads the value across all available unit elements.
	 * @param millis The milliseconds value to spread across the unit elements.
	 * @param elements The control elements.
	 */
	private static _spreadMillisAcrossUnitElements(
		millis: number,
		elements: DurationControlElement[]
	): void {
		// A function to get the unit element with the specified duration unit type.
		const getUnitElement = (type: DurationUnitType) =>
			elements.find(
				(element) => typeof element !== "string" && element.type === type
			) as DurationControlUnit;

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
				let truncatedUnitValue = Math.trunc(unitValue);

				// Restrict truncatedUnitValue to the max value for the current unit.
				truncatedUnitValue = Math.min(truncatedUnitValue, unitElement.max);

				// Apply the unit value.
				unitElement.value = truncatedUnitValue;

				// Update the remaining millis.
				remainingMillis -=
					truncatedUnitValue * DurationControl.UNIT_MILLISECOND_MULTIPLIERS[unitType];
			}
		});
	}

	/**
	 * Gets the type of the smallest unit element present in the specified elements array.
	 * @param elements The control elements array.
	 * @returns The type of the smallest unit element present in the specified elements array.
	 */
	private static _getSmallestUnitElementType(
		elements: DurationControlElement[]
	): DurationUnitType | null {
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
	 * Parse an array of duration control elements, either strings or unit input definitions, from the given props.
	 * @param props The component props.
	 * @returns An array of duration control elements, either strings or unit input definitions.
	 */
	private static _parseElementsFromProps(props: DurationControlProps): DurationControlElement[] {
		const patternRegex = /(\{d+\}|\{h+\}|\{m+\}|\{s+\}|\{f+\})/g;
		const dayUnitRegex = /^{(d+)}$/g;
		const hourUnitRegex = /^{(h+)}$/g;
		const minuteUnitRegex = /^{(m+)}$/g;
		const secondUnitRegex = /^{(s+)}$/g;
		const millisecondUnitRegex = /^{(f+)}$/g;

		const getMaxAndStepValue = (unitType: DurationUnitType, characters: number) => {
			// Get the max and step value for this unit type.
			const { step, max } = DurationControl._getUnitPropValues(unitType, props);

			// Our unit max will be the smallest between the explicitly defined unit max and the max value allowed for the character count.
			return {
				max: Math.min(Math.pow(10, characters) - 1, max),
				step
			};
		};

		const elements = props.pattern
			.split(patternRegex)
			.reduce<DurationControlElement[]>((previous, current) => {
				if (!current) {
					return previous;
				}

				// Get the number of characters for the unit.
				const characters = current.length - 2;

				if (current.match(dayUnitRegex)) {
					return [
						...previous,
						{
							type: "day",
							characters,
							...getMaxAndStepValue("day", characters),
							value: 0
						}
					];
				} else if (current.match(hourUnitRegex)) {
					return [
						...previous,
						{
							type: "hour",
							characters,
							...getMaxAndStepValue("hour", characters),
							value: 0
						}
					];
				} else if (current.match(minuteUnitRegex)) {
					return [
						...previous,
						{
							type: "minute",
							characters,
							...getMaxAndStepValue("minute", characters),
							value: 0
						}
					];
				} else if (current.match(secondUnitRegex)) {
					return [
						...previous,
						{
							type: "second",
							characters,
							...getMaxAndStepValue("second", characters),
							value: 0
						}
					];
				} else if (current.match(millisecondUnitRegex)) {
					return [
						...previous,
						{
							type: "millisecond",
							characters,
							...getMaxAndStepValue("millisecond", characters),
							value: 0
						}
					];
				}

				return [...previous, current];
			}, []);

		// Double check that we don't have duplicate unit types.
		["day", "hour", "minute", "second", "millisecond"].forEach((unit) => {
			if (
				elements.filter((element) => typeof element !== "string" && element.type === unit).length >
				1
			) {
				throw new Error(`cannot have duplicate unit types in pattern (${unit})`);
			}
		});

		return elements;
	}
}
