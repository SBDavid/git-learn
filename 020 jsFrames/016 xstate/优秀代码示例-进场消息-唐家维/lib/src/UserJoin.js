// 进场消息-流场图版本
var UserJoin = /** @class */ (function () {
    function UserJoin() {
        // 三个判断条件之间可能存在冲突
        this.isPaused = false;
        this.isKeepDisplay = false;
        this.isDisplay = false;
        // 强制显示两秒
        this.keepDisplayTimer = null;
        // 进场消息
        this.msg = '';
    }
    UserJoin.prototype.pause = function () {
        this.isPaused = true;
    };
    UserJoin.prototype.resume = function () {
        this.isPaused = false;
    };
    // 状态的设置分散在，代码逻辑中
    UserJoin.prototype.userJoin = function (msg) {
        var _this = this;
        if (this.isPaused) {
            return;
        }
        else if (this.isKeepDisplay) {
            // 更新消息
            this.msg = msg;
            clearTimeout(this.keepDisplayTimer);
            setTimeout(function () {
                _this.isKeepDisplay = false;
            }, 2000);
        }
        else if (this.isDisplay) { // 这里的逻辑和上面是一样的，有的人习惯合并在一起写。但是后期需求修改后也可能重新分离。
            // 更新消息
            this.msg = msg;
            clearTimeout(this.keepDisplayTimer);
            setTimeout(function () {
                _this.isKeepDisplay = false;
            }, 2000);
        }
        else { // 这里省略的if条件，使得意义不明确
            // 更新消息
            this.msg = msg;
            // 显示消息
            this.isDisplay = true;
            clearTimeout(this.keepDisplayTimer);
            setTimeout(function () {
                _this.isKeepDisplay = false;
            }, 2000);
        }
    };
    UserJoin.prototype.chatMsg = function () {
        if (this.isPaused) {
            return;
        }
        else if (this.isKeepDisplay) {
            return;
        }
        else {
            this.isDisplay = false;
        }
    };
    UserJoin.prototype.reset = function () {
        // ...
    };
    return UserJoin;
}());
var userJoin = new UserJoin();
userJoin.pause();
console.info(userJoin);
