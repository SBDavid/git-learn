import { render } from 'react-dom';
import * as React from 'react';

interface Props {
}

interface State {
    date: number;
}

class Item extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1>I am item</h1>
                {this.props.children}
            </div>
        );
    }
}

class Item1 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        React.Children.forEach(this.props.children, (node, index) => {
            console.info(index, node);

            if ( node && (node as React.ReactElement).props.children) {
                React.Children.forEach((node as React.ReactElement).props.children, (n) => {
                    console.info(n)
                })
            }
        })
    }

    render() {
        return (
            <div>
                <h1>I am item1</h1>
                {this.props.children}
            </div>
        );
    }
}

class Container extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        React.Children.forEach(this.props.children, (node, index) => {
            console.info(index, node);
            if ( node && (node as React.ReactElement).props.children) {
                React.Children.forEach((node as React.ReactElement).props.children, (n) => {
                    console.info(n)
                })
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <h1>I am container</h1>
                {this.props.children}
            </React.Fragment>
        );
    }
}

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <h1>I am App</h1>
                <Item>
                    <Item1></Item1>
                </Item>
            </Container>
        );
    }
}

render(<App />, document.getElementById("root"))