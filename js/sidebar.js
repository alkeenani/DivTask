fetch("../components/sidebar.html")
  .then((res) => res.text())
  .then((data) => {
    document.querySelector("#sidebar").innerHTML = data;
    const sidebar = document.querySelectorAll("#sidebar li a"),
      crruntPage = window.location.pathname;

    sidebar.forEach((link) => {
      if (link.pathname === crruntPage) {
        link.parentElement.classList.add("active");
      }
    });
  })
  .catch((erorr) => {
    console.log(erorr);
  });
