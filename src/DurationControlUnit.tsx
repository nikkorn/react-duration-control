import * as React from "react";

export type DurationUnitType = "day" | "hour" | "minute" | "second" | "millisecond";

export type DurationControlUnitProps = {
    /** The unit type. */
    type: DurationUnitType;
};

/**
 * 
 */
export const DurationControlUnit: React.FunctionComponent<DurationControlUnitProps> = ({ type }) => {
    return (<input data-unit={type}></input>);
};