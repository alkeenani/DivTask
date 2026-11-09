import { CloseList, confirmDelete } from "./modal.js";
import { ProjectInfo } from "./projectData.js";

let TaskInfo = [];

let isEditingTask = false;
let editingTaskId = null;

// Add Task
function AddInfoTask({ name, describion, date, importance, projectId }) {
  const Info = {
    id: Date.now(),
    name: name.trim(),
    describion: describion || "",
    Date: date,
    Imprtance: importance,
    projectId: projectId ?? null,
    completed: false,
  };

  TaskInfo.push(Info);

  AddTolocal();
  window.dispatchEvent(new Event("tasksUpdated"));
}

// Save To Local Storage
function AddTolocal() {
  localStorage.setItem("Tasks", JSON.stringify(TaskInfo));
}

// Get From Local Storage
function GetFromLocal() {
  const savedTasks = localStorage.getItem("Tasks");

  if (savedTasks) {
    try {
      TaskInfo = JSON.parse(savedTasks) || [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      TaskInfo = [];
    }
  }
}

// Find task for editing
function EditTaskInLocalStorage(id) {
  return TaskInfo.find((task) => String(task.id) === String(id));
}

// Update existing task
function UpdateTask(id, updatedData) {
  const taskIndex = TaskInfo.findIndex(
    (task) => String(task.id) === String(id),
  );

  if (taskIndex === -1) return false;

  Object.assign(TaskInfo[taskIndex], updatedData);

  AddTolocal();
  window.dispatchEvent(new Event("tasksUpdated"));

  return true;
}

// Delete task
async function DeleteTask(id, itemName = "") {
  //? Confirm with a message naming the exact task being removed
  const confirmed = await confirmDelete({
    title: "Delete this task?",
    itemName,
  });

  if (!confirmed) return false;

  const originalLength = TaskInfo.length;

  TaskInfo = TaskInfo.filter((task) => String(task.id) !== String(id));

  if (TaskInfo.length === originalLength) return false;

  AddTolocal();
  window.dispatchEvent(new Event("tasksUpdated"));

  return true;
}

// Reset task editing mode
function resetTaskEditing() {
  isEditingTask = false;
  editingTaskId = null;
}

// Add or Update Task

function createBtnFun(
  btnevent,
  targetres,
  taskcount,
  taskName,
  taskdes,
  taskProject,
  taskImprtance,
  taskDate,
  btnOverlay,
  addList,
  getCurrentFilter,
  updateCounts,
  refreshTaskProjects,
  FillFeild,
) {
  if (!btnevent) return;

  btnevent.addEventListener("click", () => {
    const name = taskName.value.trim();

    if (
      !name ||
      !taskDate.value ||
      !taskImprtance.value ||
      taskImprtance.selectedIndex === 0
    ) {
      return;
    }

    const userDate = new Date(`${taskDate.value}T00:00:00`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (Number.isNaN(userDate.getTime()) || userDate < currentDate) {
      return;
    }

    const oldTask =
      isEditingTask && editingTaskId !== null
        ? EditTaskInLocalStorage(editingTaskId)
        : null;

    if (isEditingTask && !oldTask) {
      resetTaskEditing();
      return;
    }

    let selectedProjectId;

    if (taskProject.value === "other") {
      selectedProjectId = null;
    } else if (taskProject.value !== "") {
      selectedProjectId = taskProject.value;
    } else {
      selectedProjectId = oldTask?.projectId ?? null;
    }

    const updatedData = {
      name,
      describion: taskdes.value.trim(),
      Date: taskDate.value,
      Imprtance: taskImprtance.value,
      projectId: selectedProjectId,
    };

    if (oldTask) {
      if (!UpdateTask(oldTask.id, updatedData)) return;
    } else {
      AddInfoTask({
        name: updatedData.name,
        describion: updatedData.describion,
        date: updatedData.Date,
        importance: updatedData.Imprtance,
        projectId: updatedData.projectId,
      });
    }

    resetTaskEditing();

    taskName.value = "";
    taskdes.value = "";
    taskDate.value = "";
    taskProject.selectedIndex = 0;
    taskImprtance.selectedIndex = 0;

    if (taskcount) {
      taskcount.textContent = TaskInfo.length;
    }

    const currentProjectId = new URLSearchParams(window.location.search).get(
      "projectId",
    );

    addTaskInPage(
      targetres,
      0,
      getCurrentFilter ? getCurrentFilter() : "All",
      currentProjectId,
      refreshTaskProjects,
      FillFeild,
      updateCounts,
    );

    if (updateCounts) updateCounts();
    if (refreshTaskProjects) refreshTaskProjects();

    CloseList(btnOverlay, addList);
  });
}

// Render Tasks
function addTaskInPage(
  target,
  start = 0,
  currentFilter = "All",
  projectId = null,
  refreshTaskProjects,
  FillFeild,
  updateCounts,
) {
  if (!target) return;

  target.innerHTML = "";

  const filteredTasks = TaskInfo.filter((task) => {
    const projectMatches =
      projectId == null || String(task.projectId) === String(projectId);

    const userDate = new Date(`${task.Date}T00:00:00`);
    const currentDate = new Date();

    userDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    let status;

    if (task.completed) {
      status = "Completed";
    } else if (userDate < currentDate) {
      status = "Overdue";
    } else if (userDate.getTime() === currentDate.getTime()) {
      status = "Progress";
    } else {
      status = "Todo";
    }

    const statusMatches =
      currentFilter === "All" || currentFilter === `In-${status}`;

    return projectMatches && statusMatches;
  });

  if (filteredTasks.length === 0) {
    target.innerHTML = `
      <p class="empty-state">No tasks found.</p>
    `;
    return;
  }

  filteredTasks.slice(start).forEach((task) => {
    const userDate = new Date(`${task.Date}T00:00:00`);
    const currentDate = new Date();

    userDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const dateText =
      userDate.getTime() === currentDate.getTime() ? "Today" : task.Date;

    // Compare IDs as strings to handle number/string differences.
    const project = ProjectInfo.find(
      (item) => String(item.id) === String(task.projectId),
    );

    const projectName = project ? project.name : "Other";

    let status;

    if (task.completed) {
      status = "Completed";
    } else if (userDate < currentDate) {
      status = "Overdue";
    } else if (userDate.getTime() === currentDate.getTime()) {
      status = "Progress";
    } else {
      status = "Todo";
    }

    const div_row = document.createElement("div");

    div_row.classList.add("All");
    div_row.classList.add(`In-${status}`);

    div_row.innerHTML = `
      <b>
        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          id="${task.id}"
        />
        <span></span>
      </b>

      <span class="task-project-name"></span>

      <span class="badge"></span>

      <span class="badge state-in-${status}">
        ${status === "Progress" ? "In Progress" : status}
      </span>

      <span class="due-day current">
        <i class="fa-solid fa-clock"></i>
        ${dateText}
      </span>

      <div class="item-actions">
        <summary>
          <i class="fa-solid fa-ellipsis"></i>
        </summary>

        <div>
          <button type="button" class="edit-btn">
            <i class="fa-regular fa-pen-to-square"></i>
            Edit
          </button>

          <button type="button" class="delete-project">
            <i class="fa-regular fa-trash-can"></i>
            Delete
          </button>
        </div>
      </div>
    `;

    // Use textContent for user-entered text.
    div_row.querySelector("b span").textContent = task.name;
    div_row.querySelector(".task-project-name").textContent = projectName;

    const importanceBadge = div_row.querySelector(
      "span.badge:not(.state-in-Progress):not(.state-in-Todo):not(.state-in-Completed):not(.state-in-Overdue)",
    );

    importanceBadge.textContent = task.Imprtance;
    importanceBadge.classList.add(task.Imprtance);

    target.appendChild(div_row);

    // Edit Task
    const editButton = div_row.querySelector(".edit-btn");

    if (editButton) {
      editButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const selectedTask = EditTaskInLocalStorage(task.id);

        if (!selectedTask) {
          console.error("Task not found:", task.id);
          return;
        }

        isEditingTask = true;
        editingTaskId = selectedTask.id;

        if (typeof FillFeild === "function") {
          FillFeild(selectedTask);
        } else {
          console.error("FillFeild function is not available");
        }
      });
    }

    // Delete Task
    const deleteButton = div_row.querySelector(".delete-project");

    if (deleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const deleted = await DeleteTask(task.id, task.name);

        if (!deleted) return;

        //? Re-render the list so the removed row disappears immediately
        addTaskInPage(
          target,
          start,
          currentFilter,
          projectId,
          refreshTaskProjects,
          FillFeild,
          updateCounts,
        );

        if (updateCounts) updateCounts();
      });
    }
  });
}

