var game = require('../game'),
    chapterPanel = require('../comps/chapterPanel');

let chooseChapter = function() {


}

chooseChapter.prototype.init = function(level) {
    console.info('chooseChapter level: ' + level);
    this.levelNo = level;
    this.chapterGroup = new Phaser.Group(game);
}

chooseChapter.prototype.preload = function() {
    game.stage.backgroundColor = '#666666';
}

chooseChapter.prototype.create = function() {

    let quitBtn = new Phaser.Button(game, 0, 0, 'quit', function() {
        game.state.start('choseLevel');
    });

    quitBtn.width = 100;
    quitBtn.height = 100;
    game.add.world.add(quitBtn); 

    // 增加关卡
    this.chapterGroup.top = 150;
    game.add.world.add(this.chapterGroup);

    let chapterOne = new chapterPanel(this.levelNo, 1, 300, 300).group;
    chapterOne.top = 0;
    chapterOne.left = 20;
    this.chapterGroup.add(chapterOne);

    let chapterTwo = new chapterPanel(this.levelNo, 2, 300, 300).group;
    chapterTwo.top = 0;
    chapterTwo.left = 340;
    this.chapterGroup.add(chapterTwo);

    let chapterThree = new chapterPanel(this.levelNo, 3, 300, 300).group;
    chapterThree.top = 0;
    chapterThree.left = 660;
    this.chapterGroup.add(chapterThree);
}

module.exports = chooseChapter;