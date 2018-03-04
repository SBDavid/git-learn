var game = require('../game'),
    mazeManager = require('../mazeManager/index'),
    mazeData = require('../mazeData/index');

var utils = require('./utils');

function mazePanel(level, chapter) {
    this.group = new Phaser.Group(game);
    this.screenWidth = game.width;
    this.mazeM = new mazeManager(mazeData['level'+level][chapter-1], this.screenWidth);

    this.init();
}

mazePanel.prototype.init = function() {
    this.initMaze();
    this.initControl();
}

mazePanel.prototype.initMaze = function() {
    this.mazeGroup = new Phaser.Group(game);
    this.group.add(this.mazeGroup);
    this.drawMaze();
}

mazePanel.prototype.initControl = function() {
    this.controlGroup = new Phaser.Group(game);
    this.controlGroup.inputEnableChildren = true;
    this.group.add(this.controlGroup);
    this.drawControl();
}

mazePanel.prototype.drawMaze = function() {
    // 绘制背景
    this.maze = new Phaser.Graphics(game, 0, 0);
    this.maze.beginFill(0xcee7ff);
    this.maze.drawRect(0,0,this.mazeM.mazeSize,this.mazeM.mazeSize);
    this.maze.endFill();

    // 绘制墙体
    for(let x=0; x<this.mazeM.mazeLevel; x++) {
        for(let y=0; y<this.mazeM.mazeLevel; y++) {
            this.dramMazeUnit(x, y);
        }
    }

    // 地图截取
    this.mazeImg = new Phaser.Image(game, 0, 0, this.maze.generateTexture());
    const baseCo = Math.floor((this.mazeM.mazeSize-this.mazeM.screenWidth)/2);
    this.mazeImg.cropRect = new Phaser.Rectangle(baseCo, baseCo, this.mazeM.screenWidth,this.mazeM.screenWidth);
    this.mazeImg.updateCrop();
    this.mazeGroup.add(this.mazeImg);
}

/* 获取单元格左上角基准坐标点 */
mazePanel.prototype.getUnitBaseCo = function(_x, _y) {
    var self = this;
    var offSetX = this.mazeM.borderWidth-Math.floor(this.mazeM.wallWidth/2);
    var offSetY = offSetX;

    return {
        x: offSetX + _x * self.mazeM.unitSize,
        y: offSetY + _y * self.mazeM.unitSize
    }
}

/* 获取单元格中心坐标点 */
mazePanel.prototype.getUnitCenterCo = function(_x, _y) {
    var self = this;
    var offSetX = Math.floor(this.mazeM.borderWidth + this.mazeM.unitSize/2);
    var offSetY = offSetX;

    return {
        x: offSetX + _x * self.mazeM.unitSize,
        y: offSetY + _y * self.mazeM.unitSize
    }
}

// 迷宫单元格
mazePanel.prototype.dramMazeUnit = function(_x, _y) {
    const unitBaseCo = this.getUnitBaseCo(_x, _y);
    const centerCo = this.getUnitCenterCo(_x, _y);
    // 绘制左边
    if (this.mazeM.hasWall(_x, _y, 'l')) {
        this.maze.beginFill(0x999999);
        this.maze.drawRect(unitBaseCo.x, unitBaseCo.y, this.mazeM.wallWidth, this.mazeM.unitSize+this.mazeM.wallWidth);
        this.maze.endFill();
    }

    // 上面
    if (this.mazeM.hasWall(_x, _y, 't')) {
        this.maze.beginFill(0x999999);
        this.maze.drawRect(unitBaseCo.x, unitBaseCo.y, this.mazeM.unitSize+this.mazeM.wallWidth, this.mazeM.wallWidth);
        this.maze.endFill();
    }
    // 绘制右边，只有最右的单元格需要绘制
    if (_x === this.mazeM.mazeLevel-1 && this.mazeM.hasWall(_x, _y, 'r')) {
        this.maze.beginFill(0x999999);
        this.maze.drawRect(unitBaseCo.x + this.mazeM.unitSize, unitBaseCo.y, this.mazeM.wallWidth, this.mazeM.unitSize+this.mazeM.wallWidth);
        this.maze.endFill();
    }
    // 绘制下面，只有最下的单元格需要绘制
    if (_y === this.mazeM.mazeLevel-1 && this.mazeM.hasWall(_x, _y, 'b')) {
        this.maze.beginFill(0x999999);
        this.maze.drawRect(unitBaseCo.x, unitBaseCo.y + this.mazeM.unitSize, this.mazeM.unitSize+this.mazeM.wallWidth, this.mazeM.wallWidth);
        this.maze.endFill();
    }
    // 绘制出口标识
    if (this.mazeM.isExit(_x, _y)) {
        this.maze.beginFill(0xff00ff);
        this.maze.drawCircle(centerCo.x, centerCo.y, this.mazeM.pathWidth/2);
        this.maze.endFill();
    }
}

