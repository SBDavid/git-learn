import React from 'react';

export default class DerivedStateFromProps extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    componentDidMount() {
        /* this.setState({
            count: 1
        }) */
    }

    static getDerivedStateFromProps(props, state) {
        // 1. props/state发生变化都会触发这个钩子
        // 2. 这个钩子返回新的state，或者null标识不更新state
        console.info('getDerivedStateFromProps', props, state);
        return null;
    }

    render() {
        console.info('getDerivedStateFromProps render')
        return <div>
            <h1>DerivedStateFromProps Test</h1>
            <ul>
                <li>{`DerivedStateFromProps.state.count: ${this.state.count}`}</li>
            </ul>
        </div>
    }
}