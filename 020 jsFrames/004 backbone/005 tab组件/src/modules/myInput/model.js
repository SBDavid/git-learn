var backbone = require("backbone");

var model = Backbone.Model.extend({
    defaults: function () {
        return {
            title: "title",
            label: "label",
            placeholder: "placeholder",
            word: "word",
            value: ""
        };
    },
});

module.exports = model;