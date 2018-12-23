const STORAGE_KEY = 'todos-vuejs'
const TAST_LIST = 'task-list'
interface Task {
    msg: string
    type: number
    date: number
    completed: boolean
}
export default {
    fetch() {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    },
    save(items: any) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    },
    getAll() {
        return JSON.parse(window.localStorage.getItem(TAST_LIST) || '[]')
    },
    savaAll(arr: any) {
        window.localStorage.setItem(TAST_LIST, JSON.stringify(arr))
    },
    put(item: Task) {
        let a = this.getAll()
        a.push(item)
        window.localStorage.setItem(TAST_LIST, JSON.stringify(a))
    },
    modify(data: Task) {
        let arr = this.getAll()
        for (let i in arr) {
            let item = arr[i]
            if (item.msg == data.msg && item.type == data.type && item.date == data.date) {
                arr.splice(i, 1, data)
            }
        }

        window.localStorage.setItem(TAST_LIST, JSON.stringify(arr))

    }
}