import { GetFromLocal } from "./tasksData.js";
import { GetFromLocalProject } from "./projectData.js";

import {
  getProfile,
  saveProfile,
  resetProfile,
  fillAvatar,
} from "./profileData.js";

import { showAlert } from "./modal.js";

GetFromLocal();
GetFromLocalProject();

// Elements
//? Scope the lookup to the Settings card so it never picks the sidebar/header avatar
const avatar = document.querySelector(".settings-section .imge-profile");
const changeBtn = document.querySelector(".change-photo");
const uploadBtn = document.querySelector("#photo");

const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const role = document.querySelector("#role");
const email = document.querySelector("#email");
const bio = document.querySelector("#bio");

const resetBtn = document.querySelector(".reset-profile");
const saveBtn = document.querySelector(".save-profile");

const countTasks = document.querySelector(".count-tasks");
const countProjects = document.querySelector(".count-projects");
const countNotes = document.querySelector(".count-notes");
const countSize = document.querySelector(".count-size");

// Safe localStorage parsing
function getStoredArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Statistics
function updateStatistics() {
  countTasks.textContent = getStoredArray("Tasks").length;
  countProjects.textContent = getStoredArray("Projects").length;
  countNotes.textContent = getStoredArray("Notes").length;

  const keys = ["Tasks", "Projects", "Notes", "Profile"];

  const totalBytes = keys.reduce((total, key) => {
    const value = localStorage.getItem(key);

    return total + (value ? new Blob([value]).size : 0);
  }, 0);

  countSize.textContent =
    totalBytes >= 1024
      ? `${(totalBytes / 1024).toFixed(2)} KB`
      : `${totalBytes} B`;
}

// Render avatar
function renderAvatar(profile) {
  //? Shared helper keeps every avatar in sync with the same saved photo
  fillAvatar(avatar, profile);
}

// Fill form
function fillProfileForm(profile) {
  firstName.value = profile.firstName || "";
  lastName.value = profile.lastName || "";
  role.value = profile.role || "";
  email.value = profile.email || "";
  bio.value = profile.bio || "";

  renderAvatar(profile);
}

// Read initial data
let profile = getProfile();

fillProfileForm(profile);
updateStatistics();

// Change photo
changeBtn.addEventListener("click", () => {
  uploadBtn.click();
});

// Upload photo
uploadBtn.addEventListener("change", () => {
  const file = uploadBtn.files[0];

  if (!file) return;

  if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    showAlert({
      type: "warning",
      title: "Unsupported file",
      message: "Please select a JPG, PNG, or GIF image.",
    });

    uploadBtn.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showAlert({
      type: "warning",
      title: "Image too large",
      message: "The image size must not exceed 2MB.",
    });

    uploadBtn.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    profile.photo = reader.result;
    renderAvatar(profile);
  };

  reader.readAsDataURL(file);
});

// Save changes
saveBtn.addEventListener("click", () => {
  if (!firstName.value.trim() || !lastName.value.trim()) {
    showAlert({
      type: "error",
      title: "Missing details",
      message: "First Name and Last Name are required.",
    });

    return;
  }

  if (email.value.trim() && !email.checkValidity()) {
    showAlert({
      type: "error",
      title: "Invalid email",
      message: "Please enter a valid email address.",
    });

    return;
  }

  const updatedProfile = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    role: role.value.trim(),
    email: email.value.trim(),
    bio: bio.value.trim(),
    photo: profile.photo || "",
  };

  if (!saveProfile(updatedProfile)) {
    showAlert({
      type: "error",
      title: "Save failed",
      message: "Could not save profile. Browser storage may be full.",
    });

    return;
  }

  profile = updatedProfile;

  showAlert({
    type: "success",
    title: "Profile saved",
    message: "Your changes were saved successfully.",
  });

  updateStatistics();
});

// Reset profile
resetBtn.addEventListener("click", async () => {
  const confirmed = await showAlert({
    type: "warning",
    title: "Reset profile?",
    message: "This restores the default profile values. This cannot be undone.",
    confirmLabel: "Reset",
    cancelLabel: "Cancel",
  });

  if (!confirmed) return;

  if (!resetProfile()) {
    showAlert({
      type: "error",
      title: "Reset failed",
      message: "Could not reset profile.",
    });

    return;
  }

  profile = getProfile();

  uploadBtn.value = "";
  fillProfileForm(profile);
  updateStatistics();

  showAlert({
    type: "success",
    title: "Profile reset",
    message: "Your profile was restored to the default values.",
  });
});
