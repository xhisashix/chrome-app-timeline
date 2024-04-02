import storageClass from "./storageClass";
import moment from "moment";

interface TaskInterface {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  elapsed_time: string;
  tag?: string;
}

class TaskClass implements TaskInterface {
  public id: number;
  public name: string;
  public start_time: string;
  public end_time: string;
  public elapsed_time: string;
  public tag: string;

  storage: storageClass;

  constructor() {
    this.storage = new storageClass();
    this.id = 0;
    this.name = "";
    this.start_time = "";
    this.end_time = "";
    this.elapsed_time = "";
    this.tag = "";
  }

  /**
   * タスクを追加する
   * @param {string} taskName
   * @return {void}
   */
  public addTask(taskName: string, tag: string = ""): void {
    let taskList: TaskInterface[] = [];

    this.storage.getStorage("taskList", (result: string) => {
      taskList = this.getTaskList(result);
      const newTask: TaskInterface = {
        id: taskList.length,
        name: taskName,
        start_time: this.formatTime(this.roundTime(this.getNow())),
        end_time: "",
        elapsed_time: "",
        tag: tag,
      };

      taskList.push(newTask);
      this.storage.saveToStorage("taskList", JSON.stringify(taskList));
    });
  }

  /**
   * idをもとにタスクの取得
   * @param {number} id
   * @return {Promise<TaskInterface>}
   */
  public async getTaskById(id: number): Promise<TaskInterface | undefined> {
    return new Promise<TaskInterface | undefined>((resolve) => {
      this.storage.getStorage("taskList", (result: string) => {
        const taskList = this.getTaskList(result);
        const task = taskList.find((task) => task.id === id);
        resolve(task);
      });
    });
  }

  /**
   * タスクを編集する
   * @param {number} id
   * @param {string} taskName
   * @param {string} tag
   * @param {string} time
   * @return {void}
   */
  public editTask(id: number, taskName: string, tag: string = "", time: string): void {
    this.storage.getStorage("taskList", (result: string) => {
      const taskList = this.getTaskList(result);
      const newTaskList = taskList.map((task) => {
        if (task.id === id) {
          task.name = taskName;
          task.start_time = time;
          task.tag = tag;
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

  private getTaskList(result: string): TaskInterface[] {
    if (result) {
      return JSON.parse(result);
    } else {
      return [];
    }
  }

  /**
   * タスクを時間順にソートする
   * @param {TaskInterface[]} taskList
   * @return {TaskInterface[]}
   * @private
   */
  private sortTaskList(taskList: TaskInterface[]): TaskInterface[] {
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
   * @return {Promise<TaskInterface[]>}
   */
  public async getTaskListForFront(): Promise<TaskInterface[]> {
    return new Promise<TaskInterface[]>((resolve) => {
      this.storage.getStorage("taskList", (result: string) => {
        const taskList = this.getTaskList(result);
        resolve(this.sortTaskList(taskList));
      });
    });
  }

  public calculateTimeDifferenceAtIndex(tasks: TaskInterface[], index: number): string {
    if (index === tasks.length - 1) {
      return "00:00";
    }

    const taskTime = moment(tasks[index].start_time, "HH:mm");
    const nextTaskTime = moment(tasks[index + 1].start_time, "HH:mm");

    // 指定されたタスクと次のタスクの時間差分を秒単位で計算し、HH:mmフォーマットに変換
    const diffInSeconds = nextTaskTime.diff(taskTime, "seconds");
    const result = moment().startOf("day").add(diffInSeconds, "seconds").format("HH:mm");
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
    return time.minutes(Math.floor(time.minutes() / 15) * 15);
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
   * @param {TaskInterface[]} taskList
   * @return {string}
   */
  public formatTaskListForReport(taskList: TaskInterface[]): string {
    let result = "";
    taskList.forEach((task) => {
      if (task.tag === "" || task.tag === undefined) {
        result += `・${task.start_time}~: ${task.name}\n`;
      } else {
        result += `・${task.start_time}~: [${task.tag}] ${task.name}\n`;
      }
    });
    return result;
  }

  /**
   * ボタンを作成する
   * @param {string} text
   * @param {string[]} classes
   * @returns {HTMLButtonElement}
   * @private
   */
  public createButton(text: string, classes: string[]) {
    const button = document.createElement("button");
    button.textContent = text;
    button.type = "button";
    classes.forEach((c) => button.classList.add(c));
    return button;
  }

  // ボタンを含むセルを作成する
  public createButtonCell(
    buttonText: string,
    color: string,
    clickHandler: () => void,
  ): HTMLTableCellElement {
    const button = this.createButton(buttonText, [
      "bg-blue-500",
      "hover:bg-blue-700",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded",
    ]);

    if (color === "red") {
      button.classList.remove("bg-blue-500", "hover:bg-blue-700");
      button.classList.add("bg-red-500", "hover:bg-red-700");
    }

    button.addEventListener("click", clickHandler);

    const td = document.createElement("td");
    td.classList.add("border", "px-2", "py-2", "min-w-[50px]");
    td.appendChild(button);

    return td;
  }
}

export default TaskClass;
