import Phaser from './phaser';
import user from './api/user';
import room from './api/room';
import service from './api/Service';

export default class match extends Phaser.State {

    constructor() {
        super();

        this.userA = null;
        this.userB = null;

        this.update = this.update.bind(this);
        this.onMatching = this.onMatching.bind(this);
    }

    create() {
        // 加载背景
        this.bg = new Phaser.Sprite(this.game, 0, 0, 'bg');
        this.bg = this.game.add.sprite(0, 0, 'bg');
        this.bg.width = 375;
        this.bg.height = 667;

        // 添加地鼠图标
        this.dishuA = this.game.add.sprite((375/2-96)/2, 96, 'dishu');
        this.dishuA.scale.x = 3;
        this.dishuA.scale.y = 3;
        this.dishuA.animations.add('walk');
        this.dishuA.animations.play('walk', 12, true);
        this.dishuA.visible = false;

        this.dishuB = this.game.add.sprite((375/2*3-96)/2, 96, 'dishu');
        this.dishuB.scale.x = 3;
        this.dishuB.scale.y = 3;
        this.dishuB.animations.add('walk');
        this.dishuB.animations.play('walk', 12, true);
        this.dishuB.visible = false;

        this.connectServer();
    }

    update() {
        console.info('update')
        if (this.userA && this.userA.isReady) {
            this.dishuA.visible = true;
        } else {
            this.dishuA.visible = false;
        }
        if (this.userB && this.userB.isReady) {
            this.dishuB.visible = true;
        } else {
            this.dishuB.visible = false;
        }
    }

    connectServer() {
        console.info('connectServer');
        service.connect(user.userId, room.roomId);
        // 注册事件
        service.onMatchFail((msg) => {
            this.onMatchFail(msg);
        });
        service.onMatching((state) => {
            this.onMatching(state);
        });
    }

    onMatchFail(msg) {
        console.info('onMatchFail', msg);
    }

    onMatching(state) {
        console.info('onMatching', state);
        const users = state.targetRoom.users;

        const me = users.filter((val) => {
            return val.userId === user.userId;
        })[0];

        // 准备开始游戏
        if (!me.isReady) {
            service.setUserReady(user.userId);
        }

        // 设置屏幕准备状态
        if (users[0])
        this.userA = {
            userId: users[0].userId,
            isReady: users[0].isReady
        };

        if (users[1])
        this.userB = {
            userId: users[1].userId,
            isReady: users[1].isReady
        };
    }
}