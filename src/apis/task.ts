export default interface TaskBean {
    // 任务唯一id
    id: string

    // 任务内容
    msg: string

    // 任务排序
    order: number

    // 任务创建时间
    created: number

    // 任务开始执行时间
    started: number

    // 任务完成时间
    completed: number

    isCompleted: boolean

    // 任务当前状态
    status: number

    isFloat: boolean
}

const STORAGE_KEY: string = 'todos-vuejs'
const MY_TAST_LIST = 'my-task-list'
const MY_DYNAMIC_TASKS = "my-dynamic-tasks"

export class TaskManager {
    private static _instance: TaskManager = new TaskManager();

    private _tasks?: Array<TaskItemBean>;
    private _mytasks?: MyTaskBean;
    private _myDynamicTasks!: Array<MyTaskDynamicBean>;

    private constructor() {
        this.initMyTask();
    }

    public static getInstance(): TaskManager {
        return this._instance;
    }

    // 初始化数据
    public init() {
        // 空实现 

        // 任务分类，1. 今日任务title 2. 今日任务列表 3. 待办任务title 4. 待办任务列表
    }

    // 更新动态任务数据
    // 注意 today为[] todo为[]
    public updateDynamicTasks(today: Array<MyTaskInfoBean>, todo: Array<MyTaskInfoBean>) {
        if (!this._mytasks || this._myDynamicTasks.length == 0) {
            return;
        }

        var updated: boolean = false;
        this._myDynamicTasks.forEach((val, idx, array) => {
            // val: 当前值
            // idx：当前index
            // array: Array
            let todayTask = this.getMyTaskByArrAndId(today, val.id)
            if (todayTask) {
                console.log(todayTask)
                if (val.status != 1) {
                    val.status = 1;
                }
                if (todayTask.obj.status == 2) {
                    val.status = 2;
                }
                val.order = parseInt(todayTask.idx, 10);
                updated = true;
                return
            }

            let todoTask = this.getMyTaskByArrAndId(todo, val.id)
            if (todoTask) {
                if (val.status != 0) {
                    val.status = 0;
                }
                val.order = parseInt(todoTask.idx, 10);
                updated = true;
                return
            }

            console.error("update task status error ==>>", today, todo, val);
        });

        if (updated) {
            window.localStorage.setItem(MY_DYNAMIC_TASKS, JSON.stringify(this._myDynamicTasks))
        }
    }

    public getMyTaskByArrAndId(arr: Array<MyTaskInfoBean>, id: string): any {
        if (!arr || arr.length == 0) {
            return undefined;
        }
        for (let index in arr) {
            if (arr[index].id === id) {
                return {idx: index, obj: arr[index]};
            }
        }
    }

    public getMyTaskDynamicBeanByArrAndId(arr: any, id: string): any {
        if (!arr || arr.length == 0) {
            return undefined;
        }
        for (let index in arr) {
            if (arr[index].id === id) {
                return {idx: index, obj: arr[index]};
            }
        }
    }

    public getMyTaskById(id: string): any {
        if (!this._mytasks) {
            return undefined;
        }
        for (let index in this._mytasks.tasks) {
            if (this._mytasks.tasks[index].id === id) {
                return this._mytasks.tasks[index];
            }
        }
    }

    // @public
    // 返回今日任务和待办任务集合
    public getMyTasks(): MyAllTasks {
        if (!this._mytasks || this._myDynamicTasks.length == 0) {
            return {};
        }

        let myTodoTasks = new Array<MyMargeTaskBean>();
        let myTodayTasks0 = new Array<MyMargeTaskBean>();
        let myTodayTasks1 = new Array<MyMargeTaskBean>();
        for (let index in this._myDynamicTasks) {
            let myDynamicTask = this._myDynamicTasks[index];
            if (myDynamicTask.status == 0) {
                let myTaskInfoBean = this.getMyTaskById(myDynamicTask.id);
                if (myTaskInfoBean) {
                    myTodoTasks.push({id: myTaskInfoBean.id, msg: myTaskInfoBean.msg, created: myTaskInfoBean.created, order: myDynamicTask.order, status: myDynamicTask.status});
                }
            } else if (myDynamicTask.status == 1 ) {
                let myTaskInfoBean = this.getMyTaskById(myDynamicTask.id);
                if (myTaskInfoBean) {
                    myTodayTasks0.push({id: myTaskInfoBean.id, msg: myTaskInfoBean.msg, created: myTaskInfoBean.created, order: myDynamicTask.order, status: myDynamicTask.status});
                }
            } else if (myDynamicTask.status == 2) {
                let myTaskInfoBean = this.getMyTaskById(myDynamicTask.id);
                if (myTaskInfoBean) {
                    myTodayTasks1.push({id: myTaskInfoBean.id, msg: myTaskInfoBean.msg, created: myTaskInfoBean.created, order: myDynamicTask.order, status: myDynamicTask.status});
                }
            }
        }
        myTodayTasks0.sort(this.compareFunction);
        myTodayTasks1.sort(this.compareFunction);

        myTodoTasks.sort(this.compareFunction);

        return { today: myTodayTasks0.concat(myTodayTasks1), todo: myTodoTasks };
    }

