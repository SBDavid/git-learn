// 测试回调事件
var callback_listen_test = function(e) {
    console.info('callback_listen_test', e);
};
var callback_on_test = function(e) {
    console.info('callback_on_test', e);
};

// 定义模型对象和视图对象
var Model = _.extend({
    init: function() {
        this.on('onTest', callback_on_test);
    },
    print: function() {
        this.trigger('listenToTest', {arg:'test'});
        this.trigger('onTest', {arg:'test'});
    },
    Off: function() {
        this.off('onTest', callback_on_test);
    }
}, Events);

var View = _.extend({
    init: function(m) {
        this.m = m;
        this.listenTo(m, 'listenToTest', callback_listen_test);
    },
    stopListen: function() {
        var self = this;
        this.stopListening(self.m, 'listenToTest', callback_listen_test);
    }
}, Events);

Model.init();
View.init(Model);
// 事件触发
Model.print();
// 事件删除
View.stopListen();
Model.Off();
Model.print();