import React, { Component, PropTypes } from "react";

import "./LoadingSpinner.css";

export default class LoadingSpinner extends Component {
    static defaultProps = {
        size: 32,
        borderWidth: 4,
        fill: 'currentcolor',
        spinnerClassName: 'LoadingSpinner'
    };

    render() {
        var { size, borderWidth, className, spinnerClassName } = this.props;
        return (
            <div className={className}>
                <div className={spinnerClassName} style={{ width: size, height: size, borderWidth }}></div>
            </div>
        );
    }
}
