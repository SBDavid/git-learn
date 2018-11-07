import Phaser from './phaser'

export default class load extends Phaser.State {
    preload() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        // 加载图片资源
        this.load.baseURL = 'http://localhost:9000/';
        this.load.image('bg', '/asset/bg.png')
        this.load.spritesheet('dishu', '/asset/dishu.png', 32, 32, 6);
    }

    create() {
        this.game.state.start('match');
    }
}