import demo from '../compnents/demo.vue';

import Vue from 'vue';

var vm = new Vue({
    el: '#app',
    render: h => h(demo),
    watch: {
        test: function() {

        }
    }
})