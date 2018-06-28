var ppmvc = require("ppmvc");

var model = ppmvc.Model.extend({
    defaults: function () {
        return {
            userId: null,
            userName: "nobody"
        };
    },
    preinitialize: function() {
        console.log('model preinitialize is called', this);
    },
    initialize: function() {
        console.log('model initialize is called', this);
    },
    getUserId: function() {
        var userId = this.getAttr('userId');
        console.log('model getUserId is called', userId);
        return userid;
    },
    getUserName: function() {
        var userName = this.getAttr('userName');
        console.log('model getUserName is called', userName);
        return userName;
    },
    setUserName: function(name) {
        console.log('model setUserName is called');
        this.setAttr('userName', name);
    }
});

module.exports = model;