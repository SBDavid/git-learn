import { render } from 'react-dom';
import * as React from 'react';



interface Props {
}

interface State {
}

class Clock extends React.Component<Props, State> {

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
                <h1>Hello, world!</h1>
            </div>
        );
    }
}

render(<Clock />, document.getElementById("root"))