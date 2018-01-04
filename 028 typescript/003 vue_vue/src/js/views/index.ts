import demo from '../compnents/demo.vue';

import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

var vm = new Vue({
    el: '#app',
    render: h => h(demo, {
        props: {
            name: '组件props.name'
        },
    })
})