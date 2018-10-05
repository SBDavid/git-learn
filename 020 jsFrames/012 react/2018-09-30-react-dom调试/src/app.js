import React from 'react';
import MyInput from './MyInput';
import MySpan from './MySpan';

export default class App extends React.PureComponent {

    constructor(props) {
        super(props);

        this.textAmount = 1000;
        this.textList = [];
        while(this.textAmount--) {
            this.textList.push('1');
        }
        this.textAmount = 1000;

        this.changeList = [];

        this.state = {
            textList: this.textList
        }

        this._onChange = this._onChange.bind(this);
        this.changeText = this.changeText.bind(this);
        this.changeTextWapper = this.changeTextWapper.bind(this);
    }

    changeTextWapper() {
        requestIdleCallback((deadline) => {
            this.changeText(deadline);

            if (this.changeList.length > 0) {
                requestIdleCallback(this.changeTextWapper);
            }
        });
    }

    changeText(deadline) {
        if (this.changeList.length > 0 && deadline.timeRemaining() > 0 && this.p(deadline)) {
            const item = this.changeList.shift();
            this.setState((state) => {
                const newTextList = Object.assign([], this.state.textList);
                for (let i=item.start; i < item.start+100; i++) {
                    newTextList[i] = item.text;
                }
                return {
                    textList: newTextList
                }
            }, () => {
                this.changeText(deadline)
            });
        }
    }

    p(deadline) {

//        console.info(deadline.timeRemaining());
        return true;
    }

    _onChange(text) {

        this.changeList = [];

        for(let i=0; i<this.textAmount; i+=100) {
            this.changeList.push({
                start: i,
                text: text
            });
        }

        this.changeTextWapper();
    }

    render() {
        return <div>
            <MyInput
            onChange={this._onChange}
            />
            <div>
                {
                    this.state.textList.map((val, idx) => {
                        return (
                            <MySpan
                            key={idx}
                            text={val}
                            />
                        );
                    })
                }
            </div>
        </div>;
    }
}