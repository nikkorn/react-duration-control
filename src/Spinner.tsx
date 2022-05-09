import * as React from "react";

export type SpinnerProps = {};

export const Spinner: React.FunctionComponent<SpinnerProps> = () => {

    const spinnerContainerStyles: React.CSSProperties = {
        display: "flex",
	    flexDirection: "column",
        justifyContent: "center",
        width: "16px",
        padding: "0px 1px"
    };

    const spinnerButtonStyles: React.CSSProperties = {
		cursor: "pointer",
        padding: "0px",
        lineHeight: "50%"
    };

    return (
        <div className="spinner-button-container" style={spinnerContainerStyles}>
            <button className="spinner-button spinner-button-up" style={spinnerButtonStyles} onClick={() => console.log("up")}>▴</button>
            <button className="spinner-button spinner-button-down" style={spinnerButtonStyles} onClick={() => console.log("down")}>▾</button>
        </div>
    );
};