mazePanel.prototype.moveMaze = function(dir) {
    const self = this;
    if (!this.mazeM.validateMove(dir)) {
        return;
    }

    let moveTween = new Phaser.Tween(this.mazeImg.cropRect, game, game.tweens);
    let tweenTarget = {
        x: this.mazeImg.cropRect.x,
        y: this.mazeImg.cropRect.y
    }
    if (dir === 't') {
        tweenTarget.y -= this.mazeM.unitSize;
    } else if (dir === 'b') {
        tweenTarget.y += this.mazeM.unitSize;
    } else if (dir === 'l') {
        tweenTarget.x -= this.mazeM.unitSize;
    } else if (dir === 'r') {
        tweenTarget.x += this.mazeM.unitSize;
    }
    moveTween.to(tweenTarget, 500, Phaser.Easing.Quadratic.InOut);
    
    let event = game.time.events.loop(0, function() {
        self.mazeImg.updateCrop();
    });

    moveTween.onComplete.add(function() {
        self.mazeImg.updateCrop();
        game.time.events.remove(event);
        self.mazeM.move(dir);
        self.showArrow();
    });

    moveTween.start(); 
}

mazePanel.prototype.drawControl = function() {
    this.drawPeople();
    this.drawArrow();
    this.showArrow();
}

/* 绘制小人 */
mazePanel.prototype.drawPeople = function() {
    this.people = new Phaser.Graphics(game, 0, 0);
    const center = Math.floor(this.mazeM.screenWidth/2);
    this.people.beginFill(0xffff00);
    this.people.drawCircle(center,center,this.mazeM.pathWidth/2);
    this.people.endFill();

    this.controlGroup.add(this.people);
}

/* 绘制箭头 */
mazePanel.prototype.drawArrow = function() {
    const self = this;
    const center = Math.floor(this.mazeM.screenWidth/2);
    const size = this.mazeM.unitSize/4;

    this.arraws = {};

    // 上箭头
    this.arraws.upArraw = utils.drawUpArrow({x: center, y: center - this.mazeM.unitSize}, size);
    this.arraws.upArraw.inputEnabled = true;
    this.arraws.upArraw.events.onInputUp.add(function() {
        self.hideArrow();
        self.moveMaze('t');
    })
    // 右箭头
    this.arraws.rightArraw = utils.drawRightArrow({x: center + this.mazeM.unitSize, y: center}, size);
    this.arraws.rightArraw.inputEnabled = true;
    this.arraws.rightArraw.events.onInputUp.add(function() {
        self.hideArrow();
        self.moveMaze('r');
    })
    // 下箭头
    this.arraws.bottomArraw = utils.drawBottomArrow({x: center, y: center + this.mazeM.unitSize}, size);
    this.arraws.bottomArraw.inputEnabled = true;
    this.arraws.bottomArraw.events.onInputUp.add(function() {
        self.hideArrow();
        self.moveMaze('b');
    })
    // 左箭头
    this.arraws.leftArraw = utils.drawLeftArrow({x: center - this.mazeM.unitSize, y: center}, size);
    this.arraws.leftArraw.inputEnabled = true;
    this.arraws.leftArraw.events.onInputUp.add(function() {
        self.hideArrow();
        self.moveMaze('l');
    })
}

/* 隐藏箭头 */
mazePanel.prototype.hideArrow = function() {
    this.controlGroup.remove(this.arraws.upArraw);
    this.controlGroup.remove(this.arraws.rightArraw);
    this.controlGroup.remove(this.arraws.bottomArraw);
    this.controlGroup.remove(this.arraws.leftArraw);
}
/* 显示箭头 */
mazePanel.prototype.showArrow = function() {
    const currentCo = this.mazeM.currentCo;
    // 上箭头
    if (!this.mazeM.hasWall(currentCo.x, currentCo.y, 't') && currentCo.y !== 0) {
        this.controlGroup.add(this.arraws.upArraw);
    } 
    // 右箭头
    if (!this.mazeM.hasWall(currentCo.x, currentCo.y, 'r') && currentCo.x !== this.mazeM.mazeLevel-1) {
        this.controlGroup.add(this.arraws.rightArraw);
    } 
    // 下箭头
    if (!this.mazeM.hasWall(currentCo.x, currentCo.y, 'b') && currentCo.y !== this.mazeM.mazeLevel-1) {
        this.controlGroup.add(this.arraws.bottomArraw);
    } 
    // 左箭头
    if (!this.mazeM.hasWall(currentCo.x, currentCo.y, 'l') && currentCo.x !== 0) {
        this.controlGroup.add(this.arraws.leftArraw);
    } 
}

module.exports = mazePanel;