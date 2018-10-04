import React from 'react';

export default class MyInput extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    _onChange(event) {
        event.persist();
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <input
            type="text"
            placeholder={'TYPE SOMETHING!'}
            onChange={this._onChange}/>
        );
    }
}