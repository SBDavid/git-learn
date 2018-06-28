var ppmvc = require("ppmvc"),
    $ = require("jquery");

var tpl = require("./myInputT.htm");

var view = ppmvc.View.extend({
    className: 'input-module',
    template: tpl,
    initialize: function() {
        
    },
    events: {
        'keyup .my-input': 'valuechange'
    },
    valuechange: function(event) {
        var newValue = event.currentTarget.value;
        this.model.set('value', newValue);
        this.$el.find('.value').html(newValue);
        this.trigger('valuechange', {
            newVal: newValue
        })
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        if (this.model.get('value') != '') {
            this.$el.find('input').attr('value', this.model.getAttr('value'));
        }
        return this;
    }
});

module.exports = view;