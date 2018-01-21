import demo from '../compnents/demo.vue';
/* import demo2 from '../compnents/demo2'; */

import Vue from 'vue';

var vm = new Vue({
    el: '#app',
    render: h => h(demo, {
        props: {
            name: 'name'
        },
    })
})