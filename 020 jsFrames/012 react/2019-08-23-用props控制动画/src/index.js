var ReactDOM = require("react-dom");

var React = require("react");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: true
        }
    }

    componentDidMount() {
       
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <div>也可是使用css animation-play-state  animation</div>
                <Spin isPlaying={this.state.isPlaying}/>
                <button onClick = {() => {
                    this.setState((state) => {
                        return {
                            isPlaying: !state.isPlaying
                        }
                    })
                }}>Play</button>
            </div>
        );
    }
}

class Spin extends React.Component {
    constructor(props) {
        super(props);

        this.rotate = 0;
        this.timer = null;
        this.ref = React.createRef();
    }

    componentDidMount() {
        console.info('componentDidMount');
        this.play()
        
    }

    play() {
        this.timer = setInterval(() => {
            this.ref.current.style.transform = `rotate(${this.rotate++}deg)`
        }, 16);

        console.info(this.ref.current.style.transform);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.info('componentDidUpdate');
        if (prevProps.isPlaying !== this.props.isPlaying) {
            if (this.props.isPlaying) {
                this.play();
            } else {
                clearInterval(this.timer);
                this.ref.current.style.transform = `rotate(${this.rotate++}deg)`
            }
        } 
    }

    render() {
        return (
            <div ref={this.ref} className="spin" style={{
                transform: [`rotate(${this.rotate}deg)`]
            }} ></div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"))