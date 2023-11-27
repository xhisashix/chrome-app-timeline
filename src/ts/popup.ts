import taskClass from "./taskClass";
import storageClass from "./storageClass";

const task = new taskClass();
const addTask = document.getElementById("add_task") as HTMLButtonElement;
const storage = new storageClass();
addTask.addEventListener("click", () => {
  const taskName = document.getElementById("task_name") as HTMLInputElement;
  const task = new taskClass();
  task.addTask(taskName.value);
  taskName.value = "";
});

const taskList = document.getElementById("task_lists") as HTMLDivElement;

async function renderTaskList() {
  const result = await task.getTaskListForFront();
  result.forEach((task) => {
    const taskTr = document.createElement("tr");
    taskTr.classList.add("task");
    taskTr.innerHTML = `
      <td class="border px-2 py-2 min-w-[90px]">${task.start_time}</td>
      <td class="border px-2 py-2 min-w-[90px]">${task.name}</td>
      <td class="border px-2 py-2 min-w-[90px]">${task.elapsed_time}</td>
      <td class="border px-2 py-2 min-w-[90px]">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          編集
        </button>
      </td>
      <td class="border px-2 py-2 min-w-[90px]">
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-auto"
          type="button"
        >
          削除
        </button>
      </td>
    `;
    taskList.appendChild(taskTr);
  });
}

renderTaskList();
