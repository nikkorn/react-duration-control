import * as React from "react";

/**
 * The duration unit types.
 */
export type DurationUnitType = "day" | "hour" | "minute" | "second" | "millisecond";

/**
 * The DurationControlInlineText component props.
 */
export type DurationControlInlineTextProps = {
	value: string;
};

/**
 * The DurationControlInlineText component.
 */
export const DurationControlInlineText: React.FunctionComponent<DurationControlInlineTextProps> = ({
	value
}) => {
	return <span className="react-duration-control-inline-text">{value}</span>;
};
