import taskClass from "./taskClass";
import storageClass from "./storageClass";

const TaskClass = new taskClass();
const addTask = document.getElementById("add_task") as HTMLButtonElement;
const storage = new storageClass();
addTask.addEventListener("click", () => {
  const taskName = document.getElementById("task_name") as HTMLInputElement;
  TaskClass.addTask(taskName.value);
  taskName.value = "";

  // タスクを追加したらリストを再描画する
  setTimeout(() => {
    const taskList = document.getElementById("task_lists") as HTMLDivElement;
    taskList.innerHTML = "";
    renderTaskList();
  }, 500);
});

const resetBtn = document.getElementById("reset") as HTMLButtonElement;
resetBtn.addEventListener("click", () => {
  TaskClass.confirmDelete();

  // タスクを削除したらリストを再描画する
  setTimeout(() => {
    const taskList = document.getElementById("task_lists") as HTMLDivElement;
    taskList.innerHTML = "";
    renderTaskList();
  }, 500);
});


/**
 * タスクリストを描画する
 * @returns {void}
 * @private
 */
async function renderTaskList() {
  const taskList = document.getElementById("task_lists");
  const result = await TaskClass.getTaskListForFront();

  result.forEach((task) => {
    const taskTr = document.createElement("tr");
    taskTr.classList.add("task");

    // 各セルの作成
    const startTimeTd = createTableCell(task.start_time);
    const nameTd = createTableCell(task.name);
    const elapsedTimeTd = createTableCell(task.elapsed_time);

    // 編集ボタンのセル
    const editButton = createButton("編集", [
      "bg-blue-500",
      "hover:bg-blue-700",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded",
    ]);
    // 編集イベントをここで追加
    // editButton.addEventListener("click", () => editTask(task.id)); // editTask はタスクの編集を行う関数
    const editTd = document.createElement("td");
    editTd.classList.add("border", "px-2", "py-2", "min-w-[90px]");
    editTd.appendChild(editButton);

    // 削除ボタンのセル
    const deleteButton = createButton("削除", [
      "bg-red-500",
      "hover:bg-red-700",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded",
      "mx-auto",
    ]);
    deleteButton.addEventListener("click", async () => {
      await TaskClass.deleteTask(task.id);

      // タスクを削除したらリストを再描画する
      setTimeout(() => {
        const taskList = document.getElementById(
          "task_lists"
        ) as HTMLDivElement;
        taskList.innerHTML = "";
        renderTaskList();
      }, 500);
    });
    const deleteTd = document.createElement("td");
    deleteTd.classList.add("border", "px-2", "py-2", "min-w-[90px]");
    deleteTd.appendChild(deleteButton);

    // セルを行に追加
    taskTr.appendChild(startTimeTd);
    taskTr.appendChild(nameTd);
    taskTr.appendChild(elapsedTimeTd);
    taskTr.appendChild(editTd);
    taskTr.appendChild(deleteTd);

    // 行をリストに追加
    if (taskList) {
      taskList.appendChild(taskTr);
    } else {
      console.log("taskList is null");
    }
  });
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

// 画面ロード時にタスクリストを描画する
renderTaskList();