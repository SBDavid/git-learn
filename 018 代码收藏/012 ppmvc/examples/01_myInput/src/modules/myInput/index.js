var model = require("./model"),
    view = require("./view");

require("./index.less");

function myInput(title, placeholder) {
    this.init(title, placeholder)
}

myInput.prototype.init = function(title, placeholder) {
    this._model = new model({
        title: title,
        placeholder: placeholder,
        value: ""
    });

    this._view = new view({
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
