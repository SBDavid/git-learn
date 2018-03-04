var game = require('../game');

function chapterPanel(level, chapter, width, height) {
    var self = this;
    this.levelNo = level;
    this.chapterNo = chapter;

    this.group = new Phaser.Group(game);
    this.group.inputEnableChildren = true;

    let bg = new Phaser.Graphics(game, 0, 0);
    bg.beginFill(0xff0000);
    bg.drawRect(0,0,width,height);
    bg.endFill();

    this.group.add(bg);

    let chapterTitle = new Phaser.Text(game, 0, 0, chapter+'', {
        fontSize: '80px',
        fontWeight: 'bold',
        fill: '#f2bb15'
    });
    this.group.add(chapterTitle);

    // 事件
    this.group.onChildInputUp.add(function() {
        game.state.start('play', true, false, {
            level: self.levelNo,
            chapter: self.chapterNo
        });
    })
}

module.exports = chapterPanel;