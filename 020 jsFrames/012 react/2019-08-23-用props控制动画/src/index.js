var ReactDOM = require("react-dom");

var React = require("react");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: true,
            count: 0
        }
    }

    /* shouldComponentUpdate() {
        return false;
    } */

    componentDidMount() {
       setInterval(() => {
           this.setState((state) => {
               return {
                   count: state.count + 1
               }
           })
       }, 1000);
    }

    componentDidUpdate() {
        console.info('app componentDidUpdate');
    }

    render() {
        console.info('app render');

        return (
            <div>
                <Spin isPlaying={this.state.isPlaying}>{this.state.count}</Spin>
                <button onClick = {() => {
                    this.setState((state) => {
                        return {
                            isPlaying: !state.isPlaying
                        }
                    })
                }}>Play</button>

                <div>也可是使用css animation-play-state  animation</div>
                <div>父级的shouldUpdate返回false，自己都不触发render</div>
                <div>只要父级的状态发生变化，父级和子集render就会触发，无论页面渲染是否用到这些状态</div>
            </div>
        );
    }
}

class Spin extends React.Component {
    constructor(props) {
        super(props);

        this.rotate = 0;
        this.ref = React.createRef();

        this.play = this.play.bind(this);
    }

    componentDidMount() {
        console.info('Spin componentDidMount');
        this.play()
    }

    play() {
        /* this.timer = setInterval(() => {
            this.ref.current.style.transform = `rotate(${this.rotate++}deg)`
        }, 16); */

        requestAnimationFrame(() => {
            this.ref.current.style.transform = `rotate(${this.rotate++}deg)`;
            if (this.props.isPlaying)
                this.play();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.info('spin componentDidUpdate');
        if (prevProps.isPlaying !== this.props.isPlaying) {
            if (this.props.isPlaying) {
                this.play();
            } else {
                this.ref.current.style.transform = `rotate(${this.rotate++}deg)`
            }
        } 
    }

    render() {

        console.info('spin render');

        return (
            <div ref={this.ref} className="spin" style={{
                transform: [`rotate(${this.rotate}deg)`]
            }} >
                {this.props.children}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"))