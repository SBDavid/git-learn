Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        name: 'vuex'
    },
    getters: {
        name: state => {
            return state.name
        }
    }
})



var baseView = Vue.extend({
    store,
    template: '<p>{{firstName}} {{lastName}}</p>',
    data: function () {
        return {
            firstName: 'Walter',
            lastName: 'White'
        }
    },
    computed: {
    },
    methods: {
    },
    created: function () {
    }
});



var test = new baseView().$mount('#app');

