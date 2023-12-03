import taskClass from "./taskClass";
import storageClass from "./storageClass";

const TaskClass = new taskClass();
const storage = new storageClass();

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
  // エンターキーでタスク追加
  const taskName = document.getElementById("task_name") as HTMLInputElement;
  taskName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleAddTaskClick();
    }
  });

  const resetBtn = document.getElementById("reset") as HTMLButtonElement;
  resetBtn.addEventListener("click", handleResetClick);
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

  const editTd = createButtonCell("編集", () => editTask(task.id));
  const deleteTd = createButtonCell("削除", () => deleteTask(task.id));

  taskTr.append(startTimeTd, nameTd, elapsedTimeTd, editTd, deleteTd);

  return taskTr;
}

// ボタンを含むセルを作成する
function createButtonCell(
  buttonText: string,
  clickHandler: () => void
): HTMLTableCellElement {
  const button = createButton(buttonText, [
    "bg-blue-500",
    "hover:bg-blue-700",
    "text-white",
    "font-bold",
    "py-2",
    "px-4",
    "rounded",
  ]);
  button.addEventListener("click", clickHandler);

  const td = document.createElement("td");
  td.classList.add("border", "px-2", "py-2", "min-w-[50px]");
  td.appendChild(button);

  return td;
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

/**
 * ボタンを作成する
 * @param {string} text
 * @param {string[]} classes
 * @returns {HTMLButtonElement}
 * @private
 */
function createButton(text: string, classes: string[]) {
  const button = document.createElement("button");
  button.textContent = text;
  button.type = "button";
  classes.forEach((c) => button.classList.add(c));
  return button;
}

// タスクの編集
function editTask(taskId: number) {
  // input要素を作成し、タスク名を取得する
  const taskName = document.getElementById("task_name") as HTMLInputElement;
  const newTaskName = window.prompt("タスク名を入力してください", taskName.value);
  if (newTaskName) {
    // タスク編集処理
    TaskClass.editTask(taskId, newTaskName);

    // 0.5秒後にタスクリストを再描画する
    setTimeout(() => {
      refreshTaskList();
    }, 500);
  }
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

init();
