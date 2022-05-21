import * as React from "react";

export type SpinnerProps = {
    onUpButtonPress(): void;
    onDownButtonPress(): void;

    /** A flag indicating whether the spinner buttons are disabled. */
	disabled: boolean | undefined;
};

export const Spinner: React.FunctionComponent<SpinnerProps> = ({ onUpButtonPress, onDownButtonPress, disabled }) => {
    return (
        <div className="spinner-button-container">
            <button disabled={disabled} className="spinner-button spinner-button-up" onClick={() => onUpButtonPress()}>▴</button>
            <button disabled={disabled} className="spinner-button spinner-button-down" onClick={() => onDownButtonPress()}>▾</button>
        </div>
    );
};