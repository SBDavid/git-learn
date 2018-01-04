

import Vue from 'vue';

import demo from '../compnents/demo.vue';
var vm = new Vue({
    el: '#app',
    render: h => h(demo, {
        props: {
            name: '组件props.name'
        },
    })
})