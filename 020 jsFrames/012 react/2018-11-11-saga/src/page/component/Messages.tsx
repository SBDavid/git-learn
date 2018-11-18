import * as React from 'react';
import styled from 'styled-components';

import Message from './Message';
import { Message as MessageModel } from '../../model/Message';

const MessageList = styled.div`
    width: 100%;
    flex-grow: 1;
    flex-direction: column;
    overflow-y: scroll;
`;

interface Props {
    messages: MessageModel[],
    userId: String
}

export default class Messages extends React.PureComponent<Props> {

    render() {
        const messages = this.props.messages.map((msg) => {
            return (
                <Message
                key={msg.id}
                id={msg.user.id}
                text={msg.text}
                time={msg.time}
                isSelf={msg.user.id === this.props.userId}
                ></Message>
            );
        })

        return(
            <MessageList>{messages}</MessageList>
        );
    }
}