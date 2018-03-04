var game = require('../game');

function levelPanel(level) {
    this.group = new Phaser.Group(game);
    this.group.inputEnableChildren = true;

    let bg = new Phaser.Graphics(game, 0, 0);
    bg.beginFill(0xff0000);
    bg.drawRect(0,0,900,300);
    bg.endFill();

    this.group.add(bg);

    let Level = new Phaser.Text(game, 0, 0, level+'', {
        fontSize: '80px',
        fontWeight: 'bold',
        fill: '#f2bb15'
    });
    this.group.add(Level);

    // 事件
    this.group.onChildInputUp.add(function() {
        game.state.start('chooseChapter', true, false, level);
    })
}

module.exports = levelPanel;