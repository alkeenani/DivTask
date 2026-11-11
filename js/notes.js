import { OpenList, CloseList } from "./modal.js";
import {
  fillTaskProjects,
  ProjectInfo,
  GetFromLocalProject,
} from "./projectData.js";
import {
  NoteInfo,
  AddInfoNote,
  AddNoteTolocal,
  GetNoteFromLocal,
  createBtnFun,
  addNoteInPage,
  NoramlNote,
  ImprotantNote,
  deltaskinlocalstorage,
  UpdateNote,
} from "./notesData.js";
import { TaskInfo } from "./tasksData.js";
fetch("./components/addnote.html")
  .then((res) => res.text())
  .then((data) => {
    document.body.insertAdjacentHTML("beforeend", data);
    //? Get Page Elements
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
      importantCount = document.querySelector(".important .count"),
      taskProject = document.querySelector(".add-list .note-project");

    const updateCounts = () => {
      notecount.textContent = NoteInfo.length;
      normalCount.textContent = NoramlNote();
      importantCount.textContent = ImprotantNote();
    };
    let editingNoteId = null;
    const FillFeild = (selectedNote) => {
      editingNoteId = selectedNote.id;
      OpenList(btnOverlay, addList);
      noteName.value = selectedNote.name;
      noteDate.value = selectedNote.Date;
      noteImprtance.value = selectedNote.Imprtance;
      notedes.value = selectedNote.describion;
      if (selectedNote.projectId === null) {
        noteProject.value = "other";
      } else {
        noteProject.value = String(selectedNote.projectId);
      }
    };
    //? Get Project From Local Storage
    GetFromLocalProject();
    //? Get Note From Local Storage
    GetNoteFromLocal();
    //? Add Notes of  Page
    addNoteInPage(notecrads, null, updateCounts, FillFeild); //? Update Note Count
    notecount.textContent = NoteInfo.length;
    //? Update  Noraml Note Count
    normalCount.textContent = NoramlNote();
    //? Update  Important Note Count
    importantCount.textContent = ImprotantNote();
    //? Fill Select option IN Project Name
    if (taskProject) {
      fillTaskProjects(taskProject);
    }
    //? Open Add Task
    addnote.addEventListener("click", () => {
      editingNoteId = null;
      OpenList(btnOverlay, addList);
    });

    //? Close Overlay
    btnOverlay.addEventListener("click", () => {
      editingNoteId = null;

      CloseList(btnOverlay, addList);
    });

    //? Close Buttons

    closeBtns.addEventListener("click", () => {
      editingNoteId = null;

      CloseList(btnOverlay, addList);
    });

    //? Cancel Buttons
    cancelBtns.addEventListener("click", () => {
      editingNoteId = null;

      CloseList(btnOverlay, addList);
    });

    //? Create Btn Note
    createBtnFun(
      ceateNote,
      notecrads,
      notecount,
      noteName,
      notedes,
      noteProject,
      noteImprtance,
      noteDate,
      btnOverlay,
      addList,
      updateCounts,
      FillFeild,
      () => editingNoteId,
      (id) => {
        editingNoteId = id;
      },
    );
  });
