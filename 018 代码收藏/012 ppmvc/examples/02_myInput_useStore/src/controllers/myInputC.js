var myInputV = require("../components/myInputV"),
    ActionTypes = require("../common/ActionTypes"),
    ppmvc = require("ppmvc");

function myInput(title, placeholder) {
    this.init(title, placeholder)
}

myInput.prototype.init = function() {
    this._model = ppmvc.Store.getModel(ActionTypes.myInputModel.NAME);

    this._view = new myInputV({
        model: this._model
    });

    this._view.render();

    this._view.on('valuechange', function(event) {
        console.info(event);
    });
}

myInput.prototype.setTitle = function(title) {
    this._model.set('title', title);
}

myInput.prototype.getView = function() {
    return this._view;
}

module.exports = myInput;