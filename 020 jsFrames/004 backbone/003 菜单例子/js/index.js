window.onload = function() {
    var MeunItem = Backbone.Model.extend({

        // Default attributes for the todo item.
        defaults: function() {
          return {
            name: "empty item...",
            order: meuns.nextOrder(),
            selected: false
          };
        },
    
        // Toggle the `done` state of this todo item.
        toggle: function() {
          this.set('selected', !this.get("selected"));
        }
    
    });

    var MeunList = Backbone.Collection.extend({

        model: MeunItem,

        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: 'order',
        load: function() {
            this.add(new MeunItem({name: '1', selected: true}));
            this.add(new MeunItem({name: '2'}));
        }
    });

    var meuns = new MeunList();
/*     console.info('meuns before load', meuns);
    meuns.load();
    console.info('meuns after load', meuns); */

    var MeunItemView = Backbone.View.extend({
        // Cache the template function for a single item.
        template: _.template($('#item-template').html()),
        events: {
            'click .item': 'toggle'
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        toggle: function() {
            if (this.model.get('selected') === false) {
                this.model.collection.each(function(item) {
                    item.set('selected', false);
                });
                this.model.toggle();

            }
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get('selected')) {
                this.$el.find('.item').addClass('selected');
            } else {
                this.$el.find('.item').removeClass('selected');
            }
            return this;
        },
    });

    var MeunListView = Backbone.View.extend({
        el: $("#root"),
        initialize: function() {
            meuns.load();
        },
        render: function() {
            meuns.each(function(item){
                var itemView = new MeunItemView({model: item})
                itemView.render();
                this.el.append(itemView.el);
            }, this);
        }
    });

    var app = new MeunListView();
    app.render();
    console.info(meuns);
}