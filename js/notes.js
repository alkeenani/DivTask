import { OpenList, CloseList } from "./modal.js";
fetch("../components/addnote.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Filed Load To addnote.html");
    }
    return res.text();
  })
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);
    //? Get Page Element
    const addnote = document.querySelector(".new-note"),
      ceateNote = document.querySelector(".create-note"),
      notecrads = document.querySelector(".note-cards"),
      btnOverlay = document.querySelector(".btn-overlay"),
      addList = document.querySelector(".add-list"),
      closeBtns = document.querySelector(".closebtn"),
      cancelBtns = document.querySelector(".cancel"),
      noteName = document.querySelector(".add-list .note-name"),
      notedes = document.querySelector(".add-list .note-des"),
      noteProject = document.querySelector(".add-list .note-project"),
      noteImprtance = document.querySelector(".add-list .importance"),
      noteDate = document.querySelector(".add-list [type='date']"),
      notecount = document.querySelector(".total .count"),
      normalCount = document.querySelector(".normal .count"),
      importantCount = document.querySelector(".important .count");

    //? Open Note Modal
    console.log(btnOverlay);
    addnote.addEventListener("click", () => {
      OpenList(btnOverlay, addList);
    });

    //? Colse Note Modal
    closeBtns.addEventListener("click", () => {
      CloseList(btnOverlay, addList);
    });
    //? Cancel Note Modal
    cancelBtns.addEventListener("click", () => {
      CloseList(btnOverlay, addList);
    });
  });
