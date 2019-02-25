<template>
    <div class="my-task-item-title">
        {{ title.msg }}
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskTitleBean } from "@/apis/task"

@Component
export default class MyTaskTitle extends Vue {
  @Prop() private title!: TaskTitleBean;

  private isTitle: boolean = false
  private msg: string = '';

  private checked: boolean = false;
  private textWidth: number = 0;
  $refs!: {
    taskItem: HTMLDivElement;
  };

  created() {
    // this.isTitle = (this.item.type === "title")
    // this.checked = this.item.completed;
    // this.msg = this.item.msg;
  }
  mounted() {
    // this.textWidth = this.$refs.taskItem.clientWidth - 30;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.my-task-item-title {
  text-align: left;
  width: 60%;
  margin: auto auto;
  padding-top: 15px;
  font-size: 12px;
}
</style>
