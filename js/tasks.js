import {
  TaskInfo,
  GetFromLocal,
  addTaskInPage,
  createBtnFun,
  checkTask,
  getCompletedTasks,
  getInProgressTasks,
} from "./tasksData.js";

import {
  ProjectInfo,
  GetFromLocalProject,
  fillTaskProjects,
  addProjectInPage,
  renderDashboardProject,
} from "./projectData.js";
import { OpenList, CloseList } from "./modal.js";

fetch("./components/addtask.html")
  .then((res) => res.text())
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);

    const addTask = document.querySelectorAll(".add-task"),
      btnOverlay = document.querySelector(".btn-overlay"),
      addList = document.querySelector(".add-list"),
      closeBtns = document.querySelectorAll(".closebtn"),
      cancelBtns = document.querySelectorAll(".cancel"),
      taskName = document.querySelector(".add-list .task-name"),
      taskdes = document.querySelector(".add-list .task-des"),
      taskProject = document.querySelector(".add-list .task-project"),
      taskImprtance = document.querySelector(".add-list .importance"),
      taskDate = document.querySelector(".add-list [type='date']"),
      createTask = document.querySelector(".add-list .create-task"),
      taskcount = document.querySelector(".total .count"),
      taskcomplited = document.querySelector(".completed .count"),
      taskInprogress = document.querySelector(".in-progress .count"),
      recenttasks = document.querySelector(".task-table .table-body"),
      filltertasks = document.querySelectorAll(".fillter-tasks button");

    //? الفلتر الحالي
    let currentFilter = "All";
    const params = new URLSearchParams(window.location.search);
    let currentProjectId = params.get("projectId");

    const projectBanner = document.querySelector("#projectFilterBanner");
    const currentProjectName = document.querySelector("#currentProjectName");
    const showAllTasksBtn = document.querySelector("#showAllTasks");

    function updateProjectBanner() {
      if (!projectBanner) return;

      const project = ProjectInfo.find(
        (project) => String(project.id) === String(currentProjectId),
      );

      if (currentProjectId && project) {
        projectBanner.hidden = false;
        currentProjectName.textContent = `Project: ${project.name}`;
      } else {
        projectBanner.hidden = true;
      }
    }

    function updateDueSoonCount() {
      const dueSoonCount = document.querySelector(
        ".task-summary .card:last-child .count",
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const count = TaskInfo.filter((task) => {
        if (task.completed || !task.Date) return false;

        const dueDate = new Date(`${task.Date}T00:00:00`);

        return dueDate >= today && dueDate < nextWeek;
      }).length;

      dueSoonCount.textContent = count;
    }

    //? Fill Task Fields For Editing
    function fillTaskFields(task) {
      taskName.value = task.name || "";
      taskdes.value = task.describion || "";
      taskDate.value = task.Date || "";
      taskImprtance.value = task.Imprtance || "";

      //? Load project options first.
      fillTaskProjects(taskProject);

      //? Then select the task's saved project.
      const savedProjectId =
        task.projectId == null ? "" : String(task.projectId);

      const matchingOption = [...taskProject.options].find(
        (option) => String(option.value) === savedProjectId,
      );

      taskProject.value = matchingOption ? matchingOption.value : "";

      OpenList(btnOverlay, addList);
    }

    showAllTasksBtn?.addEventListener("click", () => {
      currentProjectId = null;
      currentFilter = "All";

      filltertasks.forEach((button) => {
        button.classList.toggle("active", button.dataset.category === "All");
      });

      addTaskInPage(
        recenttasks,
        0,
        currentFilter,
        currentProjectId,
        () => fillTaskProjects(taskProject),
        fillTaskFields,
      );
      window.history.replaceState({}, "", window.location.pathname);

      updateProjectBanner();
    });

    //? Get Data
    GetFromLocal();
    GetFromLocalProject();
    fillTaskProjects(taskProject);
    updateProjectBanner();

    //? Initial Counts
    taskcount.textContent = TaskInfo.length;
    taskcomplited.textContent = getCompletedTasks().length;
    taskInprogress.textContent = getInProgressTasks().length;
    updateDueSoonCount();

    //? Initial Render
    addTaskInPage(
      recenttasks,
      0,
      currentFilter,
      currentProjectId,
      () => fillTaskProjects(taskProject),
      fillTaskFields,
    ); //? Open Add Task
    addTask.forEach((addbtn) => {
      addbtn.addEventListener("click", () => {
        OpenList(btnOverlay, addList);
      });
    });

    //? Close Overlay
    btnOverlay.addEventListener("click", () => {
      CloseList(btnOverlay, addList);
    });

    //? Close Buttons
    closeBtns.forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        CloseList(btnOverlay, addList);
      });
    });

    //? Cancel Buttons
    cancelBtns.forEach((cancelBtn) => {
      cancelBtn.addEventListener("click", () => {
        CloseList(btnOverlay, addList);
      });
    });

    //? Checkbox
    checkTask(recenttasks, taskcomplited, undefined, undefined, () => {
      const projectRows = document.querySelector(
        ".progress-panel .project-rows",
      );
      updateDueSoonCount();
      if (projectRows) {
        addProjectInPage(projectRows, 0, renderDashboardProject);
      }
    });

    //? Create Task
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
      () => currentFilter,
      () => {
        taskcount.textContent = TaskInfo.length;
        taskcomplited.textContent = getCompletedTasks().length;
        taskInprogress.textContent = getInProgressTasks().length;
        updateDueSoonCount();
      },
      () => fillTaskProjects(taskProject),
      fillTaskFields,
    );

    //? Filter
    filltertasks.forEach((button) => {
      button.addEventListener("click", () => {
        filltertasks.forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        //? Update Current Filter
        currentFilter = button.dataset.category;

        //? Re-render with current filter
        addTaskInPage(
          recenttasks,
          0,
          currentFilter,
          currentProjectId,
          () => fillTaskProjects(taskProject),
          fillTaskFields,
        );
      });
    });
    //? Items Action Menu
    recenttasks.addEventListener("click", (e) => {
      const summary = e.target.closest(".item-actions summary");

      if (!summary) return;

      const container = summary.parentElement.querySelector(":scope > div");

      if (container) {
        container.classList.toggle("open");
      }
    });
  });
