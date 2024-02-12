import storageClass from "./storageClass";
class diaryClass {
  storage: storageClass;

  constructor() {
    this.storage = new storageClass();
  }

  /**
   * @param {string} task_report
   * @param {string} status_report
   */
  async createReportMail(task_report: string, status_report: string) {
    const report_settings = await this.storage.getReportSetting([
      "to",
      "cc",
      "report_head",
      "name",
      "report_footer",
    ]);

    // 引数をもとにGmailの下書きを作成する
    const name = report_settings[3].name || "";
    const subject = this.createSubject(name);


    const to = report_settings[0].to;
    const cc = report_settings[1].cc;
    const report_head = report_settings[2].report_head || "";
    const report_footer = report_settings[4].report_footer || "";
    const body = this.template(report_head, task_report, status_report, report_footer);

    const encodeBody = this.encodePlainText(body);
    const baseUrl = "https://mail.google.com/mail/?view=cm";
    const url = `${baseUrl}&to=${to}&cc=${cc}&su=${subject}&body=${encodeBody}`;
    chrome.tabs.create({ url: url }, (tab) => {
      console.log("tab", tab);
    });
  }

  /**
   * encode body to base64
   * @param {string} body
   * @return {string}
   */
  encodePlainText(body: string) {
    const encodedBody = encodeURI(body);
    return encodedBody;
  }

  /**
   * @param {string} name - name of the user
   * @return {string}
   */
  createSubject(name: string) {
    const date = new Date();
    const today =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    const subject = `${today}  日報 - ${name}`;

    return subject;
  }

  /**
   * @param {string} task_report
   * @param {string} status_report
   * @return {string}
   */
  template(report_head: string, task_report: string, status_report: string, report_footer: string = "") {
    const report = `${report_head}\n\n【進捗状況】\n${status_report}\n\n【タスク状況】\n${task_report}\n\n${report_footer}`;

    return report;
  }

  /**
   * @param {string} report_head
   * @return {string}
   */
  templateForPreview(
    report_head: string,
    report_footer: string,
  ) {

    report_head = report_head.replace(/\n/g, "<br>");
    report_footer = report_footer.replace(/\n/g, "<br>");
    // フォーマットを崩さずに出力
    const report = `<p>${report_head}</p><br><p>【進捗状況】</p><p>{{進捗状況}}</p><br><p>【タスク状況】</p><p>{{タスク状況}}</p><br><p>${report_footer}</p>`;


    return report;
  }
}

export default diaryClass;
