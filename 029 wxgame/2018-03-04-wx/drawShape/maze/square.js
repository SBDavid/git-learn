// 方形迷宫

import { Utils } from "./utils";

// 最大显示数量
const maxDisplaySize = 5;
const mazeWallRatio = 0.2;

export default class Square {
    constructor(mazeSize = 250, mazeData) {
        // 迷宫总容器（包含遮罩）
        this.mazeContCavans = wx.createCanvas();
        this.mazeContCtx = this.mazeContCavans.getContext('2d');
        // 迷宫全局图
        this.mazeCavans = wx.createCanvas();
        this.mazeCtx = this.mazeCavans.getContext('2d');
        this.mazeSize = mazeSize;
        this.mazeData = mazeData;
        // 可视范围
        this.visSize = 3;
        // 全局配置
        this.globalCfg = GameGlobal.globalCfg;
        this.initMaze();
        this.drawMaze();
    }

    /* 初始化 */
    initMaze() {
        // 计算迷宫单元格的尺寸
        this.unitSize = Math.floor(this.mazeSize / maxDisplaySize);
        // 计算墙体厚度
        this.wallWidth = Math.floor(this.unitSize * mazeWallRatio);
        // 计算走道宽度
        this.pathWidth = this.unitSize - this.wallWidth;
        // 边框的宽度
        this.mazeMarginWidth = this.unitSize * Math.floor(maxDisplaySize / 2);
        // 迷宫总体宽高
        this.mazeCavans.width = this.mazeCavans.height = this.unitSize * this.mazeData.level + 2 * this.mazeMarginWidth;
        // 迷宫容器高度
        this.mazeContCtx.width = this.mazeContCtx.height = this.globalCfg.mazeContH;
    }

    /* 绘制迷宫 */
    drawMaze() {
        // 绘制背景
        this.mazeCtx.fillStyle = '#cee7ff';
        this.mazeCtx.fillRect(0,0,this.mazeCavans.width, this.mazeCavans.height);

        // 绘制单元格
        for (let x=0; x < this.mazeData.level; x++) {
            for (let y=0; y < this.mazeData.level; y++) {
                this.drawMazeUnit(x,y);
            }
        }
        
    }

    /* 获取单元格左上角基准坐标点 */
    getUnitBaseCo(_x, _y) {
        var self = this;
        var offSetX = this.mazeMarginWidth;
        var offSetY = this.mazeMarginWidth;

        return {
            x: offSetX + _x * self.unitSize,
            y: offSetY + _y * self.unitSize
        }
    }

    /* 绘制迷宫单元格 */
    drawMazeUnit(x, y) {

        // 获取左上角基准
        const unitBaseCo = this.getUnitBaseCo(x, y);
        const centerCo = {
            x: unitBaseCo.x + this.wallWidth + Math.floor(this.pathWidth / 2),
            y: unitBaseCo.y + this.wallWidth + Math.floor(this.pathWidth / 2)
        }
        // 绘制左边
        if (this.mazeData.pathData[x][y].l) {
            this.mazeCtx.fillStyle = '#999';
            this.mazeCtx.fillRect(unitBaseCo.x, unitBaseCo.y, this.wallWidth, this.unitSize + this.wallWidth);
        } 
        // 绘制上边
        if (this.mazeData.pathData[x][y].t) {
            this.mazeCtx.fillStyle = '#999';
            this.mazeCtx.fillRect(unitBaseCo.x, unitBaseCo.y, this.unitSize + this.wallWidth, this.wallWidth);
        } 
        // 绘制右边，只有最右的单元格需要绘制
        if (x === this.mazeData.level-1 && this.mazeData.pathData[x][y].r) {
            this.mazeCtx.fillStyle = '#999';
            this.mazeCtx.fillRect(unitBaseCo.x + this.unitSize, unitBaseCo.y, this.wallWidth, this.unitSize + this.wallWidth);
        }
        // 绘制下面，只有最下的单元格需要绘制
        if (y === this.mazeData.level-1 && this.mazeData.pathData[x][y].b) {
            this.mazeCtx.fillStyle = '#999';
            this.mazeCtx.fillRect(unitBaseCo.x, unitBaseCo.y + this.unitSize, this.unitSize + this.wallWidth, this.wallWidth);
        }
        // 绘制出口标识
        if (x === this.mazeData.exitX && y === this.mazeData.exitY) {
            this.mazeCtx.fillStyle = "yellow";
            this.mazeCtx.beginPath();
            this.mazeCtx.arc(centerCo.x,
                centerCo.y,
                15,
                0,
                Math.PI * 2,
                false
                );
            this.mazeCtx.fill();
        }
    }

