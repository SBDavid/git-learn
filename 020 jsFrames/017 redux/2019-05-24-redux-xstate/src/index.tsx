import { render } from 'react-dom';
import * as React from 'react';

interface Props {
}

interface State {
    date: number;
}

class Clock extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            date: 0
        }
    }
    
    timerID: number;

    componentDidMount() {
        this.timerID = setInterval(
            () => {
                setTimeout(() => {
                    this.setState({
                        date: this.state.date + 1
                    });
                })
                
                setTimeout(() => {
                    this.setState({
                        date: this.state.date + 1
                    });
                })
            },
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date}.</h2>
            </div>
        );
    }
}

render(<Clock />, document.getElementById("root"))