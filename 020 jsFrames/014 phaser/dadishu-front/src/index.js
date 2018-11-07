import Phaser from './phaser'

import load from './load'
import match from './match'

const game = new Phaser.Game(375, 667, Phaser.AUTO, '#game');

game.state.add('load', load);
game.state.add('match', match);
game.state.start('load')
