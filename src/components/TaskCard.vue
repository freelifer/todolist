<template>
  <div class="task-card">
    <div class="task-card-header" :style="{'background-color': bgColor[type]}">{{quadrant[type]}}</div>

    <div class="task-card-body">
      <task-list :data="data" @change="changeComplete" @dragEndChange="dragEndChange"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TaskList from "@/components/TaskList.vue"; // @ is an alias to /src


@Component({
  components: {
    TaskList
  }
})
export default class TaskCard extends Vue {
  @Prop() private headerTitle!: Array<any>
  @Prop() private type!: number
  @Prop() private data!: Array<any>
  private quadrant: Array<string> = ['重要且紧急','重要不紧急','不重要但紧急','不重要不紧急']
  private bgColor: Array<string> = ['#f7d1d0','#fffbb9','#bbc9fb','#d8d8d8']


  changeComplete(e:any) {
    this.$emit('change', e)
  }
  dragEndChange(arr:any) {
    this.$emit('dragEndChange', arr)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.task-card {
  width: 80%;
  margin: auto auto;
  background-color: white;
  -webkit-box-shadow:3px 3px 3px #c8c8c8 ;
  -moz-box-shadow:3px 3px 3px #c8c8c8 ;
  box-shadow: 3px 3px 3px #c8c8c8;

}
.task-card-header {
  height: 48px;
  line-height: 48px;
  background-color: #f7d1d0;
  // background-color: #fffbb9;
  // background-color: #bbc9fb;
  // background-color: #d8d8d8;
}
.task-card-body {
  padding: 8px;
}
</style>
