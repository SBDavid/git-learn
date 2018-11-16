import * as React from 'react';
import styled from 'styled-components';
import chatBus from '../../business/chat';

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

        chatBus.start();
    }

    render() {
        return (
            <div>
                <Button
                onClick={() => {
                    chatBus.sendMsgReq(`send text ${this.msgAmount++}`);
                }}
                >发送信息</Button>
            </div>
        );
    }
}