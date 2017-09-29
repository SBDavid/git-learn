/* 坐标 */
function coModel(x,y) {
    return {
        x: x,
        y: y
    }
}
/* 方向 */
var moveDirection = {
    up: 38,
    right: 39,
    down: 40,
    left: 37
};
/* model */
function gameModel(x,y) {
    this.x = x;
    this.y = y;
    this.foods = [];
}

gameModel.prototype.init = function() {
    this.body = [coModel(3, 0), coModel(2, 0), coModel(1, 0), coModel(0, 0)];
}

gameModel.prototype.nextStepPosition = function(moveDir) {
    switch (moveDir) {
        case moveDirection.up:
            return coModel(this.body[0].x, this.body[0].y - 1);
            break;
        
        case moveDirection.right:
            return coModel(this.body[0].x + 1, this.body[0].y);
            break;    

        case moveDirection.down:
            return coModel(this.body[0].x, this.body[0].y + 1);
            break;
        
        case moveDirection.left:
            return coModel(this.body[0].x - 1, this.body[0].y);
            break;       

        default:
            break;
    }
}

gameModel.prototype.move = function(moveDir) {
    this.body.pop();
    this.body.unshift(this.nextStepPosition(moveDir));
}

gameModel.prototype.eat = function(co) {
    this.body.unshift(co);
}

gameModel.prototype.feed = function(co) {
    this.foods.push(co);
}

gameModel.prototype.randonFeed = function() {
    var self = this;
    function generate() {
        var rx = Math.floor(Math.random() * self.x);
        var ry = Math.floor(Math.random() * self.y);

        var confilct = false;
        self.body.forEach(function(item) {
            if (item.x === rx && item.y === ry)
                confilct = true;
        })
        if (confilct) {
            return generate();
        } else {
            return coModel(rx, ry);
        }
    }

    var foodCo = generate();
    this.feed(generate());
    return foodCo;
}

gameModel.prototype.unfeed = function(co) {
    var index = this.foods.indexOf(function(item){
        return item.x === co.x && item.y === co.y;
    })
    if (index !== -1) {
        this.foods.splice(index, 1);
    }
}

function gameView(model) {
    var self = this;
    this.gameM = model;

    this.rootCon = document.getElementById('root');
    this.blocks = Array.prototype.slice.call(this.rootCon.getElementsByClassName('block'), 0);

    // 事件挂载
    window.addEventListener('keyup', function(event){
        var nextStep = self.gameM.nextStepPosition(event.keyCode);
        if ($(self.blocks[getNum(nextStep)]).attr('food') === 'true') {
            self.eat(nextStep);
        } else {
            self.moveHandler(event);
        }
    })
}

gameView.prototype.displayBody = function() {
    var self = this;
    $.each(self.gameM.body, function(index, item){
        self.show(item);
    });
    self.showHead();
}

gameView.prototype.move = function(moveDir) {
    var newHead = this.gameM.nextStepPosition(moveDir);
    this.show(newHead);
    this.hide(this.gameM.body[this.gameM.body.length - 1]);
    this.gameM.move(moveDir);
    this.showHead();
}

gameView.prototype.moveHandler = function(event) {
    var self = this;
    var head = self.gameM.body[0];
    // 不能碰撞
    var nextStep = self.gameM.nextStepPosition(event.keyCode);
    var confilct = false;
    self.gameM.body.forEach(function(item) {
        if (nextStep.x === item.x && nextStep.y === item.y) {
            confilct = true;
        }
    });
    if (confilct) return;

    if (event.keyCode === 38 && head.y > 0) {
        console.log('上');
        self.move(moveDirection.up);
    } else if (event.keyCode === 39 && head.x < self.gameM.x - 1) {
        console.log('右');
        self.move(moveDirection.right);
    } else if (event.keyCode === 40 && head.y < self.gameM.y - 1) {
        console.log('下');
        self.move(moveDirection.down);
    } else if (event.keyCode === 37 && head.x > 0) {
        console.log('左');
        self.move(moveDirection.left);
    }
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

gameView.prototype.showHead = function() {
    var self = this;
    $(self.blocks[getNum(self.gameM.body[0])]).addClass('head');
    $(self.blocks[getNum(self.gameM.body[1])]).removeClass('head');
}

gameView.prototype.eat = function(co) {
    var self = this;
    self.show(co);
    self.gameM.eat(co);
    self.unfeed(co);
    self.showHead();
    self.randonFeed();
}

gameView.prototype.feed = function(co) {
    var self = this;
    $(self.blocks[getNum(co)]).attr('food', true);
    $(self.blocks[getNum(co)]).addClass('food');
    self.gameM.feed(co);
}

gameView.prototype.randonFeed = function() {
     var foodCo = this.gameM.randonFeed();
     this.feed(foodCo);
}

gameView.prototype.unfeed = function(co) {
    var self = this;
    $(self.blocks[getNum(co)]).attr('food', false);
    $(self.blocks[getNum(co)]).removeClass('food');
    self.gameM.unfeed(co);
}

window.onload = function () {

    var gameM = new gameModel(10,10);
    gameM.init();
    var gameV = new gameView(gameM);

    gameV.displayBody();

    // feed
    gameV.randonFeed();
}

function getNum(co) {
    if (!co) {
        return 0;
    }

    return co.x + co.y * 10;
}
