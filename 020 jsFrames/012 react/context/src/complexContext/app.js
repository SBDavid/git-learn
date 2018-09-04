import React from 'react';

const CountContext = React.createContext({
    count: 0,
    notForRender: true
});

class Count extends React.PureComponent {

    componentDidUpdate() {
        console.info('count componentDidUpdate');
    }
    
    static getDerivedStateFromProps() {
        console.info('count getDerivedStateFromProps');
        return null;
    }

    render() {
        console.info('count render');
        return <CountContext.Consumer>
                {context => (<p>{context.count}</p>)}
            </CountContext.Consumer>
    }
}

class NornalCount extends React.PureComponent {

    componentDidUpdate() {
        console.info('NornalCount componentDidUpdate');
    }
    
    static getDerivedStateFromProps() {
        console.info('NornalCount getDerivedStateFromProps');
        return null;
    }

    render() {
        console.info('NornalCount render');
        return <p>{this.props.count}</p>;
    }

}
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            notForRender: true
        }
    }

    render() {
        return <div>
            <div>
                <button onClick={
                    () => {
                        this.setState((state) => {
                            return {
                                count: state.count + 1
                            };
                        });
                    }
                }>add</button>
                <button onClick={
                    () => {
                        this.setState((state) => {
                            return {
                                notForRender: !state.notForRender
                            };
                        });
                    }
                }>norForRender</button>
            </div>
            <CountContext.Provider value={this.state}>
                <Count></Count>
            </CountContext.Provider>
            <NornalCount count={this.state.count} />
        </div>
    }
}