# DivTask

DivTask is a lightweight, client-side productivity workspace for managing **projects**, **tasks**, and **notes** in one place. It also includes a GitHub developer explorer and a profile/settings area. Everything runs in the browser with no backend — data is persisted in `localStorage`.

> The app is also referred to as **DevTask** in some UI text.

## Features

- **Dashboard** — stat cards, overall progress ring, project progress, upcoming deadlines, and recent tasks.
- **Projects** — create, edit, and delete projects; assign a color and category; track progress from linked tasks; search and filter by status.
- **Tasks** — add, edit, complete, and delete tasks; filter by status (All, In Progress, Completed, To Do, Overdue); link tasks to projects; "due soon" counter.
- **Notes** — create, edit, and delete notes; mark notes as important or normal; organize by project/category.
- **GitHub Developers** — look up any GitHub user and browse their profile and top public repositories via the GitHub REST API.
- **Profile & Settings** — edit name, role, email, and bio; upload a profile photo (JPG/PNG/GIF, max 2MB); view saved-data statistics; reset the profile.
- **Dark / light theme** — toggle in the header, persisted across visits.
- **Responsive layout** — collapsible sidebar and adaptive grids for tablets and phones.
- **Confirmation dialogs** — themed alerts and delete confirmations with Escape/overlay dismissal.

## Tech Stack

- **HTML5** and semantic page structure
- **CSS3** — custom properties (design tokens), Grid/Flexbox, glassmorphism note cards, responsive breakpoints
- **Vanilla JavaScript (ES Modules)** — no framework or build step
- **Font Awesome 6** via CDN
- **GitHub REST API** for developer search
- **localStorage** for persistence

## Getting Started

No build tools or dependencies are required.

```bash
git clone https://github.com/alkeenani/DivTask.git
cd DivTask
```

Because the app loads components with `fetch()` and uses ES modules, it must be served over HTTP (opening `index.html` directly with `file://` will not work).

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node
npx serve .
```

Then open <http://localhost:8000>.

## Project Structure

```text
DivTask/
├── index.html            # Dashboard
├── projects.html         # Projects
├── tasks.html            # Tasks
├── notes.html            # Notes
├── developers.html       # GitHub developer search
├── settings.html         # Profile and settings
│
├── css/
│   ├── style.css         # Main styles and design tokens
│   └── responsive.css    # Tablet/mobile breakpoints
│
├── components/
│   ├── sidebar.html      # Injected sidebar
│   ├── header.html       # Injected header
│   ├── addtask.html      # Add/edit task modal
│   ├── addproject.html   # Add/edit project modal
│   └── addnote.html      # Add/edit note modal
│
├── js/
│   ├── main.js           # Header, theme, mobile menu, profile sync
│   ├── sidebar.js        # Loads sidebar and marks the active link
│   ├── dashboard.js      # Dashboard rendering and modals
│   ├── project.js        # Projects page logic
│   ├── projectData.js    # Project state, storage, rendering
│   ├── tasks.js          # Tasks page logic
│   ├── tasksData.js      # Task state, storage, rendering
│   ├── notes.js          # Notes page logic
│   ├── notesData.js      # Note state, storage, rendering
│   ├── developers.js     # GitHub API search
│   ├── profileData.js    # Profile state and avatar helper
│   ├── settings.js       # Settings page logic
│   ├── modal.js          # Open/close helpers, alerts, delete confirm
│   └── utils.js          # Reserved for shared utilities
│
└── assets/               # Static assets (reserved)
```

## How It Works

- The **header** and **sidebar** are HTML partials in `components/` that are fetched and injected into every page by `main.js` and `sidebar.js`.
- The add/edit forms are also injected as partials (`addtask.html`, `addproject.html`, `addnote.html`).
- Data modules (`tasksData.js`, `projectData.js`, `notesData.js`, `profileData.js`) own their arrays, sync with `localStorage`, and expose render/CRUD helpers.
- Updates are broadcast with custom events (`tasksUpdated`, `profileUpdated`) so multiple UI areas stay in sync.
- User-entered text is rendered with `textContent` to avoid injecting HTML.

### Storage Keys

| Key        | Contents                                                           |
| ---------- | ------------------------------------------------------------------ |
| `Tasks`    | `{ id, name, describion, Date, Imprtance, projectId, completed }`  |
| `Projects` | `{ id, name, describion, type, Date, Imprtance, Category, color }` |
| `Notes`    | `{ id, name, describion, Date, Imprtance, Category, projectId }`   |
| `Profile`  | `{ firstName, lastName, role, email, bio, photo }`                 |
| `them`     | Active theme (`light` / `dark`)                                    |
| `icon`     | Active theme icon                                                  |

## Routes

| Page              | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `index.html`      | Dashboard overview                       |
| `projects.html`   | Manage projects                          |
| `tasks.html`      | Manage tasks (supports `?projectId=...`) |
| `notes.html`      | Manage notes                             |
| `developers.html` | Search GitHub developers                 |
| `settings.html`   | Profile and saved-data settings          |

## Limitations

- **No backend** — all data lives in the current browser's `localStorage`. Clearing site data deletes everything, and data does not sync across devices.
- **GitHub API** — unauthenticated requests are rate-limited to 60 requests per hour per IP.
- **Static hosting** — the site must be served from the repository root so the relative `components/` fetches resolve correctly.

## Auhtor

**Mohamed ALkenani**
-Repository: [github.com/alkeenani/DivTask](https://github.com/alkeenani/DivTask)
