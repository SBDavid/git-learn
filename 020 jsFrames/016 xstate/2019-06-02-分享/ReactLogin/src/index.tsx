import { render } from 'react-dom';
import * as React from 'react';
import {initialState, initialContext, Context, StateSchema, ApiEvent, config, option} from './machine';
import { Interpreter, Machine, interpret } from 'xstate';

interface Props {
}

type LogState = keyof StateSchema['states'];

interface State {
    logState: LogState;
    userToken: string;
}

class App extends React.Component<Props, State> {

    state: State = {
        logState: initialState,
        userToken: initialContext.userToken
    }

    interpret: Interpreter<Context, StateSchema, ApiEvent>;

    constructor(props: Props) {
        super(props);
        const machine = Machine<Context, StateSchema, ApiEvent>(config, option);
        this.interpret = interpret(machine);
        this.interpret.onTransition((state, event) => {
            this.setState(() => {
                return {
                    logState: state.value as LogState,
                    userToken: state.context.userToken
                }
            })
        });

        this.onLogin = this.onLogin.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        this.interpret.start();
        const userToken = localStorage.getItem('userToken');
        setTimeout(() => {
        if (userToken) {
            this.interpret.send({
                type: 'HAS_AUTH',
                userToken: userToken
            });
        } else {
            this.interpret.send({
                type: 'NO_AUTH'
            });
        }
        }, 1000);
    }

    render() {
        return (
            <div>
                <h1>React Login</h1>
                <div> current state: {this.state.logState}</div>
                <div> userToken: {this.state.userToken}</div>
                <div>
                    <button onClick={this.onLogin} style= {this.interpret.state.matches('logout') ? {display: 'block'} : {display: 'none'}}>Login</button>
                    <button onClick={this.onCancel} style= {this.interpret.state.matches('loading') ? {display: 'block'} : {display: 'none'}}>Cancel</button>
                    <button onClick={this.onLogout} style= {this.interpret.state.matches('login') ? {display: 'block'} : {display: 'none'}}>Logout</button>
                </div>
            </div>
        );
    }

    onLogin() {
        this.interpret.send({
            type: 'REQUEST_USER_TOKEN',
            userName: 'abc'
        });
    }

    onCancel() {
        this.interpret.send({
            type: 'CANCEL_REQUEST'
        })
    }

    onLogout() {
        this.interpret.send({
            type: 'LOGOUT'
        });
    }
}

render(<App />, document.getElementById("root"))