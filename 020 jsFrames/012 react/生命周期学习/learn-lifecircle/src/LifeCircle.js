import React from 'react';

export default class LifeCircle extends React.Component {

    constructor(props) {
        console.info('before constructor');
        super(props);
    }

    componentDidMount() {
        console.info('before componentDidMount');
    }

    render() {
        console.info('before render');
        return <div>{this.props.count}</div>;
    }

}