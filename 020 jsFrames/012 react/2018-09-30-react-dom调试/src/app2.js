import React from 'react';

const items = [];
let top = 0;
for(let i=0; i<1000; i++) {
    items.push(0);
}

export default class App2 extends React.Component {
    constructor(props) {
        super(props);
        this.container = null;
        this.state = {
            count: 0
        }
        this.move = this.move.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState((state) => {
                return {
                    count: state.count + 1
                }
            })
        }, 1000);
        this.move();
    }

    move() {
        requestAnimationFrame(() => {
            this.container.style.top = String(top++ +'px');
            requestAnimationFrame(this.move);
        });
    }

    render() {
        return (
            <div
            style={{
                position: 'absolute'
            }}
            ref={(comp) => {
                this.container = comp;
            }}
            >
                {
                    items.map((val, idx) => {
                        return <span key={idx}>{this.state.count}</span>
                    })
                }
            </div>
        );
    }
}