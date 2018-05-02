//index.js
//获取应用实例

var computed = require("../../lib/computed1.js")

const app = getApp()

Page(computed({
    data: {
		p: {
			firstName: "firstName",
			lastName: "lastName"
		},
		arr: [1, 2]
	},

    onLoad: function () {
        console.info('onload');
        //console.info('fullName', this.computed.fullName())
    },

    computed: {
        fullName: function() {
			console.info('computed:fullName')
            return this.data.p.firstName + ' -' + this.data.p.lastName;
        },
		arrStr: function() {
			return 'arrStr:' + this.data.arr.join();
		}
    },

    changeFirstName: function() {
        this.setData({
            'p.firstName': 'changeFirstName'
        });
		this.setData({
			'arr': [3]
		})
    },

    changeLastName: function () {
        this.setData({
            'p.lastName': 'changeLastName'
        });
		this.setData({
			'arr[0]': 4
		})
    }
}))
