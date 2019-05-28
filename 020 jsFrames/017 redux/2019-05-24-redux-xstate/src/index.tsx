import { render } from 'react-dom';
import * as React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './redux/reducer';
import { add, toggle } from './redux/actions';
import reduxXstate from './middleware';
import config from './Xstate';

interface Props {
    add: {
        num: number;
    },
    switcher: string;
    dispatch: Function
}

interface State {
}

const store = createStore(AppReducer, applyMiddleware(reduxXstate(config)));

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <h1>redux-xstate</h1>
                <div>
                    add {this.props.add.num}
                    <button onClick={ () => {
                        this.props.dispatch(add())
                    }}>AddAction</button>
                </div>
                <div>
                    switcher {this.props.switcher}
                    <button onClick={ () => {
                        this.props.dispatch(toggle());
                    }}>ReduceAction</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => (state);

const MappedApp = connect<Props, {}, {},State>(mapStateToProps)(App);

render(<Provider store={store}>
    <MappedApp />
  </Provider>, document.getElementById("root"))