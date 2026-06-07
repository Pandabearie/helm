# Helm — Practice Management for Freelancers

A local-first project and client management app for freelancers and consultants. Think Asana, but built around **clients** and **billable time** rather than a single team backlog — and your data lives in a file on your own machine.

---

## What it does

Helm lets you manage every client engagement from one place:

- **10 views** — Overview dashboard, My Tasks, Inbox, List, Board (Kanban), Calendar, Timeline (Gantt), Clients, Timesheet, Reports
- **Project Templates** — pre-save task sets and apply them to any client in one click
- **Floating timer** — start/pause/switch time tracking from any view; commits to the timesheet automatically
- **Full task detail** — status, priority, client, tags, due date, estimate, subtasks, comments, activity log
- **Client-centric** — every task is scoped to a client; the Clients view shows rate, retainer, hours, and all open work per client
- **Reports & Timesheet** — billable hours by client, weekly matrix, SVG charts
- **Light & dark mode**, 6 accent colours, compact/comfy density

---

## Running it

### Prerequisites

- [Node.js](https://nodejs.org) (LTS, v18+)

### Start

```bash
git clone https://github.com/Pandabearie/helm.git
cd helm
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

On Windows you can also double-click **`start.bat`** — it installs dependencies on first run.

### Data persistence

All data is saved to **`helm-data.json`** in the project folder. The file is written automatically every time you make a change (debounced 400 ms) and flushed when you close the tab. Close the server, reopen it — everything is exactly where you left it.

`helm-data.json` is gitignored so your real workspace data is never committed.

---

## Project structure

```
helm/
├── server.js                          Express backend (GET/POST /api/data, static serve)
├── package.json
├── start.bat                          Windows one-click launcher
├── helm-data.json                     Your live data (auto-created, gitignored)
│
├── design-reference/                  The app (React + Babel, no build step)
│   ├── Helm.html                      Entry point
│   ├── styles.css                     All design tokens & component styles
│   ├── data.jsx                       Seed data, domain constants (clients, tags, statuses)
│   ├── ui.jsx                         Icon set, Sidebar, Topbar, TaskPanel, CmdK, FloatingTimer…
│   ├── views.jsx                      All 10 views
│   ├── templates.jsx                  Project Templates view, panel, and apply modal
│   ├── app.jsx                        Top-level state, API wiring, keyboard shortcuts
│   └── tweaks-panel.jsx               Dev-only theme preview panel (not for production)
│
└── reference-implementation/          Production-ready code snippets (Electron / Vite / TS)
    ├── electron-main.js
    ├── preload.js
    ├── store.ts
    └── helm-data.example.json
```

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 (Babel/CDN — no build step for prototype) |
| Styles | Vanilla CSS with design tokens (no CSS-in-JS) |
| Backend | Node.js + Express |
| Persistence | JSON file (`helm-data.json`) |
| Fonts | Geist, Geist Mono, Instrument Serif (Google Fonts) |
| Icons | Inline SVG (no icon library) |

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/⌘ K` | Open command palette / search |
| `Ctrl/⌘ N` | Quick-add task |
| `Esc` | Close panel or modal |

---

## Roadmap

See [SETUP.md](SETUP.md) for a full gap analysis against Asana / Monday.com, a list of known UI issues, and a prioritised backlog of suggested additions.

---

## License

MIT
