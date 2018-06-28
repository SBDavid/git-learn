var _ = require('underscore');

var ActionTypes = function() {
    this.types = [];
}

_.extend(ActionTypes.prototype, {
    set: function(types) {
        var self = this;
        this.types = [];
        for(var index in types) {
            self.types.push({
                NAME: index,
                MODEL: types[index].MODEL
            })
        }
    },
    add: function(name, model) {
        this.types.push({
            NAME: name,
            MODEL: model
        })
    },
    get: function(name) {
        if(name === null)
            return null;
        return _.find(this.types, function(type) {
            return type.NAME === name;
        }).MODEL
    },
    remove: function(name) {
        // TODO
    }
});

module.exports = new ActionTypes();