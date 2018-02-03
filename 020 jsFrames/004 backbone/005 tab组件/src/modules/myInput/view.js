var backbone = require("backbone"),
    $ = require("jquery");

var tpl = require("./tpl.htm")

var view = Backbone.View.extend({
    className: 'input-module',
    template: tpl,
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },
    events: {
        'change .my-input': 'valuechange'
    },
    valuechange: function(event) {
        var newValue = event.currentTarget.value;
        this.model.set('value', newValue);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        if (this.model.get('value') != '') {
            this.$el.find('input').attr('value', this.model.get('value'));
        }
        return this;
    }
});

module.exports = view;