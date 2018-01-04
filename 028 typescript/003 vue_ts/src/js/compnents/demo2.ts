
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component({
        template: '<div>\
            <div>{{name}}</div>\
            <div>{{demo}}</div>\
            <div>{{hello()}}</div>\
        </div>',
        props: {
            name: String
        }
    })
    export default class demo2 extends Vue {
        // 初始数据可以直接声明为实例的属性
        demo: string = 'this is a typescript project now! demo2';
        // get -> 计算属性
        get computedMsg () {
            return 'computed ' + this.demo;
        }

        // method
        hello() {
            return `Hello ${this.demo}!`;
        }
        // 声明周期钩子
        mounted() {
            alert(this.hello());
        }
    }