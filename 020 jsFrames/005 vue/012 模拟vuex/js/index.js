Vue.config.silent = true;


// 创建一个全局的vue实例作为全局状态管理的容器
// 可以在这个实例上添加action、mutation、等方法和列表，并作为对外的接口
// 这样就等于实现了vuex的功能
var globalState = new Vue({
    data: function () {
        return {
            count: 0
        }
    }
});

var compA = new Vue({
    el: '#root',
    data: function() {
        return {
            name: 'compA'
        }
    },
    computed: {
        countA: function() {
            return globalState.count;
        }
    },
    template: '<div>{{name}}: {{countA}}</div>'
});

setInterval(function() {
    globalState.count++;   
}, 1000);
