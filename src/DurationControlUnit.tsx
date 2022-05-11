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
};

/**
 * The DurationControlUnit component.
 */
export const DurationControlUnit: React.FunctionComponent<DurationControlUnitProps> = ({ type, characterLength }) => {
    return (
        <div className={`duration-control-unit ${type}`}>
            <input 
                className={`duration-control-unit-input ${type}`} 
                maxLength={characterLength}>
            </input>
        </div>
    );
};