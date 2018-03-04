var game = require('../game');

module.exports = {
    drawUpArrow: function(baseCo, size) { 
        let arrow = new Phaser.Graphics(game, 0, 0);
        arrow.beginFill(0x4CAF50);
        arrow.drawPolygon([
            new Phaser.Point(baseCo.x, baseCo.y-size),
            new Phaser.Point(baseCo.x-size, baseCo.y+size),
            new Phaser.Point(baseCo.x+size, baseCo.y+size)
        ]);
        arrow.endFill();
        return arrow;
    },
    drawRightArrow: function(baseCo, size) { 
        let arrow = new Phaser.Graphics(game, 0, 0);
        arrow.beginFill(0x4CAF50);
        arrow.drawPolygon([
            new Phaser.Point(baseCo.x+size, baseCo.y),
            new Phaser.Point(baseCo.x-size, baseCo.y-size),
            new Phaser.Point(baseCo.x-size, baseCo.y+size)
        ]);
        arrow.endFill();
        return arrow;
    },
    drawBottomArrow: function(baseCo, size) { 
        let arrow = new Phaser.Graphics(game, 0, 0);
        arrow.beginFill(0x4CAF50);
        arrow.drawPolygon([
            new Phaser.Point(baseCo.x, baseCo.y+size),
            new Phaser.Point(baseCo.x-size, baseCo.y-size),
            new Phaser.Point(baseCo.x+size, baseCo.y-size)
        ]);
        arrow.endFill();
        return arrow;
    },
    drawLeftArrow: function(baseCo, size) { 
        let arrow = new Phaser.Graphics(game, 0, 0);
        arrow.beginFill(0x4CAF50);
        arrow.drawPolygon([
            new Phaser.Point(baseCo.x-size, baseCo.y),
            new Phaser.Point(baseCo.x+size, baseCo.y-size),
            new Phaser.Point(baseCo.x+size, baseCo.y+size)
        ]);
        arrow.endFill();
        return arrow;
    }
}