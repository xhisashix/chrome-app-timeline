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

  private getTaskList(result: string): taskInterface[] {
    if (result) {
      return JSON.parse(result);
    } else {
      return [];
    }
  }

  /**
   * フロント用のタスクリストを取得する
   * @return {Promise<taskInterface[]>}
   */
  public async getTaskListForFront(): Promise<taskInterface[]> {
    return new Promise<taskInterface[]>((resolve) => {
      this.storage.getStorage("taskList", (result: string) => {
        const taskList = this.getTaskList(result);
        resolve(taskList);
      });
    });
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
}

export default taskClass;
