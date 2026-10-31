// ? Get Header Component
fetch("../components/header.html")
  .then((res) => res.text())
  .then((data) => {
    document.querySelector("#header").innerHTML = data;
    //? Get Crrunt Page Name
    const crruntPage =
        window.location.pathname.split("/").pop() || "index.html",
      // ? Get Header Elelment
      sectionName = document.querySelector(".barnd h2"),
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
    let buttonThems = document.querySelector(".dark-mode-btn");

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
  });
