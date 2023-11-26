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

  private getTaskList(result: string): taskInterface[] {
    if (result) {
      return JSON.parse(result);
    } else {
      return [];
    }
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
