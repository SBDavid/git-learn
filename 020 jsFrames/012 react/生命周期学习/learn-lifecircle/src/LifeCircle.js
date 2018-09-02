import React from 'react';
import SubTree from './SubTree';

// 不依赖于state/props的状态，不推荐使用
let outSideState = 'outSideState';

export default class LifeCircle extends React.Component {

    // es6 class 没有静态属性
    /* static defaultProps = {
        defaultProps: 'defaultProps'
    } */

    constructor(props) {
        console.info('before constructor');
        super(props);
        this.state = {
            notForRender: false
        }

        /* setTimeout(() => {
            this.setState({
                notForRender: true
            });
        }, 1000); */

        // 改变外部状态
        setTimeout(() => {
            outSideState += ' updated';
            // 1. 用于改变除了state/props之外的状态
            // 2. 会触发render
            // 3. 忽略shouldupdate
            // 4. 触发子节点更新
            this.forceUpdate();
        }, 2000)
    }

    /* componentWillMount() {
        console.info('before componentWillMount(unsafe)');
    } */

    componentDidMount() {
        console.info('before componentDidMount');
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 1. 孩子节点不执行re-render
        // 2. 但是孩子节点的state发生变化还是会执行re-render
        console.info('before shouldComponentUpdate');
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 1. 发生在Dom渲染完成之后
        // 2. 即使改变的props/state不改变页面Dom结构，也会触发这个钩子
        // 3. 死循环
        console.info('before componentDidUpdate');
        /* this.setState((preState, props) => {
            return {
                notForRender: !preState.notForRender
            }
        }); */
    }

    static getDerivedStateFromProps(prevProps, prevState) {
        console.info('before getDerivedStateFromProps');
        return null;
    }

    render() {
        // 1. 即使改变的props/state不改变页面Dom结构，也会触发render
        console.info('before render');
        return <div>
                <h1>LiftCircle Test</h1>
                <div>{`outSideState: ${outSideState}`}</div>
                <div>{`defaultProps: ${this.props.defaultProps}`}</div>
                <div>{`LifeCircle.props.count: ${this.props.count}`}</div>
                <SubTree count={this.props.count}></SubTree>
            </div>;
    }

    componentWillUnmount() {
        console.info('before componentWillUnmount');
    }
}

// 1. 第一默认props
// 2. 使用静态属性
// 3. 待深入阅读 https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
LifeCircle.defaultProps = {
    defaultProps: 'defaultProps'
}