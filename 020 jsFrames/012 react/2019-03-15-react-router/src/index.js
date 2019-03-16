import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

function Index() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}

class Listener extends React.Component {
    constructor(props) {
        super(props);
        console.info(props);
        props.history.listen((location) => {
            console.info(location, arguments)
        })
    }

    render() {
        return this.props.children;
    }
}

const RouterLintener = withRouter(Listener);

class AppRouter extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Router>
                <RouterLintener>
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/about/">About</Link>
                                </li>
                                <li>
                                    <Link to="/users/">Users</Link>
                                </li>
                            </ul>
                        </nav>

                        <Route path="/" exact component={Index} />
                        <Route path="/about/" component={About} />
                        <Route path="/users/" component={Users} />
                    </div>
                </RouterLintener>
            </Router>
        );
    }
}

ReactDOM.render(<AppRouter />, document.getElementById("root"))