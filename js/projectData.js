import { CloseList, confirmDelete, OpenList } from "./modal.js";
import { TaskInfo } from "./tasksData.js";

let ProjectInfo = [];
let isEditingProject = false;
let editingProjectId = null;
//? Add Project
function AddInfoProject(
  projectName,
  projectDes,
  projecttype,
  projectDate,
  imprtance,
  category,
  color = "purple",
) {
  const Info = {
    id: new Date().getTime(),
    name: projectName,
    describion: projectDes || "",
    type: projecttype,
    Date: projectDate,
    Imprtance: imprtance,
    Category: category,
    color: color,
  };

  ProjectInfo.push(Info);
  AddProjectTolocal();
}

//? Save To Local Storage
function AddProjectTolocal() {
  localStorage.setItem("Projects", JSON.stringify(ProjectInfo));
}

//? Get From Local Storage
function GetFromLocalProject() {
  const savedproject = localStorage.getItem("Projects");

  if (savedproject) {
    ProjectInfo = JSON.parse(savedproject);
  }
}

//? Get Tasks Of Project
function getProjectTasks(projectId) {
  return TaskInfo.filter(
    (task) => String(task.projectId) === String(projectId),
  );
}

//? Get Project Progress
function getProjectProgress(projectId) {
  const projectTasks = getProjectTasks(projectId);

  const total = projectTasks.length;

  const completed = projectTasks.filter((task) => task.completed).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    percentage,
  };
}
//? Get Project Status
function getProjectStatus(projectId) {
  const progress = getProjectProgress(projectId);

  if (progress.total === 0) {
    return "Todo";
  }

  if (progress.completed === progress.total) {
    return "Completed";
  }

  return "Progress";
}

//? fill Project List Function

function fillTaskProjects(taskProject) {
  if (!taskProject) return;

  const selectedValue = taskProject.value;

  taskProject.innerHTML = `
    <option value="" disabled>Select project</option>
    <option value="other">Other</option>
  `;

  ProjectInfo.forEach((project) => {
    const option = document.createElement("option");
    option.value = String(project.id);
    option.textContent = project.name;
    taskProject.appendChild(option);
  });

  const exists = Array.from(taskProject.options).some(
    (option) => option.value === selectedValue,
  );

  taskProject.value = exists ? selectedValue : "";
}

function renderDashboardProject(project, dateText) {
  const progress = getProjectProgress(project.id);

  return `
    <div class="project-row">
      <div class="stat-icon ${project.color}">
        <i class="fa-regular fa-folder"></i>
      </div>

      <div class="project-info">
        <div>
          <b>${project.name}</b>
          <small>${progress.completed} of ${progress.total} tasks</small>
        </div>

        <div class="progress">
          <span
  class="progress-fill ${project.color}"
  data-progress="${progress.percentage}%"
  style="width: 0%"
></span>
        </div>
      </div>

      <div class="present">${progress.percentage}%</div>
    </div>
  `;
}

function renderProjectsPage(project, dateText) {
  const progress = getProjectProgress(project.id);
  const status = getProjectStatus(project.id);

  return `
<div class="project-card">
          <div class="icons">
            <div class="stat-icon ${project.color}">
              <i class="fa-regular fa-folder"></i>
            </div>

            <div class="item-actions">
            <summary>
              <i class="fa-solid fa-ellipsis"></i>
            </summary>
              <div>
                <button class="edit-btn">
              <i class="fa-regular fa-pen-to-square "></i>Edit
            </button>
              <button class="delete-project">
  <i class="fa-regular fa-trash-can"></i>
  Delete
</button>
              
              </div>
            </div>
          </div>
          <div class="project-meta">
            <div class="badge type">${project.type}</div>
            <div class="badge state-in-${status}">${status}</div>
          </div>
          <h3>${project.name}</h3>
          <p>${project.describion}</p>
          <div class="progress-label">
            <div class="info">
              <div>
                <p>progress</p>
                <p>${progress.percentage}%</p>
              </div>
<span
  class="progress-fill ${project.color}"
  data-progress="${progress.percentage}%"
  style="width: 0%"
></span>            </div>
            <div class="project-card-foot">
              <span> <i class="fa-solid fa-check"></i>${progress.completed} of ${progress.total}tasks</span>
              <span><i class="fa-regular fa-calendar-days"></i>${dateText} </span>
            </div>
            

<button class="open-project" data-project-id="${project.id}">
  Open Project <i class="fa-solid fa-arrow-right"></i>
</button>
          </div>
        </div>
  `;
}
//? Create Project Button

