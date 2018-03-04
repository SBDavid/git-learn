var game = require('../game');

function globalStatePanel(level, chapter) {
    this.group = new Phaser.Group(game);

    let title = new Phaser.Text(game, 0, 0, `LEVEL: ${level} CHAPTER: ${chapter}`, {
        fontSize: '80px',
        fontWeight: 'bold',
        fill: '#f2bb15'
    });
    this.group.add(title);
}

module.exports = globalStatePanel;