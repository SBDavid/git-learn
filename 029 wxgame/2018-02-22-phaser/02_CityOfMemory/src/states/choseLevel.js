var game = require('../game'),
    levelPanel = require('../comps/levelPanel');

let choseLevel = function() {


}

choseLevel.prototype.preload = function() {
    game.stage.backgroundColor = '#999999';
}

choseLevel.prototype.create = function() {

    var title = game.add.text(0, 0, '选择难度', {
        fontSize: '80px',
        fontWeight: 'bold',
        fill: '#f2bb15'
    });
    /* title.inputEnabled = true;

    console.info(title.events.onInputUp.add(function() {
        console.info(111);
    })); */

    // 增加level5
    var level5 = new levelPanel(5).group;
    level5.top = 100;
    level5.left = 40;
    game.add.world.add(level5);
}

module.exports = choseLevel;