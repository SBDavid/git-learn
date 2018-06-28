var _ = require('underscore'),
    $ = require('jquery'),
    Model = require('./model'),
    ActionTypes = require('./actionTypes'),
    Events = require('./events');

// ajax
var ajax = function() {
    if ($.ppXHR) {
        return $.ppXHR.JSONP.apply($.ppXHR, arguments);
    }
    return $.ajax.apply($, arguments);
};

var Store = function() {
    this.models = {};
}

_.extend(Store.prototype, Events, {
    /**
     * 静动态创建model对象 并放入models模型里
     * @param type 类型
     * @param cb 返回值
     * @param options 配置参数 如果有data代表外部数据导入，如果有url表示异步请求
     * @param method type:add 追加请求 key:关键值
     */
    load: function(type, cb, options,method) {
        var ntype = type;
        if(method) {
            if(method.type == "add") ntype = ntype+method.key;
        }
        if (typeof type === "string" && typeof cb === "function") {
            if (typeof options !== "undefined") {
                this.once(ntype, cb);
                if (options.hasOwnProperty('url')) {
                    this._asynLoad(type, cb, options,ntype);
                } else if (options.hasOwnProperty('data')) {
                    this.models[type] = this._createModel(type, options['data']);
                    this.trigger(type, { "model": this.models[type] });
                }
            }
        }
    },
    /**
     * 获取具体模型对象
     */
    getModel: function(name) {
        if (typeof name === "string" && this.models.hasOwnProperty(name)) {
            return this.models[name];
        } else {
            return null;
        }
    },
    /**
     * 创建不同的model
     * @param type 类型
     * @param data 数据内容
     * @return 返回model
     */
    _createModel: function(type, data) {
        var model;
    
        var ActionType = ActionTypes.get(type);
    
        if (ActionType) {
            model = new ActionType(data);
        } else {
            model = new Model(data);
        }
    
        return model;
    },
    /**
     * 异步请求远端数据
     * @param type 类型
     * @param cb 回调函数
     * @param options 参数
     */
    _asynLoad: function(type, cb, options,ntype) {
        var self = this;
        var lp = function() {
            var loadDeferred = $.Deferred();
            var loadPromise = loadDeferred.promise();
            ajax(options).done(function(data) {
                loadDeferred.resolve(data);
            }).fail(function() {
                loadDeferred.resolve({ 'errorCode': '500' });
            });
            return loadDeferred;
        }
        lp().then(function(data) {
            self.models[ntype] = self._createModel(type, data);
            self.trigger(ntype, { "model": self.models[ntype] })
        });
    }
});

module.exports = new Store();