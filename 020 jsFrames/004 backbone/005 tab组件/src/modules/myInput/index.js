var model = require("./model"),
    view = require("./view");

require("./index.less");

function myInput() {
    
}

myInput.prototype.init = function(title, label, placeholder, word) {
    this._model = new model({
        title: title,
        label: label,
        placeholder: placeholder,
        word: word,
        value: ""
    });

    this._view = new view({
        model: this._model
    });

    this._view.render();
}

myInput.prototype.setTitle = function(title) {
    this._model.set('title', title);
}

myInput.prototype.getView = function() {
    return this._view;
}

module.exports = myInput;
