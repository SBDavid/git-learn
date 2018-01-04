<template>
    <div>
      <div>props测试：{{name}}</div>
      <div>data测试：{{demo}} - {{demo2}}</div>
      <div>computed测试：{{computedMsg}}</div>
      <div>method测试：{{hello()}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

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

  // method
  hello() {
    return `Hello ${this.demo2}!`;
  }
  // 声明周期钩子
  mounted() {
    alert(this.hello());
  }
}

</script>
<style>
</style>