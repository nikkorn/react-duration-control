import * as React from "react";

export type SpinnerProps = {};

export const Spinner: React.FunctionComponent<SpinnerProps> = () => {
    return (
        <div className="spinner-button-container">
            <button className="spinner-button spinner-button-up" onClick={() => console.log("up")}>▴</button>
            <button className="spinner-button spinner-button-down" onClick={() => console.log("down")}>▾</button>
        </div>
    );
};