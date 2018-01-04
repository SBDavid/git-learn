
import demo2 from '../compnents/demo2';

import Vue from 'Vue';

var vm = new Vue({
    el: '#app',
    render: h => h(demo2, {
        props: {
            name: 'name'
        },
    })
})