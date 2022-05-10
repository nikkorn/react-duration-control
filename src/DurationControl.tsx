import * as React from "react";

import { DurationControlUnit, DurationControlUnitProps } from "./DurationControlUnit";
import { Spinner } from "./Spinner";

export type DurationControlProps = React.PropsWithChildren<{
    pattern: string; // TODO Something optional like 'Days {d} Hours {hh} Minutes {mm} Seconds {SS} Millis {sss}'
    // ["Days {d}", "Hour {h}"].join(" ")

	value: number;
}>;

export type DurationControlState = {
    value: number; 
};

/**
 * The DurationControl component.
 */
export class DurationControl extends React.Component<DurationControlProps, DurationControlState> {
    /** The control styles. */
    private static _controlStyles: React.CSSProperties = {
        display: "inline-block"
    };

    /** The control wrapper styles. */
    private static  _controlWrapperStyles: React.CSSProperties = {
        display: "flex",
	    flexDirection: "row",
        padding: "2px",
        border: "1px gray solid"
    };

	/**
	 * Creates the DurationControl element.
	 * @param props The control properties.
	 */
	public constructor(props: DurationControlProps) {
		super(props);

		// Set the initial state for the component.
		this.state = { value: props.value };
	}

	/**
	 * Called when the component is mounted.
	 */
	public componentDidMount(): void {

	}

	/**
	 * Called when the component is about to be unmounted.
	 */
	public componentWillUnmount(): void {

	}

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		return (
            <div className="react-duration-control" style={DurationControl._controlStyles}>
                <div className="control-wrapper" style={DurationControl._controlWrapperStyles}>
                    <div className="elements-container">
						<input type="text" value={this.state.value} onChange={(event) => this.setState({ value: parseInt(event.target.value) })} />
                    </div>
                    <Spinner />
                </div>
            </div>
        );
	}
}