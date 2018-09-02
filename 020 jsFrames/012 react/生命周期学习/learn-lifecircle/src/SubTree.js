import React from 'react';

export default class SubTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    componentDidMount() {
        this.setState({
            count: 1
        })
    }

    render() {
        return <div>
            <ul>
                <li>{`SubTree.props.count: ${this.props.count}`}</li>
                <li>{`SubTree.state.count: ${this.state.count}`}</li>
            </ul>
        </div>
    }
}