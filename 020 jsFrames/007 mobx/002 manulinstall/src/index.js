var ReactDOM = require("react-dom");

var React = require("react");
import Container from "./comp/Container";


ReactDOM.render(<Container />, document.getElementById("root"))

import {decorate, observable, computed, autorun} from "mobx";

class OrderLine {
    /* price = 0;
    amount = 1; */

    constructor(price) {
        console.info('constructor', this);
        this.price = price;
        this.amount = 1;
    }

    get total() {
        return this.price * this.amount;
    }
}
decorate(OrderLine, {
    price: observable,
    amount: observable,
    total: computed
})

var or = new OrderLine(1);
autorun(() => console.log(or.total));
or.price = 2;