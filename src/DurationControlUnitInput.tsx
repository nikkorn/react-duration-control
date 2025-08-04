import * as React from "react";

/**
 * The duration unit types.
 */
export type DurationUnitType = "day" | "hour" | "minute" | "second" | "millisecond";

/**
 * The DurationControlUnitInput component props.
 */
export type DurationControlUnitInputProps = {
	/** The unit type. */
	type: DurationUnitType;

	/** The character length of the unit input. */
	characterLength: number | undefined;

	/** The unit value. */
	value: number | null;

	/** The 'onChange' handler. */
	onChange: (value: number | null) => void;

	/** The 'onUpArrowKeyPress' handler. */
	onUpArrowKeyPress: () => void;

	/** The 'onDownArrowKeyPress' handler. */
	onDownArrowKeyPress: () => void;

	/** The 'onFocus' handler. */
	onFocus: () => void;

	/** The 'onBlur' handler. */
	onBlur: () => void;

	/** A flag indicating whether the unit input is disabled. */
	disabled: boolean | undefined;
};

/**
 * The DurationControlUnitInput component.
 */
export const DurationControlUnitInput: React.FunctionComponent<DurationControlUnitInputProps> = ({
	value,
	type,
	characterLength,
	onChange,
	onUpArrowKeyPress,
	onDownArrowKeyPress,
	onFocus,
	onBlur,
	disabled
}) => {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [focused, setFocused] = React.useState(false);

	// A helper function to get the raw value if the unit has focus or our value padded with zeros if it doesn't.
	const getValue = (): string | number => {
		// If our value is null then the input should just be empty.
		if (value === null) {
			return "";
		}

		// If our field is focused then we want to show the raw value. If it isn't then we want our padded value.
		return focused || characterLength === undefined
			? value
			: String(value).padStart(characterLength, "0");
	};

	return (
		<div className={`duration-control-unit-input-wrapper ${type}`}>
			<input
				ref={inputRef}
				type="text"
				inputMode="numeric"
				value={getValue()}
				onChange={(event) => {
					// If our input is empty then the input value should be null.
					if (!event.target.value) {
						onChange(null);
						return;
					}

					// Only call our 'onChange' callback if our value is actually a valid number.
					if (!Number.isNaN(Number(event.target.value))) {
						onChange(parseInt(event.target.value, 10));
					}
				}}
				onFocus={() => {
					if (!disabled) {
						setFocused(true);
						onFocus();
					}
				}}
				onBlur={(event) => {
					setFocused(false);
					onBlur();

					// If focus leaves our input and it is empty then we should reset the input value to zero.
					if (!event.target.value) {
						onChange(0);
					}
				}}
				onKeyDown={(event) => {
					// Prevent default cursor movement when the key pressed was an up or down arrow key.
					if (event.key === "ArrowUp" || event.key === "ArrowDown") {
						event.preventDefault();
					}

					if (event.key === "Enter") {
						setFocused(false);
						onBlur();

						// If focus leaves our input and it is empty then we should reset the input value to zero.
						if (!inputRef.current || !inputRef.current.value) {
							onChange(0);
						}
					}
				}}
				onKeyUp={(event) => {
					// Check whether the key pressed was an up or down arrow key.
					if (event.key === "ArrowUp") {
						onUpArrowKeyPress();
					} else if (event.key === "ArrowDown") {
						onDownArrowKeyPress();
					}
				}}
				className={`duration-control-unit-input ${type} ${focused ? "" : "unfocused"}`}
				maxLength={characterLength}
				style={{
					width: `${
						characterLength !== undefined ? characterLength : value?.toString().length ?? 1
					}ch`
				}}
			></input>
		</div>
	);
};
