<template>
  <div class="container">
    <div class="task_input_container">
      <el-input
        class="tl-input"
        placeholder="Enter a todo item"
        v-model="todoInput"
        clearable
        @keyup.enter.native="addTask"
      ></el-input>
    </div>
    <div class="task_list_container">
      <div class="aa"></div>
    <!-- <div
      class="out"
      @dragenter="handleDelDragEnter"
      @dragover.prevent="handleDelDragOver"
      @dragleave="handleDelDragLeave"
      @drop="handleDelDrop"
    ></div> -->
    <transition-group tag="div">
      <div
        class="todo-task-item-div"
        v-for="(task) in myTasks"
        :key="task.id"
        :item="task"
        :draggable="!task.isTitle"
        @dragstart="handleDragStart($event, task)"
        @dragover.prevent="handleDragOver($event, task)"
        @dragenter="handleDragEnter($event, task)"
        @dragend="handleDragEnd($event, task)"
      >
        <MyTaskItem :item="task" @change="changeTaskCheck" @clickRemove="clickRemove"></MyTaskItem>
      </div>
    </transition-group>
    <div class="tl-input-box">

    </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MyTaskItem from "@/components/MyTaskItem.vue"; // @ is an alias to /src
import TaskCb from "@/components/TaskCb.vue"; // @ is an alias to /src
import TaskBean, { TaskManager, MyTaskInfoBean } from "@/apis/task";

@Component({
  components: {
    MyTaskItem,
    TaskCb,
  }
})
export default class MyTask extends Vue {
  private myTasks: Array<any> = new Array<any>();
  private todoInput: string = "";
  private dragging: any;
  private todoUp: boolean = false;
  private todoTarget: any;

  mounted() {
    TaskManager.getInstance().init();

    this.refresh();
  }

  handleDragStart(e: any, item: any) {
    // console.log("handleDragStart", e);
    // item.isFloat = true
    this.dragging = item;
  }
  handleDragEnd(e: any, item: any) {
    // console.log("handleDragEnd", item);
    this.dragging = null;
    this.updateTask();

    // const newItems = [...this.allTasks];
    // for(var t in newItems){
    //   newItems[t].isFloat = false
    // }
    // this.allTasks = newItems
    // this.$emit('dragEndChange', this.taskListData)
  }

  //首先把div变成可以放置的元素，即重写dragenter/dragover
  handleDragOver(e: any, item: any) {
    // console.log('handleDragOver', e)
    e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
  }
  handleDragEnter(e: any, item: any) {
    // console.log('handleDragEnter', e)
    e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
    if (item === this.dragging) {
      return;
    }
    if (item.id === "today_title") {
      return;
    }
    const newItems = [...this.myTasks];
    // console.log(newItems);
    const src = newItems.indexOf(this.dragging);
    const dst = newItems.indexOf(item);

    newItems.splice(dst, 0, ...newItems.splice(src, 1));

    this.myTasks = newItems;
  }

  // 在拖动目标上触发事件 (源元素):
  // ondragstart - 用户开始拖动元素时触发
  // ondrag - 元素正在拖动时触发
  // ondragend - 用户完成元素拖动后触发

  // 释放目标时触发的事件:
  // ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
  // ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
  // ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
  // ondrop - 在一个拖动过程中，释放鼠标键时触发此事件
  // @ondragenter=""
  // @ondragover=""
  // @ondragleave=""
  // @ondrop=""
  handleDelDragEnter(e: any, item: any) {
    console.log("handleDelDragEnter");
  }
  handleDelDragOver(e: any) {
    console.log("handleDelDragOver");
    // e.preventDefault()
  }
  handleDelDragLeave(e: any) {
    console.log("handleDelDragLeave");
  }
  handleDelDrop(e: any) {
    console.log("handleDelDrop");
  }

