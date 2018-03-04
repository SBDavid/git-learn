function mazeManager(mazeData, screenWidth) {
    this.mazeData = mazeData;
    this.screenWidth = screenWidth;
    this.init();
}

mazeManager.prototype.init = function() {
    var self = this;
    // 当前坐标
    this.currentCo = {
        x: self.mazeData.entryX,
        y: self.mazeData.entryY
    }
    // 迷宫尺寸
    this.mazeLevel = this.mazeData.pathData.length;
    // 可见尺寸
    this.visSize = 3;
    // 单元格宽度
    this.unitSize = Math.floor(this.screenWidth/5);
    // 边框宽度
    this.borderWidth = this.unitSize*2;
    // 墙体厚度
    this.wallWidth = Math.floor(this.unitSize * 0.2);
    // 通道宽度
    this.pathWidth = this.unitSize - this.wallWidth;
    // 迷宫中宽高
    this.mazeSize = this.borderWidth*2 + this.unitSize*this.mazeLevel;
}

mazeManager.prototype.validateCo = function(_x, _y) {
    if (!this.mazeData.pathData[_x]) {
        console.error('X坐标溢出');
        return false;
    }
    if (!this.mazeData.pathData[_x][_y]) {
        console.error('Y坐标溢出');
        return false;
    }
    return true;
}

mazeManager.prototype.validateMove = function(dir) {
    const nextCo = this.getMoveCo(dir);

    return this.validateCo(nextCo.x, nextCo.y);
}

mazeManager.prototype.getMoveCo = function(dir) {
    const nextCo = {
        x: this.currentCo.x,
        y: this.currentCo.y
    }

    if (dir === 't') {
        nextCo.y--;
    } else if (dir === 'r') {
        nextCo.x++;
    } else if (dir === 'b') {
        nextCo.y++;
    } else if (dir === 'l') {
        nextCo.x--;
    }

    return nextCo;
}

mazeManager.prototype.move = function(dir) {

    if (dir === 't') {
        this.currentCo.y--;
    } else if (dir === 'r') {
        this.currentCo.x++;
    } else if (dir === 'b') {
        this.currentCo.y++;
    } else if (dir === 'l') {
        this.currentCo.x--;
    }
}

// 是否是出口位置
mazeManager.prototype.isExit = function(_x, _y) {
    return _x === this.mazeData.exitX && _y === this.mazeData.exitY;
}

mazeManager.prototype.hasWall = function(_x, _y, dir) {
    if (!this.validateCo(_x, _y)) {
        return;
    }
    // 左
    if (dir === 'l') {
        if (_x === 0) {
            return !this.isExit(_x, _y);
        } else {
            const path = this.mazeData.pathData[_x][_y];
            return path.l;
        }
    } else if (dir === 't'){
        if (_y === 0) {
            return !this.isExit(_x, _y);
        } else {
            const path = this.mazeData.pathData[_x][_y];
            return path.t;
        }
    } else if (dir === 'r'){
        // 右边框
        if(_x === this.mazeLevel - 1) {
            return !this.isExit(_x, _y);
        } else {
            const path = this.mazeData.pathData[_x+1][_y];
            return path.l;
        }
    } else if (dir === 'b'){
        // 下边框
        if(_y === this.mazeLevel - 1) {
            return !this.isExit(_x, _y);
        } else {
            const path = this.mazeData.pathData[_x][_y+1];
            return path.t;
        }
    }
}

module.exports = mazeManager;