import * as React from "react";

/**
 * The duration unit types.
 */
export type DurationUnitType = "day" | "hour" | "minute" | "second" | "millisecond";

/**
 * The DurationControlUnit component props.
 */
export type DurationControlUnitProps = {
    /** The unit type. */
    type: DurationUnitType;

    /** The character length of the unit input. */
    characterLength: number;

    value: number;

	onChange: (value: number) => void;
};

/**
 * The DurationControlUnit component.
 */
export const DurationControlUnit: React.FunctionComponent<DurationControlUnitProps> = ({ value, onChange, type, characterLength }) => {
    return (
        <div className={`duration-control-unit ${type}`}>
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