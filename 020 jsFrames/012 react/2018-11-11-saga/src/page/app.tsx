import * as React from 'react';
import styled from 'styled-components';
import StateBar from './container/StateBar';
import Input from './component/Input';
import Messages from './container/Messages';
import api from '../api';
import { loginRes } from '../api/login';

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
    background: #f1f1f1;
    flex-grow: 1;
    display: flex;
`;

const InputBox = styled.div`
    height: 50px;
    flex-grow: 0;
`;

interface IProps {
    tempDispatch: Function;
}
export default class App extends React.Component<any> {

    constructor(props: IProps) {
        super(props);

        api.login.regist("loginRes", (res: loginRes) => {
            if (res.success) {
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
                <StateBar />
            </StateBarBox>
            <MessageBox>
                <Messages/>
            </MessageBox>
            <InputBox>
                <Input />
            </InputBox>
        </Container>;
    }
}