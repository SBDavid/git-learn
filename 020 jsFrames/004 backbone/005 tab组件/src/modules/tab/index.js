var collection = require("./collection"),
    view = require("./view"),
    model = require("./model");

require("./index.less");

function tab() {
    
}

tab.prototype.init = function() {
    this._collection = new collection({
    });

    this._collection.remove(this._collection.at(0));

    this._view = new view({
        collection: this._collection
    });

    this._view.render();
}

tab.prototype.add = function(title, content, isSelect) {
    var m = new model({
        title: title,
        content: content,
        isSelect: isSelect
    });

    this._collection.add(m);
}

tab.prototype.getView = function() {
    return this._view;
}

module.exports = tab;