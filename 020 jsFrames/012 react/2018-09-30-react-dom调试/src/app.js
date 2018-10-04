import React from 'react';
import MyInput from './MyInput';
import MySpan from './MySpan';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.textAmount = 1000;
        this.textList = [];
        while(this.textAmount--) {
            this.textList.push(1);
        }

        this.state = {
            text: ''
        }

        this._onChange = this._onChange.bind(this);
    }

    _onChange(text) {
        this.setState((state) => {
            return {
                text: text
            }
        });
    }

    render() {
        return <div>
            <MyInput
            onChange={this._onChange}
            />
            <div>
                {
                    this.textList.map((val, idx) => {
                        if (this.state.text !== '') {
                            return (
                                <MySpan
                                key={idx}
                                text={this.state.text}
                                />
                            );
                        }
                    })
                }
            </div>
        </div>;
    }
}