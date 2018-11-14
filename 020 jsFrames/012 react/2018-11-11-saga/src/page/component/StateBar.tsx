import * as React from 'react';

import { Message } from '../../store/messages';

interface IProps {
    login: String;
    messages: Message[];
    userId: String;
}

export default class StateBar extends React.PureComponent<IProps> {

    render() {
        return (
            <div>
                登陆状态：{this.props.login}
                消息数量：{this.props.messages.length}
                <br />
                用户名：{this.props.userId}
            </div>
        );
    }
}