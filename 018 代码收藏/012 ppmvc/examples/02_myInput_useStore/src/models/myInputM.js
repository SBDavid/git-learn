var ppmvc = require("ppmvc");

var model = ppmvc.Model.extend({
    defaults: function () {
        return {
            title: "title",
            placeholder: "placeholder",
            value: ""
        };
    },
});

module.exports = model;