import React from 'react';

export default class MySpan extends React.Component {
    render() {
        return(
            <span className={'text'}>{this.props.text}</span>
        );
    }
}