var ReactDOM = require("react-dom");

var React = require("react");

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 0
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => {
                setImmediate(() => {
                    this.setState({
                        date: this.state.date + 1
                    });
                })
                
                setImmediate(() => {
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

ReactDOM.render(<Clock />, document.getElementById("root"))