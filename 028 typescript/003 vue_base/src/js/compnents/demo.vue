<template>
    <div>
      <div>{{name}}</div>
      <div>{{demo}}</div>
      <div>{{computedMsg}}</div>
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
  demo: String = "this is a typescript project now! demo1";
  get computedMsg () {
    return 'computed ' + this.demo;
  }
}

</script>
<style></style>