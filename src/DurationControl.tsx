import * as React from "react";

import { DurationControlUnit, DurationControlUnitProps } from "./DurationControlUnit";
import { Spinner } from "./Spinner";

export type DurationControlProps = React.PropsWithChildren<{
    pattern: string; // TODO Something optional like 'Days {d} Hours {hh} Minutes {mm} Seconds {SS} Millis {sss}'
    // ["Days {d}", "Hour {h}"].join(" ")
}>;

/**
 * The DurationControl component.
 */
export const DurationControl: React.FunctionComponent<DurationControlProps> = ({ pattern, children }) => {

    const controlStyles: React.CSSProperties = {
        display: "inline-block"
    };

    const controlWrapperStyles: React.CSSProperties = {
        display: "flex",
	    flexDirection: "row",
        padding: "2px",
        border: "1px gray solid"
    };

    return (
        <div className="react-duration-control" style={controlStyles}>
            <div className="control-wrapper" style={controlWrapperStyles}>
                <div className="elements-container">
                    <input/>
                </div>
                <Spinner />
            </div>
        </div>
    );
};