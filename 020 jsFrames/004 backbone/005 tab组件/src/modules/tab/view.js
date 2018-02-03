var backbone = require("backbone"),
    $ = require("jquery");

var tpl = require("./tpl.htm")

var view = Backbone.View.extend({
    className: 'my-tab',
    template: tpl,
    initialize: function() {
        this.listenTo(this.collection, 'change', this.change);
        this.listenTo(this.collection, 'add', this.addTab);
    },
    events: {
        'click .btns li': 'shift'
    },
    shift: function(event) {
        var id = event.target.getAttribute('data-id');
        var tabModel = this.collection.get(id);
        if (tabModel.get('isSelect')) {
            return;
        } else {
            tabModel.collection.each(function(item) {
                item.unSelect();
            });
            tabModel.select();
        }
        console.info('shift', event);
    },
    change: function(model) {
        console.info('change', model);
        this.tabs.find('>li[class$="cur"]').removeClass('cur');
        this.tabs.find('>li[data-id='+ model.cid +']').addClass('cur');
        this.contents.find('>li[class$="cur"]').removeClass('cur');
        this.contents.find('>li[data-id='+ model.cid +']').addClass('cur');
    },
    addTab: function(model) {

        var tabTitle = model.get('title');
        var content = model.get('content');
        var isSelect = model.get('isSelect');
        this.tabs.append($('<li data-id='+ model.cid +'>' + tabTitle + '</li>'));
        this.contents.append($('<li data-id='+ model.cid +'></li>').append(content.getView().$el[0]));

        if (isSelect) {
            this.tabs.find('>li').addClass('cur');
            this.contents.find('>li').addClass('cur');
        }
    },
    render: function() {
        this.$el.html(this.template());
        // 按钮
        this.tabs = this.$el.find('.btns');
        // 内容
        this.contents = this.$el.find('.contents');
        return this;
    }
});

module.exports = view;