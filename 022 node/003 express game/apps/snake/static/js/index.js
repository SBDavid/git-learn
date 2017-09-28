function coModel(x,y) {
    return {
        x: x,
        y: y
    }
}

function gameModel(x,y) {
    this.x = x;
    this.y = y;
}

gameModel.prototype.init = function() {
    this.head = coModel(1, 0);

    this.body = [this.head, coModel(0, 0)];
}

gameModel.prototype.moveRight = function() {
    this.body.pop();
    this.body.unshift(coModel(this.body[0].x + 1, this.body[0].y));
}

function gameView(model) {
    this.gameM = model;

    this.rootCon = document.getElementById('root');
    this.blocks = Array.prototype.slice.call(this.rootCon.getElementsByClassName('block'), 0);
}

gameView.prototype.displayBody = function() {
    var self = this;
    $.each(self.gameM.body, function(index, item){
        self.show(item);
    });
}

gameView.prototype.moveRight = function() {
    var newHead = coModel(this.gameM.body[0].x + 1, this.gameM.body[0].y);
    this.show(newHead);
    this.hide(this.gameM.body[this.gameM.body.length - 1]);
    this.gameM.moveRight();
    console.info(this.gameM.body)
}

gameView.prototype.hide = function(co) {
    var self = this;
    $(self.blocks[getNum(co)]).removeClass('show');
    $(self.blocks[getNum(co)]).addClass('hide');
}
gameView.prototype.show = function(co) {
    var self = this;
    $(self.blocks[getNum(co)]).removeClass('hide');
    $(self.blocks[getNum(co)]).addClass('show');
}

window.onload = function () {
    

    // 监听键盘事件
/*     window.addEventListener('keyup', function(event){
        hide(currentCo);
        if (event.keyCode === 38 && currentCo.y > 0) {
            console.log('上');
            currentCo.y--;
        } else if (event.keyCode === 39 && currentCo.x < 9) {
            console.log('右');
            currentCo.x++;
        } else if (event.keyCode === 40 && currentCo.y < 9) {
            console.log('下');
            currentCo.y++;
        } else if (event.keyCode === 37 && currentCo.x > 0) {
            console.log('左');
            currentCo.x--;
        }
        show(currentCo);
    }) */

    var gameM = new gameModel(10,10);
    gameM.init();
    var gameV = new gameView(gameM);

    gameV.displayBody();
    gameV.moveRight();
    gameV.moveRight();
}

function getNum(co) {
    if (!co) {
        return 0;
    }

    return co.x + co.y * 10;
}
