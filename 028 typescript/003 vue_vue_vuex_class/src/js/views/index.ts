
import Vue from 'vue';
import Vuex from 'vuex';
import {store} from "../store/store";
import demo from '../compnents/demo.vue';

var vm = new Vue({
    el: '#app',
    render: h => h(demo, {
        props: {
            name: '组件props.name'
        },
    }),
    store
}) 
