import React from 'react';

class count {
    constructor(num) {
        this.num = num;
    }
}

// 1. PureComponent对比props/state，如果这两项不发生变化那么出触发render
// 2. 它是一种浅对比
export default class PureComp extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            count: new count(0)
        }
    }

    componentDidMount() {
        this.setState({
            count: new count(1)
        })
    }

    render() {
        return <div>
            <h1>PureComponent Test</h1>
            <ul>
                <li>{`PureComp.state.count: ${this.state.count.num}`}</li>
            </ul>
        </div>
    }
}