// 输出版本号
console.info('ppmvc.VERSION', ppmvc.VERSION);

// 构建一个model
// model上有Events全套方法
var m = new ppmvc.Model();
console.info('构建一个model', m);

// 继承一个model
var extendModel = ppmvc.Model.extend({});
var em = new extendModel();
console.info('继承一个model', em);

// model属性测试，默认值测试
var attrModel = ppmvc.Model.extend({
    defaults: function() {
        return {
            defaultsAttr: 'defaultsAttr'
        }
    },
    preinitialize: function() {
        console.info('preinitialize');
    },
    initialize: function() {
        console.info('initialize', this.attributes);
    }
})

console.info('model属性测试', new attrModel({
    testAttr: 'testAttr',
}))

// view测试 
console.info('view 测试 ----------------');

// 继承一个view对象
var extendView = new ppmvc.View({
    tagName: 'ul',
    className: 'myStyle',
    attributes: {
        id: 'meun'
    }
});

console.info('继承一个View', extendView);
console.info('extendView.el', extendView.el);

// ActionType测试 
console.info('ActionType测试 ----------------');
var types = {
    PAGE_VOD_WEBCFG: {
        name: 'PAGE_VOD_WEBCFG',
        model: extendModel
    }
}
ppmvc.ActionTypes.set(types);
console.info(ppmvc.ActionTypes)