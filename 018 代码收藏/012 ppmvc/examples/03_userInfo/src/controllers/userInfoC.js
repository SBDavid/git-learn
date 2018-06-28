var userNameV = require("../components/userName"),
    ActionTypes = require("../common/ActionTypes"),
    ppmvc = require("ppmvc");

function userInfo() {
    this.init()
}

userInfo.prototype.init = function() {
    this._model = ppmvc.Store.getModel(ActionTypes.userInfoModel.NAME);

    this._view = new userNameV({
        model: this._model
    });

    this._view.render();
}

userInfo.prototype.getView = function() {
    return this._view;
}

module.exports = userInfo;