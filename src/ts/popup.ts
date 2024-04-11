import taskClass from "./taskClass";
import diaryClass from "./diaryClass";
import tagClass from "./tagClass";
const TaskClass = new taskClass();
const Diary = new diaryClass();
const TagClass = new tagClass();

const createBtn = document.getElementById("createBtn") as HTMLButtonElement;
const editBtn = document.getElementById("edit_task") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancel") as HTMLButtonElement;
const cancelModal = document.getElementById("close_modal") as HTMLDivElement;
const taskName = document.getElementById("edit_task_name") as HTMLInputElement;
const tag = document.getElementById("edit_tag") as HTMLInputElement;
const startTime = document.getElementById("edit_start_time") as HTMLInputElement;
const calculationTag = document.getElementById("calculationTag") as HTMLSelectElement;
const tagSelect = document.getElementById("tag_select") as HTMLSelectElement;
const editTagSelect = document.getElementById("edit_tag_select") as HTMLSelectElement;

// 日報作成
createBtn.addEventListener("click", async () => {
  const tasks = await TaskClass.getTaskListForFront();
  const copyText = TaskClass.formatTaskListForReport(tasks);
  Diary.createReportMail("", copyText);
});

// タグをオプションに追加
const tagList = TagClass.getTagList();
tagList.then((tags) => {
  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag.name;
    option.textContent = tag.name;
    tagSelect.appendChild(option);
  });
});

interface taskInterface {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  elapsed_time: string;
  tag?: string;
}

// タスクリストの描画
function init() {
  renderTaskList();
  setUpEventHandlers();
}

// イベントハンドラの設定
function setUpEventHandlers() {
  const addTask = document.getElementById("add_task") as HTMLButtonElement;
  addTask.addEventListener("click", handleAddTaskClick);

  const submitForm = document.querySelector("form");
  submitForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    // if taskName is not empty, add task
    const taskName = document.getElementById("task_name") as HTMLInputElement;
    const tag = document.getElementById("tag") as HTMLInputElement;
    if (taskName.value !== "") {
      handleAddTaskClick();
    }
  });
  const resetBtn = document.getElementById("reset") as HTMLButtonElement;
  resetBtn.addEventListener("click", handleResetClick);

  const copyBtn = document.getElementById("copy") as HTMLButtonElement;
  copyBtn.addEventListener("click", handleCopyClick);

  // タブルクリックでタスク編集
  const taskList = document.getElementById("task_lists");
  taskList?.addEventListener("dblclick", (e) => {
    const target = e.target as HTMLElement;
    const taskId = target.dataset.taskId;
    if (taskId) {
      editTask(Number(taskId));
    }
  });

  // タグの経過時間を計算
  calculationTag.addEventListener("click", async () => {
    const tasks = await TaskClass.getTaskListForFront();
    const tagMap = TaskClass.calculateTimeDifferenceByTag(tasks);

    const tagTimeTable = document.getElementById("tagTimeTable") as HTMLTableElement;
    // テーブルを表示する
    tagTimeTable.classList.remove("hidden");

    TaskClass.displayTimeDifferenceByTag(tagMap);
  });
}

// タスク追加ボタンのイベントハンドラ
function handleAddTaskClick() {
  const taskName = document.getElementById("task_name") as HTMLInputElement;
  const tag = document.getElementById("tag_select") as HTMLSelectElement;

  TaskClass.addTask(taskName.value, tag.value);
  taskName.value = "";
  tag.value = "";

  // 0.5秒後にタスクリストを再描画する
  setTimeout(() => {
    refreshTaskList();
  }, 500);
}

// リセットボタンのイベントハンドラ
function handleResetClick() {
  TaskClass.confirmDelete();
  refreshTaskList();
}

// タスクリストの再描画
function refreshTaskList() {
  setTimeout(() => {
    const taskList = document.getElementById("task_lists") as HTMLDivElement;
    taskList.innerHTML = "";
    renderTaskList();
  }, 500);
}

