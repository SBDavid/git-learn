console.info(Events);

var Model = _.extend({}, Events);


var View = _.extend({}, Events);

View.listenTo(Model, 'test', function(e) {
    console.info('listenTo', e);
})

Model.trigger('test', {arg:1});