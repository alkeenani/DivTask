import { getProfile, fillAvatar } from "./profileData.js";

// ? Get Header Component
fetch("../components/header.html")
  .then((res) => res.text())
  .then((data) => {
    document.querySelector("#header").innerHTML = data;

    //? Paint The Saved Profile In The Header
    const paintHeaderProfile = () => {
      const profile = getProfile(),
        avatar = document.querySelector(".header-user .imge-profile"),
        name = document.querySelector(".header-profile-name"),
        role = document.querySelector(".header-profile-role");

      if (name) {
        name.textContent =
          `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
          "User";
      }

      if (role) {
        role.textContent = profile.role || "Member";
      }

      fillAvatar(avatar, profile);
    };

    paintHeaderProfile();
    window.addEventListener("profileUpdated", paintHeaderProfile);

    //? Paint The Saved Profile Image In The Sidebar
    const paintSidebarProfile = () => {
      const avatar = document.querySelector("#sidebar .imge-profile");

      if (avatar) {
        fillAvatar(avatar);
      }
    };

    paintSidebarProfile();
    window.addEventListener("profileUpdated", paintSidebarProfile);

    //? The Sidebar Is Injected Separately, So Wait For It
    if (!document.querySelector("#sidebar .imge-profile")) {
      const sidebarEl = document.querySelector("#sidebar");

      if (sidebarEl) {
        const sidebarObserver = new MutationObserver(() => {
          if (document.querySelector("#sidebar .imge-profile")) {
            paintSidebarProfile();
            sidebarObserver.disconnect();
          }
        });

        sidebarObserver.observe(sidebarEl, { childList: true });
      }
    }
    //? Get Crrunt Page Name
    const crruntPage =
        window.location.pathname.split("/").pop() || "index.html",
      // ? Get Header Elelment
      sectionName = document.querySelector(".brand h2"),
      date = document.querySelector(".date"),
      // ? Get Crrunt Date
      crruntDay = new Date().getDay(),
      crruntMonth = new Date().getMonth(),
      crruntDate = new Date().getDate();

    //? Page Name

    const pageName = {
        "index.html": "Dashboard",
        "projects.html": "Project",
        "tasks.html": "Tasks",
        "notes.html": "Notes",
        "developers.html": "Developer",
        "settings.html": "Settings",
      },
      //? Days Of The Week
      daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      //? Months Of The Year
      monthsOfYear = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    //? Set Current Page Name
    sectionName.textContent = pageName[crruntPage] || "Dashboard";

    //? Set Current Date
    date.textContent = `${daysOfWeek[crruntDay]}, ${monthsOfYear[crruntMonth]} ${crruntDate}`;

    //? Dark And Light
    let buttonThems = document.querySelector(".dark-mode");

    //? Theme Icons
    let faMonn = "fa-moon";
    let faSun = "fa-sun";

    //? Get Saved Theme And Icon From LocalStorage
    const getlocalthems = localStorage.getItem("them");
    const getlocalicon = localStorage.getItem("icon");

    //? Get Current Theme
    const getcrruntthems = () =>
      document.body.classList.contains("dark") ? "dark" : "light";

    //? Get Current Theme Icon
    const getcrrunticon = () =>
      buttonThems.querySelector("i").classList.contains(faMonn)
        ? "fa-moon"
        : "fa-sun";

    //? Apply Saved Theme
    if (getlocalthems) {
      document.body.classList[getlocalthems === "dark" ? "add" : "remove"](
        "dark",
      );

      //? Apply Saved Icon
      if (getlocalicon === "fa-moon") {
        buttonThems.innerHTML = '<i class="fa-solid fa-moon"></i>';
      } else {
        buttonThems.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    }

    //? Toggle Dark And Light Mode
    buttonThems.addEventListener("click", (e) => {
      document.body.classList.toggle("dark");

      //? Change Theme Icon
      document.body.classList.contains("dark")
        ? (buttonThems.innerHTML = '<i class="fa-solid fa-sun"></i>')
        : (buttonThems.innerHTML = '<i class="fa-solid fa-moon"></i>');

      //? Save Current Theme And Icon
      localStorage.setItem("them", getcrruntthems());
      localStorage.setItem("icon", getcrrunticon());
    });
    //? Get Mobile Menu Elelment
    let openbar = document.querySelector(".bar"),
      closebar = document.querySelector(".close-bar"),
      sidebar = document.querySelector("#sidebar"),
      overlay = document.querySelector(".mobile-overlay");
    console.log(openbar);
    console.log(closebar);
    console.log(sidebar);
    console.log(overlay);
    //? Open Mobile Sidebar
    openbar.addEventListener("click", () => {
      sidebar.classList.add("open");
      overlay.classList.add("show");
    });

    //? Close Mobile Sidebar
    closebar.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });

    //? Close Sidebar When Clicking Overlay
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
    //? colse Mobile Sidbar On Large Screen
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1190) {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
      }
    });
    //? Notifation Button
    const ntfBtn = document.querySelector(".notifications-btn"),
      ntfList = document.querySelector(".notifications-list"),
      read = document.querySelector(".mark-as-read"),
      empty = document.querySelector(".result");

    ntfBtn.addEventListener("click", () => {
      ntfList.classList.toggle("open");
      if (!empty.classList.contains("empty")) {
        read.addEventListener("click", (e) => {
          empty.innerHTML = "";
          empty.innerHTML = `<div class = "icon" ><i class="fa-solid fa-box-open"></i> </div>
          <h2>Empty</h2>`;
        });
      }
    });
  });
