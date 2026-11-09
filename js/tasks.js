import { OpenList, CloseList } from "./modal.js";
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
      taskComplited = document.querySelector(".tasks-completed .count");
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
