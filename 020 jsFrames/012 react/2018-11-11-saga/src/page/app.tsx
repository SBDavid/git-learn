import * as React from 'react';
import styled from 'styled-components';
import StateBar from './container/StateBar';
import api from '../api';

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const StateBarBox = styled.div`
    height: 50px;
    background: palevioletred;
    flex-grow: 0;
`;

const MessageBox = styled.div`
    background: skyblue;
    flex-grow: 1;
`;

const InputBox = styled.div`
    height: 50px;
    background: steelblue;
    flex-grow: 0;
`;

interface IProps {
    tempDispatch: Function;
}
export default class App extends React.Component<any> {

    constructor(props: IProps) {
        super(props);

        api.login.regist("loginRes", (success: boolean) => {
            if (success) {
                console.info('登陆成功');
                props.tempDispatch({
                    type: 'login'
                });
                props.tempDispatch({
                    type: 'setUserId',
                    userId: api.login.userId
                });
            } else {
                console.info('登陆失败');
                props.tempDispatch({
                    type: 'logout'
                });
                props.tempDispatch({
                    type: 'setUserId',
                    userId: 'null'
                });
            }
            
        });
    }

    componentDidMount() {

        const props = this.props as IProps;

        // 用户尝试登陆聊天室

        api.login.login();
        props.tempDispatch({
            type: 'pending'
        });
    }

    render() {
        return <Container>
            <StateBarBox>
                <StateBar></StateBar>
            </StateBarBox>
            <MessageBox></MessageBox>
            <InputBox></InputBox>
        </Container>;
    }
}