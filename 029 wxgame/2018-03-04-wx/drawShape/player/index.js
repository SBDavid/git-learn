import FinishAlert from "./finishAlert";

export default class index {
    constructor(ctx, _maze, mazeData) {
        this.screemCtx = ctx;
        this._maze = _maze;
        this.mazeData = mazeData;
        this.globalCfg = GameGlobal.globalCfg;
        this.currentCo = null;
        this.maze = null;
        this.finishAlert = new FinishAlert(ctx);
        // 按钮位置
        this.btnArea = {};
        // 计步器
        this.stepConter = 0;
        // 计时器
        this.startTime = 0;
        this.init();
    }

    init() {
        // 构建maze
        this.maze = new this._maze(this.globalCfg.mazeContH * 0.95, this.mazeData);
        // 计算按钮位置
        this.getBtnArea();
        // 移动事件绑定
        wx.onTouchStart(this.touchStartHandler.bind(this));
    }
    /* 按钮位置计算，按圆形计算 */
    getBtnArea() {
        let self = this;
        const centerX = Math.floor(this.globalCfg.mazeContH / 2);
        const centerY = Math.floor(this.globalCfg.mazeContH / 2) + this.globalCfg.statusContH;
        // 上按钮
        this.btnArea.t = {
            x: centerX,
            y: centerY - self.maze.unitSize
        };
        // 右
        this.btnArea.r = {
            x: centerX + self.maze.unitSize,
            y: centerY
        };
        // 下按钮
        this.btnArea.b = {
            x: centerX,
            y: centerY + self.maze.unitSize
        };
        // 左
        this.btnArea.l = {
            x: centerX - self.maze.unitSize,
            y: centerY
        };
    }

    /* 按钮点击测试 */
    btnHitTest(_x, _y) {
        let self = this;
        function getDistance(x1, x2) {
            return Math.abs(x1 - x2) <= self.maze.unitSize / 2;
        }
        // 上
        if (getDistance(_x, this.btnArea.t.x) && getDistance(_y, this.btnArea.t.y)) {
            return 't';
        } else if (getDistance(_x, this.btnArea.r.x) && getDistance(_y, this.btnArea.r.y)) {
            return 'r';
        } else if (getDistance(_x, this.btnArea.b.x) && getDistance(_y, this.btnArea.b.y)) {
            return 'b';
        } else if (getDistance(_x, this.btnArea.l.x) && getDistance(_y, this.btnArea.l.y)) {
            return 'l';
        }else {
            return null;
        }
    }

    /* 按坐标绘制maze */
    moveToMaze(_x, _y) {
        this.maze.drawMazeCont({
            _x: _x,
            _y: _y
        })
        this.screemCtx.drawImage(this.maze.mazeContCavans, 0, this.globalCfg.statusContH);
    }

    start() {
        let self = this;
        // 设置初始坐标
        this.currentCo = {
            x: this.mazeData.entryX,
            y: this.mazeData.entryY
        }
        // 计步器归零
        this.stepConter = 0;
        // 计时器归零
        this.startTime = 0;
        // 初始渲染
        this.moveToMaze(this.currentCo.x, this.currentCo.y);
    }

    touchStartHandler(e) {
        let self = this;
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const direction = self.btnHitTest(clientX, clientY);
        // 不是方向按钮
        if (!direction) {
            return;
        }
        self.move(direction);
    }

    move(direction) {
        // 无效按钮，导入不通
        if (this.mazeData.pathData[this.currentCo.x][this.currentCo.y][direction]) {
            return;
        }

        let touchEndHandler = function() {
            wx.offTouchEnd(touchEndHandler);

            let newCo = {
                x: this.currentCo.x,
                y: this.currentCo.y
            }
            if (direction === 't') {
                newCo.y--;
            } else if (direction === 'r') {
                newCo.x++;
            } else if (direction === 'b') {
                newCo.y++;
            } else if (direction === 'l') {
                newCo.x--;
            }

            // 坐标溢出检测
            if (this.maze.validateCo(newCo.x, newCo.y)) {
                this.currentCo = newCo;
                this.stepConter++;
                if (this.startTime === 0) {
                    this.startTime  = Date.now();
                }
                // 移动
                this.moveToMaze(this.currentCo.x, this.currentCo.y);
                // 判断是否走出迷宫
                if (this.currentCo.x === this.mazeData.exitX && this.currentCo.y === this.mazeData.exitY) {
                    this.finishMaze();
                }
            }

        }.bind(this);
        wx.onTouchEnd(touchEndHandler)
    }

    /* 完成迷宫 */
    finishMaze() {
        let self = this;
        const finishTime = Date.now();
        this.finishAlert.alert(this.stepConter, finishTime - this.startTime, function() {
            self.start();
        });
    }
}