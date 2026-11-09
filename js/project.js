import { OpenList, CloseList } from "./modal.js";

import {
  ProjectInfo,
  GetFromLocalProject,
  addProjectInPage,
  createProjectBtnFun,
  renderProjectsPage,
  fillTaskProjects,
  delprojectinlocalstorage,
  resetProjectEditing,
} from "./projectData.js";

import { GetFromLocal } from "./tasksData.js";

let taskProject;

fetch("./components/addproject.html")
  .then((res) => res.text())
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);

    const newProject = document.querySelectorAll(".new-project");
    const addProject = document.querySelector(".project-list");
    const btnOverlay = document.querySelector(".btn-overlay");
    const closeBtns = document.querySelectorAll(".closebtn");
    const cancelBtns = document.querySelectorAll(".cancel");

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

    const target = document.querySelector(".cards");
    console.log(target);

    taskProject = document.querySelector(".add-list .task-project");

    if (!target) return;

    //? Get Data
    GetFromLocal();
    GetFromLocalProject();

    if (taskProject) {
      fillTaskProjects(taskProject);
    }

    //? Fill Existing Project Fields
    function fillProjectFields(project) {
      if (!project) return;

      projectName.value = project.name || "";
      projectDes.value = project.describion || "";
      projectCategroy.value = project.Category || "";
      projectImprtance.value = project.Imprtance || "";
      projectDate.value = project.Date || "";

      //? Restore selected color
      projectColor.forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.color === (project.color || "purple"),
        );
      });

      //? Change button text while editing
      createProject.textContent = "Save Changes";

      //? Open the same modal
      OpenList(btnOverlay, addProject);
    }

    //? Render Projects
    addProjectInPage(
      target,
      0,
      renderProjectsPage,
      undefined,
      taskProject ? () => fillTaskProjects(taskProject) : undefined,
      fillProjectFields,
    );

    //? Project Search & Filter
    const searchInput = document.querySelector(".tolbar .search-box input");

    const filterButtons = document.querySelectorAll(
      ".tolbar button[data-filter]",
    );

    function filterProjects() {
      const searchValue = searchInput?.value.trim().toLowerCase() || "";

      const activeFilter =
        document.querySelector(".tolbar button[data-filter].active")?.dataset
          .filter || "All";

      target.querySelectorAll(":scope > div").forEach((cardWrapper) => {
        const projectName = cardWrapper.dataset.projectName || "";

        const projectStatus = cardWrapper.dataset.projectStatus || "";

        const matchesSearch = projectName.includes(searchValue);

        const matchesStatus =
          activeFilter === "All" || projectStatus === activeFilter;

        cardWrapper.hidden = !(matchesSearch && matchesStatus);
      });
    }

    searchInput?.addEventListener("input", filterProjects);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");
        filterProjects();
      });
    });

    //? Open Project Tasks
    target.addEventListener("click", (e) => {
      const button = e.target.closest(".open-project");

      if (!button) return;

      const projectId = button.dataset.projectId;

      window.location.href = `./tasks.html?projectId=${projectId}`;
    });

    //? Open Add Project
    newProject.forEach((addbtn) => {
      addbtn.addEventListener("click", () => {
        resetProjectEditing();
        //? Restore normal Add mode
        projectName.value = "";
        projectDes.value = "";
        projectDate.value = "";

        projectCategroy.selectedIndex = 0;
        projectImprtance.selectedIndex = 0;

        projectColor.forEach((button) => {
          button.classList.toggle("active", button.dataset.color === "purple");
        });

        createProject.textContent = "Create Project";

        OpenList(btnOverlay, addProject);
      });
    });

    //? Close By Overlay
    btnOverlay?.addEventListener("click", () => {
      resetProjectEditing();

      CloseList(btnOverlay, addProject);
    });

    //? Close Buttons
    closeBtns.forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        resetProjectEditing();

        CloseList(btnOverlay, addProject);
      });
    });

    //? Cancel Buttons
    cancelBtns.forEach((cancelBtn) => {
      cancelBtn.addEventListener("click", () => {
        resetProjectEditing();

        CloseList(btnOverlay, addProject);
      });
    });

    //? Select Project Color
    projectColor.forEach((button) => {
      button.addEventListener("click", () => {
        projectColor.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");
      });
    });

    //? Create or Update Project
    createProjectBtnFun(
      createProject,
      target,
      null,
      projectName,
      projectDes,
      projectCategroy,
      projectCategroy,
      projectImprtance,
      projectDate,
      btnOverlay,
      addProject,
      renderProjectsPage,
      projectColor,
      taskProject ? () => fillTaskProjects(taskProject) : undefined,
      fillProjectFields,
    );

    //? Items Action Menu
    target.addEventListener("click", (e) => {
      const summary = e.target.closest(".item-actions summary");

      if (!summary) return;

      const container = summary.parentElement.querySelector(":scope > div");

      if (container) {
        container.classList.toggle("open");
      }
    });
  });
