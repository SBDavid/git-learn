import * as React from 'react';
import { Message } from '../../store/reducers';

interface IProps {
    state: String;
    messages: Message[];
    userId: String;
}

export default class StateBar extends React.PureComponent<any> {

    constructor(props: IProps) {
        super(props);
    }

    render() {

        const props = this.props as IProps;

        return <div>
            登陆状态：{props.state}
            消息数量：{props.messages.length}
            <br />
            用户名：{props.userId}
        </div>
    }
}