  // item task checked...
  changeTaskCheck(checked: any, item: any) {
    console.log("changeTaskCheck", checked, item);

    let myTodayTasks = new Array<MyTaskInfoBean>();
    let myTodoTasks = new Array<MyTaskInfoBean>();

    var mark = 0;
    this.myTasks.forEach((val, idx, arr) => {
      if (val.isTitle) {
        if (mark == 0) {
          mark = 1;
        } else if (mark == 1) {
          mark = 2;
        }
        return;
      }

      if (mark == 1) {
        if (val.id === item.id) {
          if (checked) {
          val.status = 2;
          } else {
          val.status = 1;
          }
        }
        myTodayTasks.push(val);
      } else if (mark == 2) {
        myTodoTasks.push(val);
      }
    });
    TaskManager.getInstance().updateDynamicTasks(myTodayTasks, myTodoTasks);
    this.refresh()
  }

  clickRemove(item: any, ev: any) {
    this.$message.success('成功删除一条任务！');
    TaskManager.getInstance().removeTask(item.id);
    this.refresh()

  }
  addTask() {
    console.log("addTask");
    if (this.todoInput.length == 0) {
      this.$message.error("内容不能为空");
      return;
    }
    let task = TaskManager.getInstance().createMyTask(this.todoInput);
    this.myTasks.push(task);
    this.todoInput = "";
  }

  private queryTodayCompletedNum(today: any): number {
    var n = 0;
    for (var t of today) {
      if (t.status == 2) {
        n++
      }
    }
    return n;
  }

  refresh() {
    this.myTasks = new Array<any>();
    let myT = TaskManager.getInstance().getMyTasks();

    // 今日任务
    var todayTitleMsg = "今日任务 "
    if (myT.today) {
      let completedNum = this.queryTodayCompletedNum(myT.today);
      todayTitleMsg += completedNum + "/" + myT.today.length;
    }
    let todayTitle = { id: "today_title", msg: todayTitleMsg, isTitle: true };
    this.myTasks.push(todayTitle);
    if (myT.today) {
      this.myTasks = this.myTasks.concat(myT.today);
    }

    // 待办任务
    var todoTitleMsg = "待办任务 "
    if (myT.todo) {
      todoTitleMsg += myT.todo.length;
    }
    let todoTitle = { id: "todo_title", msg: todoTitleMsg, isTitle: true };
    this.myTasks.push(todoTitle);
    if (myT.todo) {
      this.myTasks = this.myTasks.concat(myT.todo);
    }
  }

  updateTask() {
    let myTodayTasks = new Array<MyTaskInfoBean>();
    let myTodoTasks = new Array<MyTaskInfoBean>();

    var mark = 0;
    this.myTasks.forEach((val, idx, arr) => {
      if (val.isTitle) {
        if (mark == 0) {
          mark = 1;
        } else if (mark == 1) {
          mark = 2;
        }
        return;
      }

      if (mark == 1) {
        myTodayTasks.push(val);
      } else if (mark == 2) {
        myTodoTasks.push(val);
      }
    });
    TaskManager.getInstance().updateDynamicTasks(myTodayTasks, myTodoTasks);
    this.refresh()
  }
  changeComplete() {}
}
</script>
  
<style scoped>
.container {
  width: 60%;
  margin: auto auto;
  /* background-image: url("http://pic1.win4000.com/wallpaper/2018-03-28/5abb5232115a1.jpg") */
}

.task_input_container {
  width: 60%;
  margin: auto auto;
  margin-top: 20px;
  padding: 10px;
}

.task_list_container {
  /* margin-top: 10px; */
  background-color: #f5f5f5;
}

.todo-task-item-div {
  transition: all linear 0.1s;
}

.tl-input-box {
  width: 60%;
  margin: auto auto;
  margin-top: 20px;
  padding: 10px;
}

.out {
  width: 100px;
  height: 150px;
  background: url() 0 0 no-repeat;
  margin: 100px;
  background-size: 100%;
  color: red;
  border: 4px solid #000;
  text-align: center;
}
</style>