function createProjectBtnFun(
  btnevent,
  targetres,
  projectcount,
  projectName,
  projectDes,
  projecttype,
  projectCategroy,
  projectImprtance,
  projectDate,
  btnOverlay,
  addList,
  renderProject = renderDashboardProject,
  projectColor,
  refreshTaskProjects,
  FillFeild,
) {
  btnevent.addEventListener("click", () => {
    //?  Validate inputs
    if (
      projectName.value.trim() === "" ||
      projectDate.value === "" ||
      projectImprtance.value === "" ||
      projectImprtance.selectedIndex === 0
    ) {
      return;
    }

    //?  Validate date
    const userDate = new Date(projectDate.value);
    const currentDate = new Date();

    userDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (userDate < currentDate) {
      return;
    }

    //?  Get selected color
    const activeColor = document.querySelector(
      ".project-list .color-row button.active",
    );

    const color = activeColor?.dataset.color || "purple";

    //?  Prepare project data
    const updatedData = {
      name: projectName.value.trim(),
      describion: projectDes.value,
      type: projecttype.value,
      Date: projectDate.value,
      Imprtance: projectImprtance.value,
      Category: projectCategroy.value,
      color,
    };

    //?  Update existing project or create a new one
    if (isEditingProject && editingProjectId !== null) {
      UpdateProject(editingProjectId, updatedData);
    } else {
      AddInfoProject(
        updatedData.name,
        updatedData.describion,
        updatedData.type,
        updatedData.Date,
        updatedData.Imprtance,
        updatedData.Category,
        updatedData.color,
      );
    }

    //?  Reset editing mode after saving
    resetProjectEditing();

    //?  Reset inputs
    projectName.value = "";
    projectDes.value = "";
    projectDate.value = "";
    projecttype.selectedIndex = 0;
    projectImprtance.selectedIndex = 0;

    if (projectCategroy !== projecttype) {
      projectCategroy.selectedIndex = 0;
    }

    //?  Reset color
    projectColor?.forEach((button) => {
      button.classList.toggle("active", button.dataset.color === "purple");
    });

    //?  Update project count
    if (projectcount) {
      projectcount.textContent = ProjectInfo.length;
    }

    //?  Re-render cards and preserve edit callback
    addProjectInPage(
      targetres,
      0,
      renderProject,
      undefined,
      refreshTaskProjects,
      FillFeild,
    );

    if (refreshTaskProjects) {
      refreshTaskProjects();
    }

    //?  Close modal
    CloseList(btnOverlay, addList);
  });
}

//? Render Projects
function addProjectInPage(
  target,
  start = 0,
  renderProject = renderDashboardProject,
  updateCounts,
  refreshTaskProjects,
  FillFeild,
) {
  if (!target) return;

  target.innerHTML = "";

  if (ProjectInfo.length === 0) {
    target.innerHTML = `
      <p class="empty-state">
        Create your first project to get started.
      </p>
    `;
    return;
  }

  ProjectInfo.slice(start).forEach((project) => {
    const userDate = new Date(project.Date);
    const currentDate = new Date();

    userDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const dateText =
      userDate.getTime() === currentDate.getTime()
        ? "Today"
        : userDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

    const div_row = document.createElement("div");

    div_row.classList.add("All");
    div_row.dataset.projectName = String(project.name || "").toLowerCase();

    div_row.dataset.projectStatus = getProjectStatus(project.id);
    div_row.innerHTML = renderProject(project, dateText);

    target.appendChild(div_row);

    // Animate progress bars
    const bars = div_row.querySelectorAll(".progress-fill");

    bars.forEach((bar) => {
      const progress = bar.dataset.progress || "0%";

      bar.style.transition = "none";
      bar.style.width = "0%";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = "";
          bar.style.width = progress;
        });
      });
    });

    // Edit Project: موجود في صفحة المشاريع فقط
    const editBtn = div_row.querySelector(".edit-btn");

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        const selectedProject = EditProjectInlocalstorage(project.id);

        if (!selectedProject) return;

        isEditingProject = true;
        editingProjectId = selectedProject.id;

        if (FillFeild) {
          FillFeild(selectedProject);
        }
      });
    }

    // Delete Project: موجود في صفحة المشاريع فقط
    const deleteBtn = div_row.querySelector(".delete-project");

    if (deleteBtn) {
      deleteBtn.addEventListener("click", async () => {
        //? Confirm with a message naming the exact project being removed
        const confirmed = await confirmDelete({
          title: "Delete this project?",
          itemName: project.name,
        });

        if (!confirmed) return;

        delprojectinlocalstorage(project.id);

        // Refresh project list
        addProjectInPage(
          target,
          0,
          renderProject,
          updateCounts,
          refreshTaskProjects,
          FillFeild,
        );

        // Refresh task project dropdown
        if (refreshTaskProjects) {
          refreshTaskProjects();
        }

        // Refresh counters
        if (updateCounts) {
          updateCounts();
        }
      });
    }
  });
}

//? Update Project
function UpdateProject(id, updatedData) {
  const projectIndex = ProjectInfo.findIndex(
    (project) => String(project.id) === String(id),
  );

  if (projectIndex !== -1) {
    Object.assign(ProjectInfo[projectIndex], updatedData);
    AddProjectTolocal();
  }
}
function delprojectinlocalstorage(id) {
  ProjectInfo = ProjectInfo.filter((project) => project.id !== id);
  AddProjectTolocal();
}
function EditProjectInlocalstorage(id) {
  return ProjectInfo.find((project) => project.id === id);
}
function resetProjectEditing() {
  isEditingProject = false;
  editingProjectId = null;
}
//? Export
export {
  ProjectInfo,
  GetFromLocalProject,
  AddProjectTolocal,
  AddInfoProject,
  addProjectInPage,
  createProjectBtnFun,
  getProjectTasks,
  renderDashboardProject,
  renderProjectsPage,
  getProjectProgress,
  getProjectStatus,
  fillTaskProjects,
  delprojectinlocalstorage,
  resetProjectEditing,
};
