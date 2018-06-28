var ppmvc = require("ppmvc"),
    $ = require("jquery");

var tpl = require("./userInfo.htm");

var view = ppmvc.View.extend({
    tagName: 'div',
    className: 'input-module',
    template: tpl,
    preinitialize: function() {
        console.log('View preinitialize is called', this);
    },
    initialize: function() {
        console.log('View initialize is called', this);
    },
    events: {
        'click .setNameBtn': 'setName'
    },
    setName: function(event) {
        event.preventDefault();
        console.log('click setName is called', event);
        var newValue =  this.$el.find('#setName')[0].value;
        this.model.setUserName(newValue);
        this.$el.find('.value').html(newValue);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

module.exports = view;