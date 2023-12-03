import storageClass from "./storageClass";
import moment from "moment";

interface taskInterface {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  elapsed_time: string;
}

class taskClass implements taskInterface {
  public id: number;
  public name: string;
  public start_time: string;
  public end_time: string;
  public elapsed_time: string;

  protected storage: storageClass;
  constructor() {
    this.storage = new storageClass();
    this.id = 0;
    this.name = "";
    this.start_time = "";
    this.end_time = "";
    this.elapsed_time = "";
  }

  /**
   * タスクを追加する
   * @param {string} taskName
   * @return {void}
   */
  public addTask(taskName: string): void {
    let taskList: taskInterface[] = [];

    this.storage.getStorage("taskList", (result: string) => {
      taskList = this.getTaskList(result);
      const newTask: taskInterface = {
        id: taskList.length,
        name: taskName,
        start_time: this.formatTime(this.roundTime(this.getNow())),
        end_time: "",
        elapsed_time: "",
      };

      taskList.push(newTask);
      this.storage.saveToStorage("taskList", JSON.stringify(taskList));
    });
  }

  /**
   * タスクを編集する
   * @param {number} id
   * @param {string} taskName
   * @return {void}
   */
  public editTask(id: number, taskName: string): void {
    this.storage.getStorage("taskList", (result: string) => {
      const taskList = this.getTaskList(result);
      const newTaskList = taskList.map((task) => {
        if (task.id === id) {
          task.name = taskName;
        }
        return task;
      });
      this.storage.saveToStorage("taskList", JSON.stringify(newTaskList));
    });
  }

  /**
   * タスクを削除する
   * @param {number} id
   * @returns {void} taskList
   */
  public deleteTask(id: number): void {
    this.storage.getStorage("taskList", (result: string) => {
      const taskList = this.getTaskList(result);
      const newTaskList = taskList.filter((task) => task.id !== id);
      console.log(newTaskList);
      this.storage.saveToStorage("taskList", JSON.stringify(newTaskList));
    });
  }

  /**
   * タスクを全件削除する
   * @returns {void}
   */
  public deleteAllTask(): void {
    this.storage.saveToStorage("taskList", JSON.stringify([]));
  }

  /**
   * confirm delete alert
   */
  public confirmDelete(): void {
    const result = window.confirm("全てのタスクを削除しますか？");
    if (result) {
      this.deleteAllTask();
    }
  }

  private getTaskList(result: string): taskInterface[] {
    if (result) {
      return JSON.parse(result);
    } else {
      return [];
    }
  }

  /**
   * タスクを時間順にソートする
   * @param {taskInterface[]} taskList
   * @return {taskInterface[]}
   * @private
   */
  private sortTaskList(taskList: taskInterface[]): taskInterface[] {
    return taskList.sort((a, b) => {
      if (a.start_time < b.start_time) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  /**
   * フロント用のタスクリストを取得する
   * @return {Promise<taskInterface[]>}
   */
  public async getTaskListForFront(): Promise<taskInterface[]> {
    return new Promise<taskInterface[]>((resolve) => {
      this.storage.getStorage("taskList", (result: string) => {
        const taskList = this.getTaskList(result);
        resolve(this.sortTaskList(taskList));
      });
    });
  }

  public calculateTimeDifferenceAtIndex(
    tasks: taskInterface[],
    index: number
  ): string {
    console.log("calculateTimeDifferenceAtIndex: index = " + index);
    if (index === tasks.length - 1) {
      return "00:00";
    }

    const taskTime = moment(tasks[index].start_time, "HH:mm");
    const nextTaskTime = moment(tasks[index + 1].start_time, "HH:mm");

    // 指定されたタスクと次のタスクの時間差分を秒単位で計算し、HH:mmフォーマットに変換
    const diffInSeconds = nextTaskTime.diff(taskTime, "seconds");
    const result = moment()
      .startOf("day")
      .add(diffInSeconds, "seconds")
      .format("HH:mm");
    console.log("calculateTimeDifferenceAtIndex: result = " + result);
    return result;
  }

  /**
   * 現在時刻を取得する
   * @return {void}
   */
  public getNow(): moment.Moment {
    const now = moment().format("YYYY-MM-DD HH:mm");
    console.log(now);
    return moment(now);
  }

  /**
   * 時刻を15分単位で切り捨てる
   * @param {moment.Moment} time
   * @return {moment.Moment}
   */
  public roundTime(time: moment.Moment): moment.Moment {
    const rounded = time.minutes(Math.floor(time.minutes() / 15) * 15);
    console.log(rounded);
    return rounded;
  }

  /**
   * 時刻をフォーマットする
   * @param {moment.Moment} time
   * @return {string} HH:mm
   */
  public formatTime(time: moment.Moment): string {
    return time.format("HH:mm");
  }

  /**
   * タスクをレポート用にフォーマットする
   * @param {taskInterface[]} taskList
   * @return {string}
   */
  public formatTaskListForReport(taskList: taskInterface[]): string {
    let result = "";
    taskList.forEach((task) => {
      result += `・${task.start_time}~: ${task.name}\n`;
    });
    return result;
  }
}

export default taskClass;
