declare module "react-time-duration-input" {
    import React from 'react';

    interface MyComponentProps {
        prop1: boolean;
        prop2?: string;
        prop3?: string;
    }

    export const TimeDurationInput = React.SFC<MyComponentProps>();
}

declare module "react-duration" {
    import React from 'react';

    interface MyComponentProps {
        prop1: boolean;
        prop2?: string;
        prop3?: string;
    }

    export default DurationControl = React.SFC<MyComponentProps>();
}