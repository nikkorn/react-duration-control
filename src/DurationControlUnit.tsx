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

    /** The input styles. */
    const inputStyles: React.CSSProperties = {
        display: "flex",
	    flexDirection: "row",
        padding: "2px"
    };

    return (
        <div className={`duration-control-unit ${type}`}>
            <input style={inputStyles} className={`duration-control-unit-input ${type}`}></input>
        </div>
    );
};