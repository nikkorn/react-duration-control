import * as React from "react";

export type SpinnerProps = {
    onUpButtonPress(): void;
    onDownButtonPress(): void;
};

export const Spinner: React.FunctionComponent<SpinnerProps> = ({ onUpButtonPress, onDownButtonPress }) => {
    return (
        <div className="spinner-button-container">
            <button className="spinner-button spinner-button-up" onClick={() => onUpButtonPress()}>▴</button>
            <button className="spinner-button spinner-button-down" onClick={() => onDownButtonPress()}>▾</button>
        </div>
    );
};