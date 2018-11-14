import socket from './connect';
import ResponseBase from './response';

export interface loginRes extends ResponseBase {}
export interface logoutRes extends ResponseBase {}

export default class Login {

    onLoginRes: (res: loginRes) => void;
    onLogoutRes: (res: logoutRes) => void;

    constructor() {

        // 登陆返回
        socket.on('loginRes', (res: loginRes) => {
            this.loginResHandler(res)
        });
        socket.on('logoutRes', (res: logoutRes) => {
            this.logoutResHandler(res)
        });

        this.regist = this.regist.bind(this);
        this.loginResHandler = this.loginResHandler.bind(this);
        this.logoutResHandler = this.logoutResHandler.bind(this);
    }

    login() {
        if (socket.connected) {
            socket.emit('loginReq');
            console.info('send loginReq');
        } else {
            socket.addEventListener('connect', () => {
                socket.emit('loginReq');
                console.info('send loginReq on listener');
            });
        }
    }

    get userId() {
        return socket.id;
    }

    logout() {
        if (socket.connected) {
            socket.send('logoutReq');
            console.info('send logoutReq');
        } else {
            throw Error('connect broken');
        }
    }

    regist(event: 'loginRes'|'logoutRes', callback: (res: loginRes|logoutRes)=> void) {
        if (event === 'loginRes') {
            this.onLoginRes = callback;
        } else if (event === 'logoutRes') {
            this.onLogoutRes = callback;
        }
    }

    loginResHandler(res: loginRes) {
        this.onLoginRes(res);
    }

    logoutResHandler(res: logoutRes) {
        this.onLogoutRes(res);
    }
}