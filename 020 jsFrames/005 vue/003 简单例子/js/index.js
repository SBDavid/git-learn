/* var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
 */

Vue.directive('demo', {
    bind: function (el, binding, vnode) {
        var s = JSON.stringify
        el.innerHTML =
            'name: ' + s(binding.name) + '<br>' +
            'value: ' + s(binding.value) + '<br>' +
            'expression: ' + s(binding.expression) + '<br>' +
            'argument: ' + s(binding.arg) + '<br>' +
            'modifiers: ' + s(binding.modifiers) + '<br>' +
            'vnode keys: ' + Object.keys(vnode).join(', ');

        el.addEventListener('click', function(e) {
            console.info('click', e)
        });
        let rootNode = document.querySelector('#root');
        console.info('rootNode', rootNode);
    },
    inserted: function (el, binding, vnode) {
        let rootNode = document.querySelector('#root');
        console.info('rootNode', rootNode);
    }
});

Vue.component('child', {
    name: 'child',
    template: `<div></div>`
});


var data = {
    message: 'Hello Vue!'
}

var app = Vue.extend({
    template: `<div id="root">
            <div>
            {{ message }}
            </div>
            <child v-demo:foo.a="message">
            </child>
        </div>`,

    data: function () {
        return data;
    },
    mounted: function () {
    }
});

var app1 = new app().$mount('#app1');

