import React from 'react';
import ReactDOM from 'react-dom';

// 普通模块测试，dom中只有单个文本
// 结论为，没有影响
class TestComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          count: 0,
        };
    }

    componentDidMount() {
        var self = this;
        setInterval(function(){
            self.setState({
                count: self.state.count + 1
            });
        }, 1000);
    }

    render() {
        return (
            <div >
                <a href>我是一个超链接 {this.state.count}</a>
            </div>
        );
    }
}
// for循环测试，dom中的元素是通过for循环插入的
// 没有影响
class ForComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          count: [0,1],
        };
    }

    componentDidMount() {
        var self = this;
        setInterval(function(){
            var now = 
            self.setState({
                count: self.state.count.concat([self.state.count[self.state.count.length-1]+1])
            });
        }, 1000);
    }

    render() {
        const ListItems = this.state.count.map((number) =>
            <li key={number}>{number}</li>
        );

        return (
            <ul >
                {ListItems}
            </ul>
        );
    }
}

// if测试，Dom消失再显示
// 有影响，手动添加的Dom在根结点删除后会消失。
// 也就是说各节点重绘会影响手动修改的Dom
class IfComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          count: true,
        };
    }

    componentDidMount() {
        var self = this;
        setInterval(function(){
            self.setState({
                count: !self.state.count
            });
        }, 1000);
    }

    render() {

        const ifItem = this.state.count ? <i>true</i> : <div>false</div>;

        return (
            <div >
                {ifItem}
            </div>
        );
    }
}

window.onload = function () {
    ReactDOM.render(
        <div>
            <TestComp></TestComp>
            <IfComp></IfComp>
            <ForComp></ForComp>
        </div>,
        document.getElementById('root')
    );

    // 手动添加一个dom，用来检测是否会和react冲突
    let link = document.getElementsByTagName('i')[0];
    // dom添加在最后不会对react造成影响
    // link.appendChild(document.createElement('span'));
    // 直接修改dom内容会冲突
    // link.innerText = '123';
    // link.insertBefore(document.createElement('span'), link.childNodes[0]);
}