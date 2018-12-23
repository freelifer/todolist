<template>
  <div class="home">
    <div class="tl-input-box">
      <el-input
        class="tl-input"
        placeholder="what do you need to do "
        v-model="todoInput"
        clearable
      ></el-input>
      <el-select class="tl-select" v-model="typeOption" placeholder="请选择" v-if="!hiddenTypeOption">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button class="tl-input-btn" type="primary" icon="el-icon-plus" @click="addTask">Add Task</el-button>
    </div>
    <div class="tl-task">
      <task-card
        class="tl-task-co"
        :data="taskListFirstData"
        type="0"
        @change="changeComplete0"
        @dragEndChange="dragEndChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import TaskCard from "@/components/TaskCard.vue"; // @ is an alias to /src
import localstorage from "@/localstorage"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    TaskCard
  }
})
export default class Home extends Vue {
  private todoInput: string = "";
  private typeOption: string = "0";
  private taskListFirstData: Array<any> = new Array<any>();
  private taskListSecondData: Array<any> = new Array<any>();
  private taskListThirdData: Array<any> = new Array<any>();
  private taskListFourthData: Array<any> = new Array<any>();
  private hiddenTypeOption: boolean = true

  data() {
    return {
      options: [
        {
          value: "0",
          label: "重要且紧急"
        },
        {
          value: "1",
          label: "重要不紧急"
        },
        {
          value: "2",
          label: "不重要但紧急"
        },
        {
          value: "3",
          label: "不重要不紧急"
        }
      ],
      input10: "",
      multipleSelection: []
    };
  }

  mounted() {
    let arr = localstorage.getAll();
    for (let i in arr) {
      let task = arr[i];
      if (task.type == 0) {
        this.taskListFirstData.push(task);
      } else if (task.type == 1) {
        this.taskListSecondData.push(task);
      } else if (task.type == 2) {
        this.taskListThirdData.push(task);
      } else if (task.type == 3) {
        this.taskListFourthData.push(task);
      }
    }
  }

  changeComplete0(item: any) {
    localstorage.modify(item);
  }

  changeComplete1(item: any) {
    localstorage.modify(item);
  }

  changeComplete2(item: any) {
    localstorage.modify(item);
  }

  changeComplete3(item: any) {
    localstorage.modify(item);
  }

  dragEndChange(arr: any) {
    localstorage.savaAll(arr);
  }
  addTask() {
    if (this.todoInput.length == 0) {
      return;
    }
    console.log(this.typeOption);
    if (this.typeOption == "0") {
      this.taskListFirstData.push({ msg: this.todoInput });
    } else if (this.typeOption == "1") {
      this.taskListSecondData.push({ msg: this.todoInput });
    } else if (this.typeOption == "2") {
      this.taskListThirdData.push({ msg: this.todoInput });
    } else if (this.typeOption == "3") {
      this.taskListFourthData.push({ msg: this.todoInput });
    }
    localstorage.put(
      this.newTask(
        this.todoInput,
        Number(this.typeOption),
        new Date().getTime()
      )
    );
    // localstorage.put({msg: this.todoInput})
    this.todoInput = "";
  }

  newTask(message: string, type: number, date: number) {
    return {
      msg: message,
      type: type,
      date: date,
      completed: false
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home {
  text-align: center;
  background-color: #409eff;
}
.tl-input-box {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.tl-input {
  width: 300px;
  margin-right: 20px;
}
.tl-select {
  margin-right: 20px;
}
.tl-input-btn {
  background-color: #575858;
}
.tl-task-list {
  width: 80%;
  margin: auto auto;
}
.tl-task-card {
  background-color: white;
}
.tl-task-item-header {
  height: 48px;
  line-height: 48px;
  background-color: #ead7b6;
}
.tl-task-item-body {
  padding: 8px;
}
.tl-task {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tl-task-row {
  width: 80%;
  display: flex;
  margin: auto auto;
}
.tl-task-co {
  width: 80%;
  margin: 10px;
  margin: auto auto;
}
</style>
