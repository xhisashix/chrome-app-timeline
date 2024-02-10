import taskClass from "./taskClass";

const TaskClass = new taskClass();

const editBtn = document.getElementById("edit_task") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancel") as HTMLButtonElement;
const cancelModal = document.getElementById("close_modal") as HTMLDivElement;
const taskName = document.getElementById("edit_task_name") as HTMLInputElement;
const startTime = document.getElementById(
  "edit_start_time"
) as HTMLInputElement;

interface taskInterface {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  elapsed_time: string;
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
}

// タスク追加ボタンのイベントハンドラ
function handleAddTaskClick() {
  const taskName = document.getElementById("task_name") as HTMLInputElement;
  TaskClass.addTask(taskName.value);
  taskName.value = "";

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
}

// タスクの行を作成する
function createTaskRow(
  task: taskInterface,
  index: number,
  tasks: taskInterface[]
): HTMLTableRowElement {
  const taskTr = document.createElement("tr");
  taskTr.classList.add("task");

  const startTimeTd = createTableCell(task.start_time);
  const nameTd = createTableCell(task.name);
  const elapsedTimeTd = createTableCell(
    TaskClass.calculateTimeDifferenceAtIndex(tasks, index)
  );

  const editTd = TaskClass.createButtonCell("編集", "", () =>
    editTask(task.id)
  );
  const deleteTd = TaskClass.createButtonCell("削除", "red", () =>
    deleteTask(task.id)
  );

  taskTr.append(startTimeTd, nameTd, elapsedTimeTd, editTd, deleteTd);

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
  await TaskClass.editTask(currentTaskId, taskName.value, startTime.value);
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
  console.log("currentTaskId", currentTaskId);
  // 編集用のモーダルを表示する
  const modal = document.getElementById("modal") as HTMLDivElement;
  modal.classList.remove("hidden");

  // タスクの情報を取得する
  TaskClass.getTaskById(currentTaskId).then((task) => {
    if (!task) {
      console.error("task is null");
      return;
    }
    taskName.value = task.name;
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
