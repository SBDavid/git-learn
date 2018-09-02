import React from 'react';
import LifeCircle from './LifeCircle';
import PureComp from './PureComp';
import DerivedStateFromProps from './DerivedStateFromProps';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            notForRender: true,
            displayLifeCircle: true
        }
    }

    componentDidMount() {
        
        setTimeout(() => {
            // 1. setState可以传入一个方法，用于读取之前的state
            // 2. 不能修改前值，需要返回一个新的对象
            // 3. 回调函数在Dom完成更新后执行
            // 4. 如果传入一个更新对象，react不保证state即使更新，因为react将多个setState做合并更新
            // 5. 待深入如何文档 
            // https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
            // https://github.com/facebook/react/issues/11527#issuecomment-360199710
            this.setState({
                count: this.state.count + 1
            });
            this.setState((preState, props) => {
                return {
                    count: preState.count+1
                }
            }, () => {
                console.info('setState Callback')
            });
        }, 1000);
       

        /* setTimeout(() => {
            this.setState({
                notForRender: false
            });
        }, 1000); 

        setTimeout(() => {
            this.setState({
                displayLifeCircle: false
            });
        }, 5000); */
    }

    render() {

        let lifeCircle = this.state.displayLifeCircle ? 
        <LifeCircle count={this.state.count} notForRender={this.state.notForRender}/> : null;

        return <div>
            {lifeCircle}
            <PureComp />
            <DerivedStateFromProps />
        </div>;
    }

}