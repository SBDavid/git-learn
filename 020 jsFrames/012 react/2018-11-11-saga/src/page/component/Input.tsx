import * as React from 'react';
import styled from 'styled-components';
import api from '../../api';
import { receMsgReq, sendMsgRes } from '../../api/chat';

const Button = styled.button`
    background-color: grey;
    color: white;
    margin: 10px;
    padding: 5px 20px;
`;

export default class Input extends React.PureComponent {

    msgAmount = 0;

    constructor(props: any) {
        super(props);

        // 注册发送消息返回的确认消息
        api.chat.regist("sendMsgRes", (res: sendMsgRes) => {
            if (res.success) {
                console.info('消息发送成功');
            } else {
                console.warn('消息发送失败');
            }
        });
        api.chat.regist('receMsgReq', (res: receMsgReq) => {
            if (res.success) {
                console.info('收到新消息', res.content);
            }
        });
    }

    render() {
        return (
            <div>
                <Button
                onClick={() => {
                    api.chat.send(`send text ${this.msgAmount++}`);
                }}
                >发送信息</Button>
            </div>
        );
    }
}