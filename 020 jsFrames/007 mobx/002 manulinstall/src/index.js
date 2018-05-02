var ReactDOM = require("react-dom");

var React = require("react");
import Container from "./comp/Container";


ReactDOM.render(<Container />, document.getElementById("root"))

import {decorate, observable, computed, autorun, extendObservable, action} from "mobx";

var Person = function(firstName, lastName) {
    // 在一个新实例上初始化 observable 属性
    extendObservable(this, {
        firstName: firstName,
        lastName: lastName,
        get fullName() {
            return this.firstName + " " + this.lastName
        },
        setFirstName(firstName) {
            this.firstName = firstName
        }
    }, {
        setFirstName: action
    });
}

var p = new Person('1','2');

autorun((e) => function() {
    console.info(p)
})

observable({
    p:p
})

p.setFirstName('f')