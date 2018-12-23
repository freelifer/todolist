<template>
  <div class="task-item" ref="taskItem">
    <span
      :class='[checked ? "task-item-span line-limit-length task-item-line-through":"task-item-span line-limit-length"]'
      :style="{'width':textWidth + 'px'}"
    >
      <el-checkbox v-model="checked" class="task-item-cb" @change="changeComplete"></el-checkbox>
      {{ msg }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TaskItem extends Vue {
  @Prop() private item!: any;

  private msg: string = '';
  private checked: boolean = false;
  private textWidth: number = 0;
  $refs!: {
    taskItem: HTMLDivElement;
  };

  created() {
    this.checked = this.item.completed;
    this.msg = this.item.msg;
  }
  mounted() {
    this.textWidth = this.$refs.taskItem.clientWidth - 30;
  }
  changeComplete(e:any) {
    console.log(e)
    let i = this.item
    i.completed = e
    this.$emit('change', i)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.task-item {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: left;
  padding-left: 10px;
  border-bottom: 1px solid #eeeeee; // 边框设置成1px
}
.task-item-cb {
  margin-right: 10px;
}
.task-item-span {
  height: 30px;
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  color: #333;
}
.line-limit-length {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
}

.task-item-line-through {
  text-decoration: line-through;
  color:#409eff;
}
</style>
