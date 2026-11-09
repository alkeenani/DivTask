import {
  TaskInfo,
  GetFromLocal,
  addTaskInPage,
  createBtnFun,
  checkTask,
  getCompletedTasks,
} from "./tasksData.js";

import { OpenList, CloseList } from "./modal.js";

import {
  ProjectInfo,
  GetFromLocalProject,
  addProjectInPage,
  createProjectBtnFun,
  renderDashboardProject,
  fillTaskProjects,
} from "./projectData.js";

//? Dashboard Progress

function updateOverallProgress() {
  const total = TaskInfo.length;
  const completed = getCompletedTasks().length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const progressValue = document.querySelector(".stat-value b");
  const progressRing = document.querySelector(".mini-ring");
  const ringText = document.querySelector(".mini-ring span");

  if (progressValue) {
    progressValue.textContent = `${percentage}%`;
  }

  if (ringText) {
    ringText.textContent = percentage;
  }

  if (progressRing) {
    progressRing.style.background = `conic-gradient(var(--primary) ${percentage}%, var(--border) 0)`;
  }
}

//? Upcoming Deadlines

function renderUpcomingDeadlines() {
  const container = document.querySelector(".deadline-rows");
  const emptyState = document.querySelector(".upcoming-deadlines .empty-state");

  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = TaskInfo.filter((task) => !task.completed && task.Date)
    .sort((a, b) => new Date(a.Date) - new Date(b.Date))
    .slice(0, 4);

  container.innerHTML = "";

  if (emptyState) {
    emptyState.hidden = upcoming.length > 0;
  }

  upcoming.forEach((task) => {
    const dueDate = new Date(`${task.Date}T00:00:00`);

    const daysLeft = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

    let label;
    let color;

    if (daysLeft < 0) {
      label = "Overdue";
      color = "red";
    } else if (daysLeft === 0) {
      label = "Today";
      color = "red";
    } else if (daysLeft === 1) {
      label = "Tomorrow";
      color = "orange";
    } else {
      label = `${daysLeft} days`;
      color = daysLeft <= 3 ? "orange" : "green";
    }

    const project = ProjectInfo.find(
      (item) => String(item.id) === String(task.projectId),
    );

    const row = document.createElement("div");
    row.className = "deadline-list";

    const dateBox = document.createElement("div");
    dateBox.className = `icon-date ${color}`;

    const day = document.createElement("b");
    day.textContent = dueDate.getDate();

    const month = document.createElement("small");
    month.textContent = dueDate
      .toLocaleDateString("en", { month: "short" })
      .toUpperCase();

    dateBox.append(day, month);

    const info = document.createElement("div");
    info.className = "info";

    const taskName = document.createElement("p");
    taskName.textContent = task.name;

    const projectName = document.createElement("small");
    projectName.textContent = project ? project.name : "Other";

    info.append(taskName, projectName);

    const dayLabel = document.createElement("div");
    dayLabel.className = `day ${color}`;
    dayLabel.textContent = label;

    row.append(dateBox, info, dayLabel);
    container.appendChild(row);
  });
}

//? Shared Dashboard Updates

function refreshDashboardProjects() {
  const projectRows = document.querySelector(".progress-panel .project-rows");

  if (projectRows) {
    addProjectInPage(projectRows, -4, renderDashboardProject);
  }
}

function refreshDashboard() {
  updateOverallProgress();
  renderUpcomingDeadlines();
  refreshDashboardProjects();

  const taskCount = document.querySelector(".tasks-card .count");
  const completedCount = document.querySelector(".tasks-complited .count");

  if (taskCount) {
    taskCount.textContent = TaskInfo.length;
  }

  if (completedCount) {
    completedCount.textContent = getCompletedTasks().length;
  }
}

//? Add Task Modal

let taskProject = null;

