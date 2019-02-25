<template>
  <div 
  @click="handleClick"
  class="todobox-small__140m">
  <a></a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TaskBtn extends Vue {
  created() {}
  mounted() {
  }
  handleChange(ev: any) {
  }
  handleClick(ev: any) {
    this.$emit("clickRemove", ev);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.todobox-small__140m {
  position: relative;
  display: inline-block;
  width: 16px;
  min-width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  box-sizing: border-box;
  transition: border-color 218ms, background-color 218ms;
}
a{ 
  display: inline-block;
  width: 16px;
  height:2px;
  background: #ccc;
  line-height: 0;
  font-size:0;
  border-radius: 16px;
  vertical-align: middle;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  }
  a:after{
    content:'/';
    display:block;
    width: 16px;
    height:2px;
  border-radius: 16px;
    background: #ccc;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }
</style>
