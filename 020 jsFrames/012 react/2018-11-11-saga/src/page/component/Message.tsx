import * as React from 'react';
import styled from 'styled-components';

const ContainerOther = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: row;
`;

const ContainerSelf = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: row-reverse;
`;

const MsgSelf = styled.div`
    padding: 10px;
    border-radius: 10px;
    background-color: #b0e46e;
    flex-direction: column;
    display: flex;
`;

const MsgOther = styled.div`
    padding: 10px;
    border-radius: 10px;
    background-color: white;
    flex-direction: column;
    display: flex;
`;

const Id = styled.div``;
const Text = styled.div``;
const Time = styled.div`
    align-self: flex-end;
    color: grey
`;

interface Props {
    isSelf: boolean;
    id: String;
    text: String;
    time: Number;
}

export default class Message extends React.PureComponent<Props> {

    render () {

        const Container = this.props.isSelf ? ContainerSelf : ContainerOther;
        const Msg = this.props.isSelf ? MsgSelf : MsgOther;
        const time = new Date(this.props.time as number);

        return (
            <Container>
                <Msg>
                    <Id>{`Id: ${this.props.id}`}</Id>
                    <Text>{this.props.text}</Text>
                    <Time>{`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}</Time>
                </Msg>
            </Container>
        );
    }
}
