"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 进场消息
class UserJoin {
  constructor() {
    _defineProperty(this, "isPaused", false);

    _defineProperty(this, "isKeepDisplay", false);

    _defineProperty(this, "isDisplay", false);

    _defineProperty(this, "keepDisplayTimer", null);

    _defineProperty(this, "msg", '');
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  } // 状态的设置分散在，代码逻辑中


  userJoin(msg) {
    if (this.isPaused) {
      return;
    } else if (this.isKeepDisplay) {
      // 更新消息
      this.msg = msg;
      clearTimeout(this.keepDisplayTimer);
      setTimeout(() => {
        this.isKeepDisplay = false;
      }, 2000);
    } else if (this.isDisplay) {
      // 这里的逻辑和上面是一样的，有的人习惯合并在一起写。但是后期需求修改后也可能重新分离。
      // 更新消息
      this.msg = msg;
      clearTimeout(this.keepDisplayTimer);
      setTimeout(() => {
        this.isKeepDisplay = false;
      }, 2000);
    } else {
      // 这里省略的if条件，使得意义不明确
      // 更新消息
      this.msg = msg; // 显示消息

      this.isDisplay = true;
      clearTimeout(this.keepDisplayTimer);
      setTimeout(() => {
        this.isKeepDisplay = false;
      }, 2000);
    }
  }

  chatMsg() {
    if (this.isPaused) {
      return;
    } else if (this.isKeepDisplay) {
      return;
    } else {
      this.isDisplay = false;
    }
  }

  reset() {// ...
  }

}

const userJoin = new UserJoin();
userJoin.pause();
console.info(userJoin);