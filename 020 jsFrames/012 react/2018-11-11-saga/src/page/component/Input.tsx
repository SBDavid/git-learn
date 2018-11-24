import * as React from 'react';
import styled from 'styled-components';
import chatBus from '../../business/chat';

const Container = styled.div`
    display: flex;
`;

const Button = styled.button`
    background-color: grey;
    color: white;
    margin: 10px;
    padding: 5px 20px;
`;

const TextInput = styled.input`
    flex-grow: 1;
    margin: 10px;
    border: 0;
    border-bottom: 1px solid #f1f1f1;
`;

export default class Input extends React.PureComponent {

    private msgAmount = 0;
    private inputRef: HTMLInputElement|null;

    constructor(props: any) {
        super(props);
        this.inputRef = null;
    }

    render() {
        return (
            <Container>
                <input
                ref={ (comp: HTMLInputElement) => {
                    this.inputRef = comp;
                } }
                style={{
                    flexGrow: 1,
                    margin: '10px',
                    border: 0,
                    borderBottom: '1px solid #f1f1f1'
                }}
                ></input>
                <Button
                onClick={(event) => {
                    chatBus.sendMsgReq(this.inputRef.value);
                    // this.inputRef.value = '';
                }}
                >发送信息</Button>
            </Container>
        );
    }
}
