//- 我的任务item布局
//- 多类型布局 title 
<template>
  <div class="my-task-item-container" ref="taskItem">
    <MyTaskTitle :title="item" v-if="isTitle"></MyTaskTitle>
    <div class="my-task-item" v-else-if="isToday">
      <span
        :class='[checked ? "my-task-item-span line-limit-length mytask-item-line-completed":"my-task-item-span line-limit-length"]'>
        <task-cb :model="checked" class="task-item-cb" @change="changeComplete"></task-cb>
        {{ item.msg }}
      </span>
    </div>
    <div class="my-task-item" v-else>
      <span class="my-task-item-span line-limit-length">
          <task-btn @clickRemove="clickRemove"></task-btn>
          {{ item.msg }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MyTaskTitle from "@/components/MyTaskTitle.vue"; // @ is an alias to /src
import TaskCb from "@/components/TaskCb.vue"; // @ is an alias to /src
import TaskBtn from "@/components/TaskBtn.vue"; // @ is an alias to /src

import { TaskItemBean } from "@/apis/task";

@Component({
  components: {
    MyTaskTitle,
    TaskCb,
    TaskBtn
  }
})
export default class MyTaskItem extends Vue {
  @Prop() private item!: any;

  private isTitle: boolean = false;
  private isToday: boolean = false;
  private msg: string = "";

  private checked: boolean = false;
  private textWidth: number = 0;
  $refs!: {
    taskItem: HTMLDivElement;
  };

  created() {
    //   console.log(this.item)
    // console.log(this.item)
  }
  mounted() {
    // this.textWidth = this.$refs.taskItem.clientWidth - 30;
    this.checked = this.item.status == 2
    if (this.item.isTitle) {
      this.isTitle = true;
    }
    if (this.item.status == 1 || this.item.status == 2) {
      this.isToday = true;
    } else {
      this.isToday = false;
    }
    this.msg = this.item.msg;
  }

  updated() {
    if (this.item.status == 1 || this.item.status == 2) {
      this.isToday = true;
    } else {
      this.isToday = false;
    }
  }

  changeComplete(e: any, ev: any) {
    console.log(e);
    this.checked = e;
    this.$emit("change", e, this.item, ev);
  }

  clickRemove(ev: any) {
    this.$emit("clickRemove", this.item, ev);
  }

  activeStyle() {
    return {
      backgroundColor: "#f00",
      borderColor: "#f00"
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.my-task-item-container {
}

.my-task-item-title {
  text-align: left;
  width: 60%;
  margin: auto auto;
  padding-top: 15px;
}

.my-task-item {
  width: 60%;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  margin: 10px auto 0px auto;
  text-align: left;
  opacity: 1;
  background-color: white;
  -webkit-box-shadow: 1px 1px 1px #e5e5e5;
  -moz-box-shadow: 1px 1px 1px #e5e5e5;
  box-shadow: 1px 1px 1px #e5e5e5;
  transition: all linear 0.1s;
}

.task-item-cb {
  top: 4px;
}
.my-task-item-span {
  height: 30px;
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  color: #333;
  opacity: 1;
}

.line-limit-length {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mytask-item-line-completed {
  opacity: 0.3;
}

</style>
