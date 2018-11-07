window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const game = new Phaser.Game(300, 600, Phaser.AUTO, '#game');

class GameState extends Phaser.State {
    preload() {
        console.info('preload');

        this.load.baseURL = 'http://localhost:9000/';
        this.load.crossOrigin = 'anonymous';
        this.load.image('spirit', 'asset/09.png');
    }

    create() {

        this.sprite = this.add.button(0, 0, 'spirit', () => {
            console.info('hit')
        });
    }
}

const state = new GameState();

game.state.add('game', state, true);

const button = new Phaser.Sprite(game, 0, 0);