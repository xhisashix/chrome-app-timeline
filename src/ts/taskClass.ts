import storageClass from "./storageClass";
import moment from "moment";

class taskClass {
  protected storage: storageClass;
  constructor() {
    this.storage = new storageClass();
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
   * @return {void}
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
