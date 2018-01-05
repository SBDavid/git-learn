<template>
    <div>
      <div>props测试：{{name}}</div>
      <div>data测试：{{demo}} - {{demo2}}</div>
      <div>computed测试：{{computedMsg}}</div>
      <div>method测试：{{hello()}}</div>
      <div>vuwx测试：{{vuexState}}</div>
      <div>vuwx-class: state测试：{{countState}}</div>
      <div>vuwx-class: Getter测试：{{countGetter}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'
import Component from "vue-class-component";
import store from "../store/store";


@Component({
  props: {
    name: String
  }
})
export default class demo extends Vue {
  // demo会被转换成data中的属性
  demo: String = "this is a typescript project now! demo1";

  // demo会被转换成data中的属性
  demo2: String = "demo2";

  // get -> 计算属性
  get computedMsg () {
    return 'computed ' + this.demo;
  }

  get vuexState () {
    return store.state.count
  }

  // method
  hello() {
    return `Hello ${this.demo2}!`;
  }
  // 声明周期钩子
  mounted() {
    //alert(this.hello());
    setInterval(() => {
        // store.commit('increment');
        this.countMutation();
    }, 1000)
    this.countReset();
  }

  @State('count') countState:Number
  @Getter('count') countGetter:Number
  @Mutation('increment') countMutation: Function
  @Action('reset') countReset: Function
}

</script>
<style>
</style>