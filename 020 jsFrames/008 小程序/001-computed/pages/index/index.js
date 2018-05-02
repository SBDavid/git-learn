//index.js
//获取应用实例

var computed = require("../../lib/computed1.js")

const app = getApp()

Page(computed({
    data: {
        firstName: "firstName",
        lastName: "lastName"
    },

    onLoad: function () {
        console.info('onload');
        //console.info('fullName', this.computed.fullName())
    },

    computed: {
        fullName: function() {
            console.info('fullName', this.data);
            return this.data.firstName + ' -' + this.data.lastName;
        }
    },

    changeFirstName: function() {
        this.setData({
            firstName: 'changeFirstName'
        })
    },

    changeLastName: function () {
        this.setData({
            lastName: 'changeLastName'
        })
    }
}))
