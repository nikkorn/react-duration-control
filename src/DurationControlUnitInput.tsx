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
    characterLength: number;

    value: number | null;

	onChange: (value: number | null) => void;
};

/**
 * The DurationControlUnitInput component.
 */
export const DurationControlUnitInput: React.FunctionComponent<DurationControlUnitInputProps> = ({ value, onChange, type, characterLength }) => {
    return (
        <div className={`duration-control-unit-input-wrapper ${type}`}>
            <input
                type="text"
                value={value === null ? "" : value}
                onChange={(event) => {
                    // If our input is empty then the input value should be null.
                    if (!event.target.value) {
                        onChange(null);
                        return;
                    }

                    // Parse the input value as an integer.
                    const intValue = parseInt(event.target.value, 10);

                    // On;y call our 'onChange' callback if our value is actually a valid number.
                    if (!isNaN(intValue)) {
                        onChange(intValue);
                    }
                }}
                onBlur={(event) => {
                    // If focus leaves our input and it is empty then we should reset the input value to zero.
                    if (!event.target.value) {
                        onChange(0);
                    }
                }}
                className={`duration-control-unit-input ${type}`} 
                maxLength={characterLength}
                size={characterLength}>
            </input>
        </div>
    );
};