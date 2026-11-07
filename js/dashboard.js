import { OpenList, CloseList } from "./modal.js";
//?  Add Task Modal
fetch("./components/addtask.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Feilad To Load AddTask Modal");
    }
    return res.text();
  })
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);
    const addTask = document.querySelectorAll(".add-task"),
      btnOvrelay = document.querySelector(".btn-overlay"),
      addList = document.querySelector(".add-list"),
      closebtn = addList ? document.querySelectorAll(".closebtn") : [],
      cancelbtn = addList ? document.querySelectorAll(".cancel") : [],
      taskName = document.querySelector(".task-name"),
      taskDes = document.querySelector(".task-des"),
      taskImpotance = document.querySelector(".add-list .importance"),
      taskDate = document.querySelector(".add-list [type='date']"),
      createTask = document.querySelector(".add-list .create-task"),
      taskCount = document.querySelector(".tasks-card .count"),
      taskComplited = document.querySelector(".tasks-complited .count");
    //? Event Open Modal
    addTask.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOvrelay && addList) {
          OpenList(btnOvrelay, addList);
        }
      });
    });
    //? Event Close Modal
    if (btnOvrelay && addList) {
      btnOvrelay.addEventListener("click", () => {
        CloseList(btnOvrelay, addList);
      });
    }

    closebtn.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOvrelay && addList) {
          CloseList(btnOvrelay, addList);
        }
      });
    });
    cancelbtn.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOvrelay && addList) {
          CloseList(btnOvrelay, addList);
        }
      });
    });
  });

//? Add Project Modal
fetch("../components/addproject.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Filed To Load addproject.html");
    }
    return res.text();
  })
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);
    // ? Get Elelemnt Add Project Modal
    const newProject = document.querySelectorAll(".new-project"),
      addproject = document.querySelector(".project-list"),
      btnOvrelay = document.querySelector(".btn-overlay"),
      closebtn = addproject ? addproject.querySelectorAll(".colsebtn") : [],
      cancelbtn = addproject ? addproject.querySelectorAll(".cancel") : [],
      projectName = document.querySelector(".project-list .project-name"),
      projectDes = document.querySelector(".project-list .project-des"),
      projectCategroy = document.querySelector(
        ".project-list .project-categroy",
      ),
      projectImportance = document.querySelector(".project-list .importance"),
      projectDate = document.querySelector(".project-list [type = 'date']"),
      projectColor = document.querySelectorAll(
        ".project-list .color-row button",
      ),
      createProject = document.querySelector(".project-list .create-project");

    // const target = document.querySelector(".")

    //? Open Project Modal

    newProject.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOvrelay && addproject) {
          OpenList(btnOvrelay, addproject);
        }
      });
    });

    //? Close Project Modal
    closebtn.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOvrelay && addproject) {
          CloseList(btnOvrelay, addproject);
        }
      });
    });

    //? Cancel Button Modal
    cancelbtn.forEach((button) => {
      button.addEventListener("click", () => {
        if (btnOvrelay && addproject) {
          CloseList(btnOvrelay, addproject);
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
  });
