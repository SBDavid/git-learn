var ReactDOM = require("react-dom");
import Animated from 'animated/lib/targets/react-dom';

var React = require("react");

class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.anim = new Animated.Value(1)
        this.anim1 = this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        this.anim2 = Animated.add(0.1, this.anim1);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Animated.div
                style={{ transform: [{ scale: this.anim2}], backgroundColor: 'red' }}
                className="circle"
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
            >
                <h1>Hello, world!</h1>
            </Animated.div>
        );
    }

    handleMouseDown() {

        Animated.spring(this.anim, { toValue: 0.8 }).start();
    }
    handleMouseUp() {
        Animated.spring(this.anim, { toValue: 1 }).start();
    }
}

ReactDOM.render(<App />, document.getElementById("root"))