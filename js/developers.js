//? Get Elements

const input = document.querySelector(".repo-user");
const submitBtn = document.querySelector(".searchBtn");
const showData = document.querySelector(".result-search");

//? Git Data Event

submitBtn.addEventListener("click", GitData);

//? Enter Key

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    GitData();
  }
});

//? Fetch Data Function

function GitData() {
  const username = input.value.trim();

  if (username === "") {
    showData.innerHTML = `
      <div class="empty-result">
        <h2>Please Enter Username</h2>
        <p>Enter a valid GitHub username to start searching.</p>
      </div>
    `;
    return;
  }

  showData.innerHTML = "Loading...";

  Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=stars`,
    ),
  ])
    .then(async ([userRes, reposRes]) => {
      if (!userRes.ok || !reposRes.ok) {
        throw new Error("User Not Found");
      }

      const user = await userRes.json();
      const repos = await reposRes.json();

      return { user, repos };
    })

    .then(({ user, repos }) => {
      //? Clear Old Data

      showData.innerHTML = "";

      //? Developer Card

      const DevCard = document.createElement("div");

      DevCard.classList.add("developer-card");
      DevCard.classList.add("card");

      DevCard.innerHTML = `
        <img
          class="github-avatar"
          src="${user.avatar_url}"
          alt="${user.login}"
        >

        <div class="developer-main">

          <span class="badge purple">
            ${user.hireable ? "Available for work" : "GitHub Developer"}
          </span>

          <h2>${user.name || user.login}</h2>

          <p>@${user.login}</p>

          <h4>
            ${user.bio || "No bio available"}
          </h4>

          <span>
            📍 ${user.location || "Location not specified"}
          </span>

        </div>

        <div class="developer-stats">

          <div>
            <b>${user.public_repos}</b>
            <span>Repositories</span>
          </div>

          <div>
            <b>${user.followers}</b>
            <span>Followers</span>
          </div>

          <div>
            <b>${user.following}</b>
            <span>Following</span>
          </div>

        </div>

        <a
          href="${user.html_url}"
          class="profile-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fa-brands fa-github"></i>
          View Profile
        </a>
      `;

      showData.appendChild(DevCard);

      //? Repository Title

      const title = document.createElement("div");

      title.classList.add("repo-title");

      title.innerHTML = `
        <div>
          <h3>Popular repositories</h3>
          <p>Public repositories sorted by stars</p>
        </div>
      `;

      showData.appendChild(title);

      //? Repository Grid

      const grid = document.createElement("div");

      grid.classList.add("repo-grid");

      //? Check Repositories

      if (repos.length === 0) {
        grid.innerHTML = "<p>No public repositories found.</p>";
      }

      //? Create Repository Cards

      repos.forEach((repo) => {
        const repoCard = document.createElement("div");

        repoCard.classList.add("card");
        repoCard.classList.add("repo");

        repoCard.innerHTML = `
          <div>
            <div class="stat-icon purple">
              <i class="fa-regular fa-folder"></i>
            </div>

            <span class="badge purple">
              ${repo.private ? "Private" : "Public"}
            </span>
          </div>

          <h3>${repo.name}</h3>

          <p>
            ${repo.description || "No description available"}
          </p>

          <div class="repo-info">
            <small>
              <i></i>

              ${repo.language || "Unknown"}

              <span>☆ ${repo.stargazers_count}</span>

              <span>⑂ ${repo.forks_count}</span>
            </small>

            <a
              href="${repo.html_url}"
              class="repo-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Repo
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;

        grid.appendChild(repoCard);
      });

      showData.appendChild(grid);
    })

    .catch(() => {
      showData.innerHTML = `
        <div class="empty-result">
          <div>
            <i class="fas fa-search"></i>
          </div>

          <h2>User Not Found</h2>

          <p>
            Please check the username and try again.
          </p>
        </div>
      `;
    });
}
