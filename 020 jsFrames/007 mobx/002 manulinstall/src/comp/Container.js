var React = require("react");

import Clock from "./Clock";
import {observer} from 'mobx-react';

export default class Container extends React.Component {
    render() {
        return (
            <div>
                <h1>Container</h1>
                <Clock />
            </div>
        );
    }
}