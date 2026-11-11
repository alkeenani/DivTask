const PROFILE_KEY = "Profile";

const defaultProfile = {
  firstName: "Mohamed",
  lastName: "Alkenani",
  role: "Developer",
  email: "",
  bio: "",
  photo: "",
};

// Get saved profile
function getProfile() {
  try {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (!savedProfile) {
      return { ...defaultProfile };
    }

    const parsedProfile = JSON.parse(savedProfile);

    return {
      ...defaultProfile,
      ...parsedProfile,
    };
  } catch (error) {
    console.error("Error loading profile:", error);
    return { ...defaultProfile };
  }
}

// Save profile
function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

    window.dispatchEvent(new Event("profileUpdated"));

    return true;
  } catch (error) {
    console.error("Error saving profile:", error);
    return false;
  }
}

// Reset profile
function resetProfile() {
  return saveProfile({ ...defaultProfile });
}

//? Paint one avatar element with the saved photo or with the initials
function fillAvatar(element, profile = getProfile()) {
  if (!element) return;

  const initials = `${(profile.firstName || "").charAt(0)}${(profile.lastName || "").charAt(0)}`;

  const normalized = initials.toUpperCase() || "U";

  element.textContent = profile.photo ? "" : normalized;

  element.style.backgroundImage = profile.photo
    ? `url("${profile.photo}")`
    : "";
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";
  element.style.backgroundRepeat = "no-repeat";

  //? The .has-photo class hides the initials and keeps the image centered
  element.classList.toggle("has-photo", Boolean(profile.photo));
}

export { getProfile, saveProfile, resetProfile, fillAvatar };
