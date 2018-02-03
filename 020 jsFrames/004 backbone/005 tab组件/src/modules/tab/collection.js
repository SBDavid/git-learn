var model = require("./model");

var collection = Backbone.Collection.extend({
    model: model
});

module.exports = collection;