// タスクリストを描画する
async function renderTaskList() {
  const taskList = document.getElementById("task_lists");
  const tasks = await TaskClass.getTaskListForFront();

  tasks.forEach((task, index) => {
    const taskTr = createTaskRow(task, index, tasks);
    if (taskList) {
      taskList.appendChild(taskTr);
    } else {
      console.error("taskList is null");
    }
  });

  const newTask = await TaskClass.getTaskListForFront();
  TaskClass.calculateTimeDifferenceByTag(newTask);
}

// タスクの行を作成する
function createTaskRow(
  task: taskInterface,
  index: number,
  tasks: taskInterface[],
): HTMLTableRowElement {
  const taskTr = document.createElement("tr");
  taskTr.classList.add("task");

  const startTimeTd = createTableCell(task.start_time);
  const nameTd = createTableCell(task.name);
  const elapsed = TaskClass.calculateTimeDifferenceAtIndex(tasks, index);
  const elapsedTimeTd = createTableCell(elapsed);
  const tagTd = createTableCell(task.tag ?? "");

  const editTd = TaskClass.createButtonCell("編集", "", () => editTask(task.id));
  const deleteTd = TaskClass.createButtonCell("削除", "red", () => deleteTask(task.id));

  taskTr.append(startTimeTd, nameTd, elapsedTimeTd, tagTd, editTd, deleteTd);

  return taskTr;
}

/**
 * テーブルのセルを作成する
 * @param {string} text
 * @returns {HTMLTableCellElement}
 * @private
 */
function createTableCell(text: string) {
  const td = document.createElement("td");
  td.classList.add("border", "px-2", "py-2", "min-w-[90px]");
  td.textContent = text;
  return td;
}

// グローバルスコープでの変数定義
let currentTaskId: any = null;

// タスクの編集処理のハンドラー
async function editTaskHandler() {
  if (currentTaskId == null) {
    console.error("No task selected for editing");
    return;
  }
  await TaskClass.editTask(currentTaskId, taskName.value, editTagSelect.value, startTime.value);
  hideModal();
  // 0.5秒後にタスクリストを再描画する
  setTimeout(() => {
    refreshTaskList();
  }, 500);
}

// モーダルを非表示にする関数
function hideModal() {
  const modal = document.getElementById("modal") as HTMLDivElement;
  modal.classList.add("hidden");
}

// タスクの編集
function editTask(taskId: number) {
  currentTaskId = taskId;
  // 編集用のモーダルを表示する
  const modal = document.getElementById("modal") as HTMLDivElement;
  modal.classList.remove("hidden");

  // tagのoptionを追加
  const tagList = TagClass.getTagList();
  tagList.then((tags) => {
    editTagSelect.innerHTML = "";
    tags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag.name;
      option.textContent = tag.name;
      editTagSelect.appendChild(option);
    });
  });

  // タスクの情報を取得する
  TaskClass.getTaskById(currentTaskId).then((task) => {
    if (!task) {
      console.error("task is null");
      return;
    }
    taskName.value = task.name;
    editTagSelect.value = task.tag ?? "";
    startTime.value = task.start_time;
  });
}

// タスクの削除
function deleteTask(taskId: number) {
  // タスク削除処理
  TaskClass.deleteTask(taskId);
  // 0.5秒後にタスクリストを再描画する
  setTimeout(() => {
    refreshTaskList();
  }, 500);
}

editBtn.addEventListener("click", editTaskHandler);
cancelBtn.addEventListener("click", hideModal);
cancelModal.addEventListener("click", hideModal);

// コピー
async function handleCopyClick() {
  const tasks = await TaskClass.getTaskListForFront();
  const copyText = TaskClass.formatTaskListForReport(tasks);

  // クリップボードにコピーする
  navigator.clipboard.writeText(copyText);

  // メッセージを表示する
  const message = document.getElementById("message");
  if (message) {
    message.textContent = "クリップボードにコピーしました";
    message.classList.add("text-green-500");

    // 2秒後にメッセージを消す
    setTimeout(() => {
      message.textContent = "";
      message.classList.remove("text-green-500");
    }, 2000);
  }
}

init();
