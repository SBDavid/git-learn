var ppmvc = require("ppmvc"),
    ActionTypes = require("../common/ActionTypes"),
    userInfoC = require("../controllers/userInfoC")

var pageController = function() {
    this.init();
}

pageController.prototype.init = function() {
    // 初始化ActionTypes;
    ppmvc.ActionTypes.set(ActionTypes);

    this.initUserInfo();
}

// 加载模块
pageController.prototype.initUserInfo = function() {
    // 加载model
    ppmvc.Store.load(ActionTypes.userInfoModel.NAME, this.userInfoHandler, {
        data: {
            userId: "testUserId",
            userName: "铁柱"
        }
    })
}

pageController.prototype.userInfoHandler = function(model) {
    console.info('model is loaded:', model);
    var userInfo = new userInfoC();
    document.getElementById('container').appendChild(userInfo.getView().el)
}

window.onload = function() {
    new pageController();
}
