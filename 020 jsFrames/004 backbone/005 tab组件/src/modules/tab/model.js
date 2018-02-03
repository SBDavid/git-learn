var _ = require("underscore"),
    backbone = require("backbone"),
    $ = require("jquery");

var model = Backbone.Model.extend({
    defaults: function () {
        return {
            title: "第一步",
            content: null,
            isSelect: false
        };
    },
    select: function() {
        this.set('isSelect', true);
    },
    unSelect: function() {
        this.set('isSelect', false);
    }
});


module.exports = model;