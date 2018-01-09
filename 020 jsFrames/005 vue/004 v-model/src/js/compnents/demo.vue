<template>
    <div>
      <input type="checkbox" v-model.lazy="toggle" />it is a input<br>
      <label>{{toggle}}</label><br>
      <input v-model.lazy="msg" @change="c" />
      <label>{{msg}}</label>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
   
  }
})

export default class demo extends Vue {
  toggle: boolean = false;
  msg: string = '';
  c (e:any) {
    console.info(e);
  }
}

</script>
<style></style>