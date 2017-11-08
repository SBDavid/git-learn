var vm = new Vue({
    /* template: '#root-template', */
    render: function(createElement) {
        return createElement(
            'div',
            '顶层div'
        )
    },
    el: '#root',
    data: function () {
        return {
            a: 1,
            obj: {
                c: 100,
                d: {
                    d1: 111
                }
            },
            'class': {
                foo: true,
                bar: false
            },
            style: {
                color: 'red',
                fontSize: '14px'
            },
            attrs: {
                id: 'foo'
            },
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