window.onload = function() {
    var tabItem = Backbone.Model.extend({

        // Default attributes for the todo item.
        defaults: function() {
          return {
            id: 0,
            tabType: "tab_1",
            tabData: "tabData",
            contentType: "content_1",
            contentData: "contentData",
            selected: false
          };
        },
    
        select: function() {
          this.set('selected', true);
        },
    
        unSelect: function() {
            this.set('selected', false);
        }
    });

    var tabContainer = Backbone.Collection.extend({

        model: tabItem,
        load: function() {
            this.add(new tabItem({
                id: 0,
                tabType: 'tab_1',
                tabData: {
                    name: 'tabName1'
                },
                contentType: 'content_1',
                contentData: {
                    name: 'contentData1'
                },
                selected: true
            }));
            this.add(new tabItem({
                id: 1,
                tabType: 'tab_2',
                tabData: {
                    name: ["tab_21","tab_22"]
                },
                contentType: 'content_2',
                contentData: {
                    name: 'contentData2'
                }
            }));
        }
    });

    var tabC = new tabContainer();
    tabC.load();

    var tabView1 = Backbone.View.extend({
        template: _.template($('#tab_1').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        events: {
            'click': 'select'
        },
        select: function() {
            if (this.model.get('selected') === false) {
                this.model.collection.each(function(item) {
                    item.unSelect();
                });
                this.model.select();
            }
        },
        render: function() {
            this.$el.html(this.template(this.model.get('tabData')));
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
            return this;
        }
    });

    var tabView2 = Backbone.View.extend({
        template: _.template($('#tab_2').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        events: {
            'click li': 'select'
        },
        select: function(e) {
            if (this.model.get('selected') === false) {
                this.model.collection.each(function(item) {
                    item.unSelect();
                });
                this.model.select();
                this.model.set('contentData', {
                    name: e.target.getAttribute('data-id')
                })
                
            }
        },
        render: function() {
            this.$el.html(this.template(this.model.get('tabData')));
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
            return this;
        }
    });

    var tabContentView1 = Backbone.View.extend({
        template: _.template($('#content_1').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.get('contentData')));
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
            return this;
        }
    });

    var tabContentView2 = Backbone.View.extend({
        template: _.template($('#content_2').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.get('contentData')));
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
            return this;
        }
    });

    var tabView = Backbone.View.extend({
        el: $('#root'),
        template: _.template($('#container').html()),
        render: function() {
            this.$el.html(this.template());
            tabC.each(function(tab) {
                var tabItem;
                var contentItem;
                if (tab.get('tabType') === 'tab_1') {
                    tabItem = new tabView1({model: tab});
                } else {
                    tabItem = new tabView2({model: tab});
                }
                tabItem.render();
                this.$el.find('.tabs').append(tabItem.el);

                if (tab.get('contentType') === 'content_1') {
                    contentItem = new tabContentView1({model: tab});
                } else {
                    contentItem = new tabContentView2({model: tab});
                }
                contentItem.render();
                this.$el.find('.contents').append(contentItem.el);
            }, this);
        }
    });
    
    var app = new tabView();
    app.render();
}