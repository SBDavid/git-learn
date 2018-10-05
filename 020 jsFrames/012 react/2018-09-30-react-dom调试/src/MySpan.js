import React from 'react';

export default class MySpan extends React.PureComponent {
    render() {

        // render发生卡顿
        /* const now = +new Date();
        while(+new Date < now + 5) {
            console.log('render发生卡顿');
        } */

        return(
            <span className={'text'}>{this.props.text}</span>
        );
    }
}