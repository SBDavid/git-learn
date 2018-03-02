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

    // 增加level5
    var level5 = new levelPanel(5).group;
    level5.top = 100;
    level5.left = 40;
    game.add.world.add(level5);

    // 增加level7
    var level7 = new levelPanel(7).group;
    level7.top = 450;
    level7.left = 40;
    game.add.world.add(level7);

    // 增加level9
    var level9 = new levelPanel(9).group;
    level9.top = 800;
    level9.left = 40;
    game.add.world.add(level9);
}

module.exports = choseLevel;