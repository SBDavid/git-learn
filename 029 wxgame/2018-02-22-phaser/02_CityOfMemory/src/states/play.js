var game = require('../game'),
    globalStatePanel = require('../comps/globalStatePanel'),
    mazePanel = require('../comps/mazePanel');

let play = function() {


}

play.prototype.init = function({level, chapter}) {
    console.info(`play level: ${level} chapter: ${chapter}`);
    this.levelNo = level;
    this.chapterNo = chapter;
    this.chapterGroup = new Phaser.Group(game);
}

play.prototype.preload = function() {
    game.stage.backgroundColor = '#333333';
}

play.prototype.create = function() {
    var self = this;
    // 推出按钮
    let quitBtn = new Phaser.Button(game, 0, 0, 'quit', function() {
        game.state.start('chooseChapter', true, false, self.levelNo);
    });

    quitBtn.width = 100;
    quitBtn.height = 100;
    game.add.world.add(quitBtn); 
    // global state
    this.globalStateP = new globalStatePanel(this.levelNo, this.chapterNo).group;
    this.globalStateP.top = 0;
    this.globalStateP.left = 100;
    game.add.world.add(this.globalStateP);
    // game state
    // maze
    this.mazeP = new mazePanel(this.levelNo, this.chapterNo).group;
    this.mazeP.top = 100;
    this.mazeP.left = 0;
    game.add.world.add(this.mazeP);
}

module.exports = play;