import * as React from 'react';
import {connect } from 'react-redux';
import {Dispatch} from 'redux';
import {AppState} from './store/reducers';
import { Provider } from 'react-redux';
import store from './store';
import {toggle, updateTitle} from './store/actions';

interface State {
}

class App extends React.Component<AppState, State> {

    componentDidMount() {
        console.info(this.props)
    }

    render() {
        return (
            <div>
                <h1 onClick = {() => {
                        (this.props as any).dispatch(updateTitle('updateTitle'));
                    }}>{this.props.title}</h1>
                <div>
                    <button onClick={() => {
                        (this.props as any).dispatch(toggle());
                    }}>{this.props.toggle.value}</button>
                </div>
                <div>
                    count: {this.props.toggle.context.count}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    console.info('mapStateToProps', state);
    return {
        title: state.title,
        toggle: state.toggle
    }
};

const MappedApp = connect<AppState, {dispatch: Dispatch}, {}, {}>(mapStateToProps)(App);

class ReduxContainer extends React.Component {
    render() {
        return(
            <Provider store={store}><MappedApp /></Provider>
        );
    }
}


export default ReduxContainer;