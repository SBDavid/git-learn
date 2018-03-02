var game = require('../game'),
    chapterPanel = require('../comps/chapterPanel');

let chooseChapter = function() {


}

chooseChapter.prototype.init = function(level) {
    this.levelNo = level
    this.chapterGroup = new Phaser.Group(game);
}

chooseChapter.prototype.preload = function() {
    game.stage.backgroundColor = '#666666';
}

chooseChapter.prototype.create = function() {

    var title = game.add.text(0, 0, '选择关卡', {
        fontSize: '80px',
        fontWeight: 'bold',
        fill: '#f2bb15'
    });

    // 增加关卡
    this.chapterGroup.top = 100;
    game.add.world.add(this.chapterGroup);

    let chapterOne = new chapterPanel(this.levelNo, 1, 300, 300);
    chapterOne.top = 0;
    chapterOne.left = 0;
    this.chapterGroup.add(chapterOne.group);

    let chapterTwo = new chapterPanel(this.levelNo, 2, 300, 300).group;
    chapterTwo.top = 0;
    chapterTwo.left = 320;
    this.chapterGroup.add(chapterTwo);

    let chapterThree = new chapterPanel(this.levelNo, 3, 300, 300).group;
    chapterThree.top = 0;
    chapterThree.left = 640;
    this.chapterGroup.add(chapterThree);
}

module.exports = chooseChapter;