// Checkbox
function checkTask(
  target,
  count_complited,
  count_InProgress,
  getCurrentFilter,
  updateProjects,
) {
  target.addEventListener("change", (event) => {
    if (!event.target.matches("input[type='checkbox']")) return;

    const task = EditTaskInLocalStorage(event.target.id);

    if (!task) return;

    task.completed = event.target.checked;

    AddTolocal();

    const currentProjectId = new URLSearchParams(window.location.search).get(
      "projectId",
    );

    addTaskInPage(
      target,
      0,
      getCurrentFilter ? getCurrentFilter() : "All",
      currentProjectId,
    );

    if (count_complited) {
      count_complited.textContent = getCompletedTasks().length;
    }

    if (count_InProgress) {
      count_InProgress.textContent = getInProgressTasks().length;
    }

    if (updateProjects) updateProjects();

    window.dispatchEvent(new Event("tasksUpdated"));
  });
}

// Completed Tasks
function getCompletedTasks() {
  return TaskInfo.filter((task) => task.completed);
}

// In Progress Tasks
function getInProgressTasks() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return TaskInfo.filter((task) => {
    const taskDate = new Date(`${task.Date}T00:00:00`);
    taskDate.setHours(0, 0, 0, 0);

    return !task.completed && taskDate.getTime() === currentDate.getTime();
  });
}

export {
  TaskInfo,
  GetFromLocal,
  AddTolocal,
  AddInfoTask,
  addTaskInPage,
  createBtnFun,
  checkTask,
  getInProgressTasks,
  getCompletedTasks,
  EditTaskInLocalStorage,
  UpdateTask,
  DeleteTask,
  resetTaskEditing,
};
