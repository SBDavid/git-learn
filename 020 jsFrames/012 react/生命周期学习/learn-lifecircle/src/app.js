import React from 'react';
import LifeCircle from './LifeCircle';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        return <div>
            <LifeCircle count={this.state.count} />
        </div>;
    }

}