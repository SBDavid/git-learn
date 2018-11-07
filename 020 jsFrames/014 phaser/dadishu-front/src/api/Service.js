class Service {
    constructor() {
        this.url = '';
        this.WebSocket = null;
        this._onMatchFail = null;
        this._onMatching = null;
    }

    connect(userId, roomId) {
        if (!roomId) {
            this.WebSocket = new WebSocket(`ws://localhost:3000/dadishu?userId=${userId}`);
        } else {
            this.WebSocket = new WebSocket(`ws://localhost:3000/dadishu?userId=${userId}&roomId=${roomId}`);
        }

        this.WebSocket.onopen = () => {
            console.log('websocket open');
        }

        this.WebSocket.onclose = function(){
            console.log('websocket close');
        }

        this.WebSocket.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            if (data.scene === 'match') {
                if (data.success === false) {
                    this._onMatchFail(data.msg);
                } else {
                    this._onMatching(data.state);
                }
            }
        }
    }

    onMatchFail(callback) {
        this._onMatchFail = callback;
    }

    onMatching(callback) {
        this._onMatching = callback;
    }

    setUserReady(userId) {
        this.WebSocket.send(JSON.stringify({
            signal: 'setUserReady'
        }));
    }

    create(userId) {

    }

    join(userId, roomId) {

    }

    quit(userId) {

    }
}

const service = new Service();

export default service;