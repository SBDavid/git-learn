Vue.config.silent = true;

var Component = Vue.extend({
    render: function (createElement) {
        var self = this;
        return createElement(
            'ul',
            self.myProp
        )
    },
    props: {
        myProp: {
            type: Number,
            required: true
        }
    },
});



var vm = new Vue({
    /* template: '#root-template', */
    render: function (createElement) {
        var self = this;
        return createElement(
            'div',
            {
                'class': {
                    foo: true,
                    bar: false
                },
                style: {
                    color: 'red',
                    fontSize: '14px'
                },
                attrs: {
                    id: 'foo',
                    name: 'my-custom-directive',
                },
                ref: 'myRef',
                on: {
                    click: function (e) {
                        console.info(e)
                    }
                },
            },
            [
                '来一段',
                createElement(Component, {
                    props: {
                        myProp: 1
                    },
                }),
                createElement('div', `${self.a}${self.b}`),
                createElement('div', `c: ${self.obj.c}`),
                createElement('div', `d: ${self.obj.d.d1}`)
            ],
        )
    },
    el: '#root',
    data: function () {
        return {
            s: 's',
            a: 1,
            obj: {
                c: 100,
                d: {
                    d1: 111
                }
            }
        }
    },
    computed: {
        b: function () {
            return this.a * 2;
        }
    },
    methods: {
        doubleA: function () {
            this.a = this.a * 2;
        }
    },
    watch: {
        'a': function () {
            console.info('1. a is change', this.a);
        },
        'obj.c': {
            handler: function (val, oldVal) { console.info('3. c is change', this.obj); },
            /* deep: true */
        },
    }
});

vm.$watch('a', function () {
    console.info('2. a is change', this.a);
})

setTimeout(function () {
    vm.doubleA();
    vm.obj.c = 101;
    vm.obj.d.d1 = 123;
}, 1000);

console.info('vm实例', vm);