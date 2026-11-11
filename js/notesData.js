import { CloseList, confirmDelete, OpenList } from "./modal.js";

let NoteInfo = [];

//? Add Task

function AddInfoNote({
  name,
  describion,
  date,
  importance,
  category,
  projectId,
}) {
  const Info = {
    id: Date.now(),
    name: name.trim(),
    describion: describion || "",
    Date: date,
    Imprtance: importance,
    Category: category || "other",
    projectId: projectId || null,
  };

  NoteInfo.push(Info);
  AddNoteTolocal();
}

//? Save To Local Storage
function AddNoteTolocal() {
  localStorage.setItem("Notes", JSON.stringify(NoteInfo));
}

//? Get From Local Storage

function GetNoteFromLocal() {
  const savedNote = localStorage.getItem("Notes");

  try {
    NoteInfo = savedNote ? JSON.parse(savedNote) : [];

    if (!Array.isArray(NoteInfo)) {
      NoteInfo = [];
    }
  } catch {
    NoteInfo = [];
  }
}

//? Btn Event Function
function createBtnFun(
  btnevent,
  targetres,
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
  getEditingNoteId,
  setEditingNoteId,
) {
  btnevent.addEventListener("click", () => {
    //? Check Inputs
    if (
      noteName.value !== "" &&
      noteDate.value !== "" &&
      noteImprtance.value !== "" &&
      noteImprtance.selectedIndex !== 0
    ) {
      let userDate = new Date(noteDate.value);
      let crruntDate = new Date();

      userDate.setHours(0, 0, 0, 0);
      crruntDate.setHours(0, 0, 0, 0);

      //? Check Date
      if (userDate >= crruntDate) {
        //? Prepare Note Data
        const updatedData = {
          name: noteName.value.trim(),
          describion: notedes.value,
          Date: noteDate.value,
          Imprtance: noteImprtance.value,
          Category:
            noteProject.value === "other"
              ? "Other"
              : noteProject.options[noteProject.selectedIndex].text,
          projectId:
            !noteProject.value || noteProject.value === "other"
              ? null
              : Number(noteProject.value),
        };

        //? Add New Note

        if (getEditingNoteId() !== null) {
          UpdateNote(getEditingNoteId(), updatedData);
        } else {
          AddInfoNote({
            name: updatedData.name,
            describion: updatedData.describion,
            date: updatedData.Date,
            importance: updatedData.Imprtance,
            category: updatedData.Category,
            projectId: updatedData.projectId,
          });
        }

        //? Reset Inputs
        noteName.value = "";
        notedes.value = "";
        noteDate.value = "";
        noteProject.value = "";
        setEditingNoteId(null);
        noteProject.selectedIndex = 0;
        noteImprtance.selectedIndex = 0;

        //? Update Total Count
        notecount.textContent = NoteInfo.length;

        addNoteInPage(targetres, null, updateCounts, FillFeild);
        //? Close Modal

        CloseList(btnOverlay, addList);

        if (updateCounts) {
          updateCounts();
        }
      }
    }
  });
}
//? Update Note
function UpdateNote(id, updatedData) {
  let noteIndex = NoteInfo.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    Object.assign(NoteInfo[noteIndex], updatedData);
    AddNoteTolocal();
  }
}
//? Count Noraml Note
function NoramlNote() {
  const normalNotes = NoteInfo.filter((note) => note.Imprtance === "normal");

  return normalNotes.length;
}
//? Count Improtant Note
function ImprotantNote() {
  const ImprotantNotes = NoteInfo.filter(
    (note) => note.Imprtance === "important",
  );

  return ImprotantNotes.length;
}

//? Add Note Of Page
function addNoteInPage(
  target,
  projectId = null,
  updateCounts = null,
  FillFeild = null,
) {
  target.innerHTML = "";

  const notes = NoteInfo.filter((note) => {
    return projectId === null || String(note.projectId) === String(projectId);
  });

  if (notes.length === 0) {
    target.innerHTML = `
    <p class="empty-state">No notes found.</p>
  `;

    if (updateCounts) {
      updateCounts();
    }

    return;
  }

  notes.forEach((note) => {
    const userDate = new Date(`${note.Date}T00:00:00`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dateText =
      userDate.getTime() === currentDate.getTime()
        ? "Today"
        : userDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

    const noteCard = document.createElement("div");
    noteCard.className = "note-wrapper";
    noteCard.dataset.id = note.id;
    noteCard.innerHTML = `
      <div class="card note">
        <div>
          <span class="badge type"></span>
          <div class="add-del">
            <i class="fa-regular fa-pen-to-square edit-btn"></i>
            <i class="fa-regular fa-trash-can del-btn"></i>
          </div>
        </div>
        <b class="note-name"></b>
        <p class="note-description"></p>
        <span class="note-date">
          <i class="fa-regular fa-calendar-days"></i>
          ${dateText}
        </span>
      </div>
    `;

    noteCard.querySelector(".badge").textContent = note.Category || "Other";

    noteCard.querySelector(".note-name").textContent = note.name || "";

    noteCard.querySelector(".note-description").textContent =
      note.describion || "";

    noteCard
      .querySelector(".card.note")
      .classList.add(String(note.Imprtance || "").toLowerCase());

    target.appendChild(noteCard);

    noteCard.querySelector(".edit-btn").addEventListener("click", () => {
      let selectedNote = EditNoteInlocalstorage(note.id);

      if (FillFeild) {
        FillFeild(selectedNote);
      }
      if (updateCounts) {
        updateCounts();
      }
    });

    noteCard.querySelector(".del-btn").addEventListener("click", async () => {
      //? Confirm with a message naming the exact note being removed
      const confirmed = await confirmDelete({
        title: "Delete this note?",
        itemName: note.name,
      });

      if (!confirmed) return;

      deltaskinlocalstorage(note.id);

      addNoteInPage(target, projectId, updateCounts);

      if (updateCounts) {
        updateCounts();
      }
    });
  });
}

function EditNoteInlocalstorage(id) {
  return NoteInfo.find((note) => note.id === id);
}

//? Delete Event Function
function deltaskinlocalstorage(id) {
  NoteInfo = NoteInfo.filter((note) => note.id !== id);
  AddNoteTolocal();
}

export {
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
};