    /* 迷宫可视范围截取 */
    cutMaze({ _x, _y, offSetX, offSetY}) {
        // 计算起始点
        const unitBaseCo = this.getUnitBaseCo(_x, _y);
        const sx = unitBaseCo.x - this.unitSize * Math.floor(this.visSize / 2);
        const sy = unitBaseCo.y - this.unitSize * Math.floor(this.visSize / 2);
        // 计算截取长度
        const sWidth = this.unitSize * this.visSize + this.wallWidth;
        const sHeight = this.unitSize * this.visSize + this.wallWidth;
        // 截图
        return this.mazeCtx.getImageData(sx, sy, sWidth, sHeight);
    }

    /* 坐标溢出检测 */
    validateCo(_x, _y) {
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

    /* 绘制迷宫容器，以及迷宫可视区 */
    drawMazeCont({_x, _y}) {
                
        this.validateCo(_x, _y);
        // 背景
        this.mazeContCtx.fillStyle = "#91c5f9";
        this.mazeContCtx.fillRect(0, 0, this.globalCfg.mazeContH, this.globalCfg.mazeContH);
        // 迷宫居中绘制
        const visMazeArea = this.cutMaze({
            _x: _x,
            _y: _y,
            offSetX: 0,
            offSetY: 0
        });
        const sx = Math.floor((this.mazeContCavans.width - visMazeArea.width) / 2);
        const sy = sx;
        this.mazeContCtx.putImageData(visMazeArea, sx, sy);
        // 绘制小人
        this.drawPeople();
        // 绘制箭头
        this.drawArrow({_x, _y});
    }

    /* 绘制小人 */
    drawPeople() {
        this.mazeContCtx.fillStyle = "red";
        this.mazeContCtx.beginPath();
        this.mazeContCtx.arc(Math.floor(this.globalCfg.mazeContH / 2),
            Math.floor(this.globalCfg.mazeContH / 2),
            15,
            0,
            Math.PI * 2,
            false
            );
        this.mazeContCtx.fill();
    }

    /* 绘制箭头 */
    drawArrow({_x, _y}) {
        var stepData = this.mazeData.pathData[_x][_y];
        // 上箭头
        if (!stepData.t && _y !== 0 /* 最上面一行不需要要向上箭头 */) {
            Utils.drawUpArrow({
                ctx: this.mazeContCtx,
                baseCo: {
                    x: Math.floor(this.globalCfg.mazeContH / 2),
                    y: Math.floor(this.globalCfg.mazeContH / 2) - this.unitSize,
                },
                size: this.pathWidth
            })
        }
        // 右箭头
        if (!stepData.r && _x !== this.mazeData.level-1 /* 最右面一行不需要要向右箭头 */) {
            Utils.drawRightArrow({
                ctx: this.mazeContCtx,
                baseCo: {
                    x: Math.floor(this.globalCfg.mazeContH / 2) + this.unitSize,
                    y: Math.floor(this.globalCfg.mazeContH / 2),
                },
                size: this.pathWidth
            })
        }
        // 下箭头
        if (!stepData.b && _y !== this.mazeData.level-1) {
            Utils.drawBottomArrow({
                ctx: this.mazeContCtx,
                baseCo: {
                    x: Math.floor(this.globalCfg.mazeContH / 2),
                    y: Math.floor(this.globalCfg.mazeContH / 2) + this.unitSize,
                },
                size: this.pathWidth
            })
        }
        // 左箭头
        if (!stepData.l && _x !== 0) {
            Utils.drawLeftArrow({
                ctx: this.mazeContCtx,
                baseCo: {
                    x: Math.floor(this.globalCfg.mazeContH / 2) - this.unitSize,
                    y: Math.floor(this.globalCfg.mazeContH / 2),
                },
                size: this.pathWidth
            })
        }
    }
}