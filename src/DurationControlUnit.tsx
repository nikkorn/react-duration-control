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

    value: number;

	onChange: (value: number) => void;
};

/**
 * The DurationControlUnitInput component.
 */
export const DurationControlUnitInput: React.FunctionComponent<DurationControlUnitInputProps> = ({ value, onChange, type, characterLength }) => {
    return (
        <div className={`duration-control-unit-input-wrapper ${type}`}>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(parseInt(event.target.value))}
                className={`duration-control-unit-input ${type}`} 
                maxLength={characterLength}
                size={characterLength}>
            </input>
        </div>
    );
};