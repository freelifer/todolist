<template>
  <div class="task-list">
    <div v-if="data.length == 0" class="task-list-empty">No Data</div>
    <transition-group tag="div">
      <div
        class="item"
        v-for="item in taskListData"
        :key="item.msg"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragover.prevent="handleDragOver($event, item)"
        @dragenter="handleDragEnter($event, item)"
        @dragend="handleDragEnd($event, item)">
      <task-item
        :item="item"
        @change="changeComplete"
      />
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TaskItem from "@/components/TaskItem.vue"; // @ is an alias to /src

@Component({
  components: {
    TaskItem
  }
})
export default class TaskList extends Vue {
  @Prop() private data!: Array<any>;
  private taskListData: Array<any> = [];
  private dragging: any;

  created() {
    this.taskListData = this.data;
  }
  changeComplete(e: any) {
    this.$emit("change", e);
  }
  handleDragStart(e: any, item: any) {
    this.dragging = item;
  }
  handleDragEnd(e: any, item: any) {
    this.dragging = null;
    this.$emit('dragEndChange', this.taskListData)
  }
  //首先把div变成可以放置的元素，即重写dragenter/dragover
  handleDragOver(e: any) {
    e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
  }
  handleDragEnter(e: any, item: any) {
    e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
    if (item === this.dragging) {
      return;
    }
    const newItems = [...this.taskListData];
    // console.log(newItems);
    const src = newItems.indexOf(this.dragging);
    const dst = newItems.indexOf(item);

    newItems.splice(dst, 0, ...newItems.splice(src, 1));

    this.taskListData = newItems;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.task-list {
  border: 1px solid;
  border-color: #eee;
  border-radius: 5px;
  -moz-border-radius: 5px; /* Old Firefox */
}
.task-list-empty {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #333;
}

.item {
  transition: all linear 0.3s;
}
</style>
