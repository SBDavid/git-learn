
Vue.component('myc', {
    template: `<div>{{test}}</div>`,
    props: ['test'],
    mounted: function() {
        this.test = 'Bye Vue!'
    }
 }
);

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});