fetch("./components/addtask.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to load addtask.html");
    }

    return res.text();
  })
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);

    const addTask = document.querySelectorAll(".add-task");
    const btnOverlay = document.querySelector(".btn-overlay");
    const addList = document.querySelector(".add-list");

    const closeBtns = addList ? addList.querySelectorAll(".closebtn") : [];

    const cancelBtns = addList ? addList.querySelectorAll(".cancel") : [];

    const taskName = document.querySelector(".add-list .task-name");

    const taskdes = document.querySelector(".add-list .task-des");

    const taskImprtance = document.querySelector(".add-list .importance");

    const taskDate = document.querySelector(".add-list [type='date']");

    const createTask = document.querySelector(".add-list .create-task");

    const taskcount = document.querySelector(".tasks-card .count");

    const taskcomplited = document.querySelector(".tasks-complited .count");

    const recenttasks = document.querySelector(".recent-tasks .table-body");

    taskProject = document.querySelector(".add-list .task-project");

    //? Load saved data.
    GetFromLocal();
    GetFromLocalProject();

    if (taskProject) {
      fillTaskProjects(taskProject);
    }

    refreshDashboard();

    if (taskcount) {
      taskcount.textContent = TaskInfo.length;
    }

    if (taskcomplited) {
      taskcomplited.textContent = getCompletedTasks().length;
    }

    function FillFeild(task) {
      if (!task) return;

      GetFromLocalProject();

      if (taskProject) {
        fillTaskProjects(taskProject);
      }

      taskName.value = task.name || "";
      taskdes.value = task.describion || "";
      taskDate.value = task.Date || "";
      taskImprtance.value = task.Imprtance || "";

      if (taskProject) {
        const projectId =
          task.projectId == null ? "other" : String(task.projectId);

        const projectExists = Array.from(taskProject.options).some(
          (option) => option.value === projectId,
        );

        taskProject.value = projectExists ? projectId : "other";
      }

      createTask.textContent = "Save Changes";

      OpenList(btnOverlay, addList);
    }

    //? Render Recent Tasks

    if (recenttasks) {
      addTaskInPage(recenttasks, -5, "All", null, undefined, FillFeild);
    }

    //? Reset Modal For New Task

    function resetTaskForm() {
      if (taskName) taskName.value = "";
      if (taskdes) taskdes.value = "";
      if (taskDate) taskDate.value = "";

      if (taskProject) {
        taskProject.selectedIndex = 0;
      }

      if (taskImprtance) {
        taskImprtance.selectedIndex = 0;
      }

      if (createTask) {
        createTask.textContent = "Create Task";
      }
    }

    //? Open Add Task Modal

    addTask.forEach((button) => {
      button.addEventListener("click", () => {
        resetTaskForm();

        if (btnOverlay && addList) {
          OpenList(btnOverlay, addList);
        }
      });
    });

    //? Close Task Modal

    if (btnOverlay && addList) {
      btnOverlay.addEventListener("click", () => {
        CloseList(btnOverlay, addList);
      });
    }

    closeBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOverlay && addList) {
          CloseList(btnOverlay, addList);
        }
      });
    });

    cancelBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOverlay && addList) {
          CloseList(btnOverlay, addList);
        }
      });
    });

    //? Task Checkbox

    if (recenttasks) {
      checkTask(recenttasks, taskcomplited, undefined, undefined, () => {
        refreshDashboard();
      });
    }

    //? Create Or Update Task

    if (
      createTask &&
      taskName &&
      taskdes &&
      taskProject &&
      taskImprtance &&
      taskDate
    ) {
      createBtnFun(
        createTask,
        recenttasks,
        taskcount,
        taskName,
        taskdes,
        taskProject,
        taskImprtance,
        taskDate,
        btnOverlay,
        addList,
        undefined,
        () => {
          refreshDashboard();
        },
        () => {
          if (taskProject) {
            GetFromLocalProject();
            fillTaskProjects(taskProject);
          }
        },
        FillFeild,
      );
    }

    //? Task Menu

    if (recenttasks) {
      recenttasks.addEventListener("click", (event) => {
        const summary = event.target.closest(".item-actions summary");

        if (!summary) return;

        const container = summary.parentElement.querySelector(":scope > div");

        if (container) {
          container.classList.toggle("open");
        }
      });
    }

    //? Keep dashboard values in sync when tasks change.
    window.addEventListener("tasksUpdated", () => {
      refreshDashboard();

      if (recenttasks) {
        addTaskInPage(recenttasks, -5, "All", null, undefined, FillFeild);
      }
    });
  })
  .catch((error) => {
    console.error("Error initializing dashboard tasks:", error);
  });

//? Add Project Modal

fetch("./components/addproject.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to load addproject.html");
    }

    return res.text();
  })
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);

    const newProject = document.querySelectorAll(".new-project");
    const addProject = document.querySelector(".project-list");
    const btnOverlay = document.querySelector(".btn-overlay");

    const closeBtns = addProject
      ? addProject.querySelectorAll(".closebtn")
      : [];

    const cancelBtns = addProject ? addProject.querySelectorAll(".cancel") : [];

    const projectName = document.querySelector(".project-list .project-name");

    const projectDes = document.querySelector(".project-list .project-des");

    const projectCategroy = document.querySelector(
      ".project-list .project-category",
    );

    const projectImprtance = document.querySelector(
      ".project-list .importance",
    );

    const projectDate = document.querySelector(".project-list [type='date']");

    const projectColor = document.querySelectorAll(
      ".project-list .color-row button",
    );

    const createProject = document.querySelector(
      ".project-list .create-project",
    );

    const target = document.querySelector(".progress-panel .project-rows");

    const countProject = document.querySelector(".project-card .count");

    GetFromLocalProject();

    if (taskProject) {
      fillTaskProjects(taskProject);
    }

    if (countProject) {
      countProject.textContent = ProjectInfo.length;
    }

    if (target) {
      addProjectInPage(target, -4, renderDashboardProject);
    }

    //? Open Project Modal
    newProject.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOverlay && addProject) {
          OpenList(btnOverlay, addProject);
        }
      });
    });

    //? Close Project Modal
    if (btnOverlay && addProject) {
      btnOverlay.addEventListener("click", () => {
        CloseList(btnOverlay, addProject);
      });
    }

    closeBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOverlay && addProject) {
          CloseList(btnOverlay, addProject);
        }
      });
    });

    cancelBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOverlay && addProject) {
          CloseList(btnOverlay, addProject);
        }
      });
    });

    //? Project Color Selection
    projectColor.forEach((button) => {
      button.addEventListener("click", () => {
        projectColor.forEach((colorButton) => {
          colorButton.classList.remove("active");
        });

        button.classList.add("active");
      });
    });

    //? Create Project
    if (
      createProject &&
      projectName &&
      projectDes &&
      projectCategroy &&
      projectImprtance &&
      projectDate
    ) {
      createProjectBtnFun(
        createProject,
        target,
        countProject,
        projectName,
        projectDes,
        projectCategroy,
        projectCategroy,
        projectImprtance,
        projectDate,
        btnOverlay,
        addProject,
        renderDashboardProject,
        projectColor,
        () => {
          if (taskProject) {
            GetFromLocalProject();
            fillTaskProjects(taskProject);
          }
        },
      );
    }
  })
  .catch((error) => {
    console.error("Error initializing dashboard projects:", error);
  });
