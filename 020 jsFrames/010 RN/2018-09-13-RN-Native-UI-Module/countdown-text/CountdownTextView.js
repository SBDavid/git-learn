import { requireNativeComponent, ViewPropTypes } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

class CountdownTextView extends React.Component {

    constructor(props) {
        super(props);
        this._onCountdown = this._onCountdown.bind(this);
    }

    _onCountdown(event: Event) {
        if (!this.props.onCountdown) {
            return;
        }
        this.props.onCountdown(event.nativeEvent);
    }

    render() {
        const {onCountdown, ...props} = this.props;
        return <RCTCountdownTextView {...props} onCountdown={this._onCountdown}/>
    }
}

var iface = {
    name: 'CountdownTextView',
    propTypes: {
        ...ViewPropTypes,
        count: PropTypes.number,
        onCountdown: PropTypes.func,
    },
};

var RCTCountdownTextView = requireNativeComponent(`RNCountdownTextView`, iface);

export default CountdownTextView;