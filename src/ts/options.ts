import storageClass from "./storageClass";
import diaryClass from "./diaryClass";
import tagClass from "./tagClass";

const storage = new storageClass();
const diary = new diaryClass();
const TagClass = new tagClass();
const to = document.getElementById("to") as HTMLInputElement;
const cc = document.getElementById("cc") as HTMLInputElement;
const name = document.getElementById("name") as HTMLInputElement;
const report_head = document.getElementById("report_head") as HTMLInputElement;
const report_footer = document.getElementById("report_footer") as HTMLInputElement;
const save = document.getElementById("save") as HTMLButtonElement;
const preview_subject = document.getElementById("preview_subject") as HTMLButtonElement;
const preview_body = document.getElementById("preview_body") as HTMLButtonElement;
const tag_name = document.getElementById("tag_name") as HTMLInputElement;
const add_tag = document.getElementById("add_tag") as HTMLButtonElement;

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
  const subject = await diary.createSubject(name.value);
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

add_tag.onclick = () => {
  TagClass.addTag(tag_name.value);
  tag_name.value = "";

  // 0.5秒後にタグリストを再描画する
  setTimeout(() => {
    location.reload();
  }, 500);
};

// タグリストを表示する
const tagLists = document.getElementById("tag_lists") as HTMLDivElement;
TagClass.getTagList().then((tagList) => {
  tagLists.innerHTML = "";
  tagList.forEach((tag) => {
    const tr = document.createElement("tr");
    tr.classList.add("tag");

    const tagTd = document.createElement("td");
    tagTd.classList.add("border", "px-2", "py-2", "min-w-[90px]");
    tagTd.textContent = tag.name;

    // ここでタグの削除ボタンを追加する
    const buttonTd = document.createElement("td");
    buttonTd.classList.add("border", "px-2", "py-2", "min-w-[90px]");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "flex-shrink-0",
      "bg-red-500",
      "hover:bg-red-700",
      "border-red-500",
      "hover:border-red-700",
      "text-sm",
      "border-4",
      "text-white",
      "py-1",
      "px-2",
      "rounded",
      "ml-2",
    );
    deleteButton.textContent = "削除";
    deleteButton.onclick = () => {
      TagClass.deleteTag(tag.id);
      tr.remove();
    };
    buttonTd.appendChild(deleteButton);

    tr.appendChild(tagTd);
    tr.appendChild(buttonTd);
    tagLists.appendChild(tr);
  });
});
