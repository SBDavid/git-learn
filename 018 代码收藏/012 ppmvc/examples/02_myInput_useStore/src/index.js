var ppmvc = require("ppmvc"),
    ActionTypes = require("./common/ActionTypes"),
    myInputM = require("./models/myInputM"),
    myInputC = require("./controllers/myInputC")

var pageController = function() {
    this.init();
}

pageController.prototype.init = function() {
    // 初始化ActionTypes;
    ppmvc.ActionTypes.set(ActionTypes);

    this.initMyInpute();
}

// 加载模块
pageController.prototype.initMyInpute = function() {
    // 加载model
    ppmvc.Store.load(ActionTypes.myInputModel.NAME, function(model) {
        console.info('model is loaded:', model);
        var myName = new myInputC();
        document.getElementById('container').appendChild(myName.getView().el)
    }, {
        data: {
            title: "请输入姓名",
            placeholder: "铁柱"
        }
    })
}

window.onload = function() {
    new pageController();
}
