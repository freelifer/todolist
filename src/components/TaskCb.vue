<template>
  <div 
  @click="handleClick"
  :class='[checked ? "todobox-small__140m todobox-checked__2Lx_":"todobox-small__140m"]'>
  
    <input type="checkbox"
      @focus="focus = true"
      @blur="focus = false">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TaskCb extends Vue {
  @Prop() private model!: boolean;
  private label: string = "1111";
  private checked:boolean = false;
  created() {}
  mounted() {
      this.checked = this.model;
    // this.textWidth = this.$refs.taskItem.clientWidth - 30;
  }
  handleChange(ev: any) {
      console.log("handleChange")
  }
  handleClick(ev: any) {
      this.checked = !this.checked;
      this.$emit("change", this.checked, ev)
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
  border: 2px solid #a6a6a6;
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
.todobox-small__140m input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  visibility: hidden;
}
.todobox-small__140m:before {
  content: " ";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50%;
  height: 25%;
  border: 2px solid transparent;
  border-top: none;
  border-right: none;
  box-sizing: content-box;
  transition: border-color 0.15s ease;
  -webkit-transform: translate(-50%, -75%) rotate(-45deg);
  transform: translate(-50%, -75%) rotate(-45deg);
  transition: border-color 218ms;
}
 

.todobox-small__140m:hover {
  border-color: gray;
}
.todobox-small__140m {
  border-color: #ccc;
  background-color: #f5f5f5;
//   cursor: not-allowed;
}

.todobox-checked__2Lx_:before,
.todobox-disabled__2FA2 .todobox-checked__2Lx_:hover:before {
  border-color: #ccc;
}
.todobox-disabled__2FA2 .todobox-text__3Vfl {
  cursor: not-allowed;
  color: #a6a6a6;
}
.todobox-checked__2Lx_:before {
  border-color: #a6a6a6;
}
.todobox-checked__2Lx_:hover:before {
  border-color: gray;
}
</style>
