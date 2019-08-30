var ReactDOM = require("react-dom");

var React = require("react");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            outState: 0,
            innerState: 0
        }
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <button onClick={() => {
                    this.setState((state) => {
                        return {
                            outState: state.outState + 1
                        }
                    }) }
                }>changeOut</button>
                <button onClick={() => {
                    this.setState((state) => {
                        return {
                            innerState: state.innerState + 1
                        }
                    }) }
                }>inner</button>
                <OutComp outState={this.state.outState}>
                    <div>
                        <InnerComp innerState={this.state.innerState}></InnerComp>
                        <ControlledComp></ControlledComp>
                    </div>
                </OutComp>
            </div>
        );
    }
}

class OutComp extends React.PureComponent {
    render() {
        console.info('outcomp render');
        return (
            <div>
                <h1>out {this.props.outState}</h1>
                {this.props.children}
            </div>
        );
    }
}

class InnerComp extends React.PureComponent {
    render() {
        console.info('InnerComp render');
        return (
            <div>
                <h1>InnerComp: {this.props.innerState}</h1>

            </div>
        );
    }
}

class ControlledComp extends React.Component {

    constructor() {
        super();
        this.state = {
            count: 0
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.count !== nextState.count) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        console.info('ControlledComp render');
        return (
            <div>
                <button onClick={() => {
                    this.setState((state) => {
                        return {
                            count: state.count + 1
                        }
                    }) }
                }>ControlledComp</button>
                <h1>InnerComp: {this.state.count}</h1>

            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"))