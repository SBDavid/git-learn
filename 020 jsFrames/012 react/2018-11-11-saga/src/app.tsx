import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const ChatBox = styled.div`
    background: skyblue;
    flex-grow: 1;
`;

const InputBox = styled.div`
    height: 50px;
    background: steelblue;
    flex-grow: 0;
`;

export default class App extends React.Component {
    render() {
        return <Container>
            <ChatBox></ChatBox>
            <InputBox></InputBox>
        </Container>;
    }
}