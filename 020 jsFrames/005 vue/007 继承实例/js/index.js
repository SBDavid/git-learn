const merge = Vue.config.optionMergeStrategies.methods;
Vue.config.optionMergeStrategies.created = function (parentVal, childVal) {

    return childVal?[childVal]:parentVal;
}

var baseView = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}} pro {{pro}}</p>',
    data: function () {
        return {
            firstName: 'Walter',
            lastName: 'White',
            alias: 'Heisenberg',
            pro: 'pro',
            count: 1
        }
    },
    computed: {
        com1: function() {
            return 'com1+'+this.firstName;
        }
    },
    methods: {
        met1: function() {
            this.count++;
        }
    },
    created: function() {
        this.met1();
        console.info('created baseView', this.count);
    }
});

var globalView = Vue.extend({
    template: '<p>global {{pro}}</p>',
    props: ['pro']
})

// Vue.component('global-view', globalView);

var inheritView = baseView.extend({
    components: {
        GlobalView: globalView
    },
    template: '<div><p>{{firstName}} {{lastName}} inherit {{alias}} </p><global-view v-bind:pro="pro"> </global-view><p>{{com1}}|{{com2}}</p></div>',
    computed: {
        com1: function() {
            return 'com11+'+this.firstName;
        },
        com2: function() {
            return 'com2+'+this.firstName;
        }
    },
    methods: {
        met2: function() {
            this.count = 100;
        }
    },
    created: function() {
        this.met2();
        console.info('created inheritView', this.count);
    }
})

var test = new inheritView().$mount('#app');

