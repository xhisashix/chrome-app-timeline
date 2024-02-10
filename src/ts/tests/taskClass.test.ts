import moment from "moment";
import TaskClass from "../taskClass";

const taskClass = new TaskClass();

describe("test chrome_app_timeline", function () {
  it("test chrome-app-timeline.taskClass.getNow", function () {
    const now = moment();
    const result = taskClass.getNow();
    console.log(result.format("YYYY-MM-DD HH:mm"));
    console.log(now);
    expect(result.format("YYYY-MM-DD HH:mm")).toBe(now.format("YYYY-MM-DD HH:mm"));
  });

  it("test chrome-app-timeline.taskClass.roundTime", function () {
    const time = moment("2022-01-01 12:34");
    const rounded = taskClass.roundTime(time);
    expect(rounded.format("YYYY-MM-DD HH:mm")).toBe("2022-01-01 12:30");
  });

  it("test chrome-app-timeline.taskClass.formatTime", function () {
    const time = moment("2022-01-01 12:34");
    const formattedTime = taskClass.formatTime(time);
    expect(formattedTime).toBe("12:34");
  });
});
