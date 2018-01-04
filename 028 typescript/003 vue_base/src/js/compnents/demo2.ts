
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component({
        template: '<div>{{demo}}</div>'
    })

    export default class demo2 extends Vue {
        // 初始数据可以直接声明为实例的属性
        demo: string = 'this is a typescript project now! demo2';
        watch: {

        }
    }