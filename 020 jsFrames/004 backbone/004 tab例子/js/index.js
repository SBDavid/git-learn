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
          this.set('selected', !this.get("selected"));
        },
    
        unSelect: function() {
            this.set('selected', !this.get("selected"));
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
                }
            }));
            this.add(new tabItem({
                id: 1,
                tabType: 'tab_2',
                tabData: {
                    name: 'tabName2'
                },
                contentType: 'content_2',
                contentData: {
                    name: 'contentData2'
                }
            }));
        }
    });

    var tabC = new tabContainer();
    console.info('tabC before load', tabC);
    tabC.load();
    console.info('tabC after load', tabC);

    var tabView1 = Backbone.View.extend({
        template: _.template($('#tab_1').html()),
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
            $(this.el).html(this.template(this.model.get('tabData')));
            return this;
        }
    });

    var tabView2 = Backbone.View.extend({
        template: _.template($('#tab_2').html()),
        events: {
            'click': 'select'
        },
        select: function() {
            if (this.model.get('selected') === false) { alert('tab2')
                this.model.collection.each(function(item) {
                    item.unSelect();
                });
                this.model.select();
            }
        },
        render: function() {
            $(this.el).html(this.template(this.model.get('tabData')));
            return this;
        }
    });

    var tabContentView1 = Backbone.View.extend({
        template: _.template($('#content_1').html()),


        render: function() {
            $(this.el).html(this.template(this.model.get('contentData')));
            return this;
        }
    });

    var tabContentView2 = Backbone.View.extend({
        template: _.template($('#content_2').html()),


        render: function() {
            $(this.el).html(this.template(this.model.get('contentData')));
            return this;
        }
    });

    var tabView = Backbone.View.extend({
        el: $('#root'),
        template: _.template($('#container').html()),
        render: function() {
            $(this.el).html(this.template());
            tabC.each(function(tab) {
                var tabItem;
                var contentItem;
                if (tab.get('tabType') === 'tab_1') {
                    tabItem = new tabView1({model: tab});
                } else {
                    tabItem = new tabView2({model: tab});
                }
                tabItem.render();
                $('#root').find('.tabs').append(tabItem.el);
            });
        }
    });
    
    var app = new tabView();
    app.render();
}