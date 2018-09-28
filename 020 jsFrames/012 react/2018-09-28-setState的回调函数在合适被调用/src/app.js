import React from 'react';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            toggle: false
        }
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate');
        return true;
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.setState((state) => {
            console.log('setState first');
            return {
                toggle: true
            }
        }, () => {
            console.log('setState callback first');
        });
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    render() {
        return <div>Toggle: {String(this.state.toggle)}</div>;
    }
}