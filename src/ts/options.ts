import storageClass from "./storageClass";
import diaryClass from "./diaryClass";

const storage = new storageClass();
const diary = new diaryClass();
const to = document.getElementById("to") as HTMLInputElement;
const cc = document.getElementById("cc") as HTMLInputElement;
const name = document.getElementById("name") as HTMLInputElement;
const report_head = document.getElementById("report_head") as HTMLInputElement;
const report_footer = document.getElementById("report_footer") as HTMLInputElement;
const save = document.getElementById("save") as HTMLButtonElement;
const preview_subject = document.getElementById("preview_subject") as HTMLButtonElement;
const preview_body = document.getElementById("preview_body") as HTMLButtonElement;

storage.getReportFromStorage("to", (value) => {
  to.value = value || "";
});

storage.getReportFromStorage("cc", (value) => {
  cc.value = value || "";
});

storage.getReportFromStorage("name", (value) => {
  name.value = value || "";
});

storage.getReportFromStorage("report_head", (value) => {
  report_head.value = value || "";
});

storage.getReportFromStorage("report_footer", (value) => {
  report_footer.value = value || "";
});

save.onclick = () => {
  storage.saveReportToStorage("to", to.value);
  storage.saveReportToStorage("cc", cc.value);
  storage.saveReportToStorage("report_head", report_head.value);
  storage.saveReportToStorage("name", name.value);
  storage.saveReportToStorage("report_footer", report_footer.value);

  // 保存完了メッセージ
  const message = document.getElementById("message") as HTMLDivElement;
  message.classList.remove("hidden");

  setTimeout(() => {
    message.classList.add("hidden");
  }, 1000);
};

// プレビューへtemplateの値を出力
window.onload = async () => {
  const template = await diary.templateForPreview(report_head.value, report_footer.value);
  const subject = diary.createSubject(name.value);
  preview_subject.innerHTML = subject;
  preview_body.innerHTML = template;
};

// 設定が変更されたときにプレビューを再読み込みする
const reloadPreview = () => {
  const template: string = diary.templateForPreview(report_head.value, report_footer.value);
  preview_body.innerHTML = template;
  let subject: string = diary.createSubject(name.value);
  preview_subject.innerHTML = subject;
};

["to", "cc", "report_head", "name", "report_footer"].forEach((id) => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("change", reloadPreview);
  } else {
    console.warn(`Element with id "${id}" not found.`);
  }
});