    public removeTask(id: string) {
        let todoTask = this.getMyTaskByArrAndId(this._mytasks!.tasks, id)
        this._mytasks!.tasks.splice(todoTask.idx, 1);
        window.localStorage.setItem(MY_TAST_LIST, JSON.stringify(this._mytasks));

        let t = this.getMyTaskDynamicBeanByArrAndId(this._myDynamicTasks, id);
        if (t) {
            this._myDynamicTasks.splice(t.idx, 1);
        }
    }

    // 根据order 排序
    private compareFunction(item1: MyMargeTaskBean, item2: MyMargeTaskBean): number {
        if(item1.order > item2.order) {
            return 1; // 如果是降序排序，返回-1。
        }else if(item1.order === item2.order) {
            return 0;
        }else {
            return -1; // 如果是降序排序，返回1。
        }
    }

    /**
     * 创建一个我的待办任务
     * @param myTaskMsg 任务名称
     */
    public createMyTask(myTaskMsg: string): MyTaskInfoBean {
        if (this._mytasks) {
            let taskIdNum: number = this._mytasks.maxId + 1
            let taskId: string = taskIdNum.toString();
            this._mytasks.maxId = taskIdNum;

            let task = { id: taskId, msg: myTaskMsg, created: Date.parse(new Date().toString()) };
            this._mytasks.tasks.push(task)

            this.createMyDynamicTaskAndInit(taskId);
            window.localStorage.setItem(MY_TAST_LIST, JSON.stringify(this._mytasks));
            return task;
        } else {
            let task = { id: "1", msg: myTaskMsg, created: Date.parse(new Date().toString()) };
            this._mytasks = { maxId: 1, tasks: [] };
            this._mytasks.tasks.push(task);

            this.createMyDynamicTaskAndInit("1");
            window.localStorage.setItem(MY_TAST_LIST, JSON.stringify(this._mytasks));
            return task;
        }
    }

    private createMyDynamicTaskAndInit(id: string) {
        let myDynamicTask: MyTaskDynamicBean = { id: id, order: 0, started: 0, completed: 0, status: 0 };
        this._myDynamicTasks.push(myDynamicTask)


        window.localStorage.setItem(MY_DYNAMIC_TASKS, JSON.stringify(this._myDynamicTasks))
    }

    private initMyTask() {
        let myTaskList = window.localStorage.getItem(MY_TAST_LIST)
        if (myTaskList) {
            this._mytasks = JSON.parse(myTaskList)
        }
        this._myDynamicTasks = JSON.parse(window.localStorage.getItem(MY_DYNAMIC_TASKS) || '[]')
    }

}

// 任务接口
export interface Task {
    id: string
}

// 我的所有任务信息
export class MyAllTasks {
    today?: Array<MyTaskInfoBean>;
    todo?: Array<MyTaskInfoBean>;
}

// 任务基本信息
export interface MyTaskBean {
    maxId: number
    tasks: Array<MyTaskInfoBean>
}

// 任务基本信息 不变的
export interface MyTaskInfoBean {
    // 任务唯一id
    id: string

    // 任务内容
    msg: string

    // 任务创建时间
    created: number
}

// 任务可变参数
// status: 0 - 初始值 待办任务 1 - 已加入今日任务 2 - 完成
export interface MyTaskDynamicBean {
    // 任务唯一id
    id: string

    // 任务排序
    order: number

    // 任务开始执行时间
    started: number

    // 任务完成时间
    completed: number

    // 任务当前状态
    status: number
}

export interface MyMargeTaskBean extends MyTaskInfoBean {
    order: number
    status: number
}
export interface TaskTitleBean extends Task {
    id: string
    msg: string
    completedNum: number
    totalNum: number
}


export interface TaskItemBean extends Task {
    // 任务唯一id
    id: string

    // 任务内容
    msg: string

    // 任务排序
    order: number

    // 任务创建时间
    created: number

    // 任务开始执行时间
    started: number

    // 任务完成时间
    completed: number

    isCompleted: boolean

    // 任务当前状态
    status: number

    isFloat: boolean

    type: string
}