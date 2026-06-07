# Helm — Setup, Debug Findings & Roadmap

This document covers:
1. **Known bugs** — dead buttons and broken wiring found in the codebase
2. **Gap analysis** — features Asana and Monday.com have that Helm is missing
3. **Suggested additions** — a prioritised backlog of what to build next
4. **Beginner setup guide** — how to run Helm on Windows with no coding experience

---

## 1. Known Bugs & Dead Wiring

### Phase 1 bugs — ✅ All fixed

| Component | Issue | Status |
|---|---|---|
| Sidebar → Clients "+" button | No `onClick` — did nothing | ✅ Fixed — opens New Client modal |
| Sidebar → Tags "+" button | No `onClick` — did nothing | ✅ Fixed — opens New Tag modal |
| Kanban column "+" button | No click handler | ✅ Fixed — opens Quick-add pre-set to that column's status |
| Saved Views buttons | Rendered but non-functional | ✅ Fixed — each applies a preset filter to List view |
| Assignees field | Read-only display, no picker | ✅ Fixed — click opens toggle-picker popover |
| FloatingTimer "Resume" | Disabled with no feedback | ✅ Fixed — tooltip hints user to start from a task |

### Phase 2 bugs — ✅ All fixed

| Feature | Issue | Status |
|---|---|---|
| Duplicate task | Missing from ⋯ menu | ✅ Added |
| Manual time entry | Timer-only input | ✅ "+ log time" form in Task Panel |
| Billable / non-billable flag | Always treated as billable | ✅ Toggle on timer and time entries |
| Recurring task UI | No way to set cadence | ✅ Sub-picker in ⋯ menu (None/Daily/Weekly/Monthly/Quarterly) |
| Task dependencies | No "blocked by" concept | ✅ "Blocked by" picker in Task Panel + lock icon on blocked tasks |
| Budget tracking | No progress bar | ✅ Progress bar in Client detail (amber at 80%, red at 100%) |
| Drag-to-reorder | Not available in List view | ✅ HTML5 drag-to-reorder on List view rows |
| Billable revenue in Reports | Used hardcoded $150/hr | ✅ Now sums only billable entries at actual client rates |
| Billable badge in Timesheet | All entries showed dollar amount | ✅ Non-billable entries show "Non-billable" label |

---

## 2. Gap Analysis vs. Asana & Monday.com

Features grouped by priority for a solo freelancer.

### 🔴 Critical gaps (blocks real use)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| Create / edit / delete Clients | ✅ | ✅ | ✅ Done (Phase 1) |
| Create / edit / delete Tags | ✅ | ✅ | ✅ Done (Phase 1) |
| Edit Assignees on a task | ✅ | ✅ | ✅ Done (Phase 1) |
| Functional Saved Views / filters | ✅ | ✅ | ✅ Done (Phase 1) |
| Invoice generation or export | ✅ (via integrations) | ✅ (native CRM) | ❌ Not present — Phase 3 |

### 🟠 High-value gaps (commonly used daily)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| Task dependencies (blocked by / blocking) | ✅ | ✅ | ✅ Done (Phase 2) |
| Billable vs. non-billable time flag per entry | ✅ | ✅ | ✅ Done (Phase 2) |
| Budget tracking (hours remaining vs. estimate) | ✅ | ✅ | ✅ Done (Phase 2) |
| Duplicate task | ✅ | ✅ | ✅ Done (Phase 2) |
| Manual time entry (add time without timer) | ✅ | ✅ | ✅ Done (Phase 2) |
| Drag-to-reorder tasks within a list | ✅ | ✅ | ✅ Done (Phase 2) |
| Milestones | ✅ | ✅ | ❌ Phase 3 |
| Bulk task editing (multi-select) | ✅ | ✅ | ❌ Phase 3 |
| Due date reminders / push alerts | ✅ | ✅ | ❌ Inbox notifications are static |
| Global search with saved filters | ✅ | ✅ | ⚠️ CmdK exists but no saved filter state |
| Portfolio / cross-client health view | ✅ | ✅ | ❌ Phase 3 |
| Client intake form → auto-creates tasks | ✅ | ✅ | ❌ Phase 3 |

### 🟡 Medium-value gaps (differentiators)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| Recurring task cadence editor (UI) | ✅ | ✅ | ✅ Done (Phase 2) |
| Automation rules (when X → then Y) | ✅ | ✅ | ❌ Phase 3 |
| Timesheet approval workflow | ✅ | ✅ | ❌ |
| Docs / notes layer per client or project | ✅ | ✅ | ❌ Phase 3 |
| File attachments on tasks | ✅ | ✅ | ❌ Phase 4 |
| Comment reactions (emoji) | ✅ | ✅ | ❌ Phase 4 |
| Dark mode system-preference auto-detect | ✅ | ✅ | ⚠️ Toggle exists, no `prefers-color-scheme` auto |
| Calendar two-way sync (Google Cal) | ✅ | ✅ | ❌ Phase 4 |
| Mobile app | ✅ | ✅ | ❌ Web only |
| Template variable substitution | ✅ | ✅ | ⚠️ Templates apply tasks but don't auto-fill dates |
| Workload / capacity view | ✅ | ✅ | ❌ Phase 3 |

### 🟢 Nice-to-have (power user / future)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| AI task summaries | ✅ | ✅ | ❌ Phase 4 |
| Zapier / webhook automations | ✅ | ✅ | ❌ Phase 4 |
| Guest / client portal (view-only share link) | ✅ | ✅ | ❌ Phase 4 |
| iOS / Android app | ✅ | ✅ | ❌ Phase 4 |
| Slack integration | ✅ | ✅ | ❌ Phase 4 |

---

## 3. Suggested Additions — Prioritised Backlog

---

### PHASE 1 — Fix what's broken ✅ Complete

All six confirmed bugs have been resolved. Client CRUD, Tag CRUD, Saved Views, Assignee picker, Kanban column quick-add, and FloatingTimer feedback are all working.

---

### PHASE 2 — Core missing features ✅ Complete

All Phase 2 items are implemented:

- **2.1 Duplicate task** — ⋯ menu in Task Panel → "Duplicate task"
- **2.2 Manual time entry** — "+ log time" collapsible form in Task Panel (duration, date, note, billable)
- **2.3 Billable / non-billable flag** — toggle on floating timer ("$" button) and on each manual log entry; Reports and Timesheet respect the flag
- **2.4 Recurring task UI** — ⋯ menu sub-picker (None / Daily / Weekly / Monthly / Quarterly); auto-creates next occurrence on Done
- **2.5 Task dependencies** — "Blocked by" picker in Task Panel; lock icon on blocked task rows in List view
- **2.6 Budget tracking** — progress bar in Client detail view (retainer ÷ rate = budgeted hours; amber at 80%, red at 100%)
- **2.7 Drag-to-reorder** — HTML5 drag handles on List view rows; blue drop-line shows landing position

---

### PHASE 3 — High-value additions (power up the app)

#### 3.1 Client notes / docs layer
**What:** A rich-text notes field per client — a free-form scratchpad for briefs, meeting notes, and context.  
**Where:** Add `notes: ""` to the client schema. Show a "Notes" tab in the Client detail view. Use a simple `<textarea>` or a lightweight rich-text editor like Tiptap.

#### 3.2 Invoice / billing summary export
**What:** From the Timesheet or Reports view, a "Generate invoice" button that pre-fills a template: client name, billing period, itemised tasks with hours and rate, subtotal. Export as PDF (use `window.print()` with a print stylesheet, or a library like jsPDF).  
**Where:** New `InvoiceModal` component. Triggered from `TimesheetView` per-client row or from `ClientsView` detail.

#### 3.3 Client intake form
**What:** A shareable URL (or local form page) that captures project brief info and auto-creates an inbox notification + a set of tasks from a chosen template.  
**Where:** New route `/intake/:clientId` served by `server.js`. Form posts to `POST /api/intake`; server appends tasks and inbox item to `helm-data.json`.

#### 3.4 Simple automation rules
**What:** A rules engine: "When a task is moved to Done → send an inbox notification to myself." Start with 3–5 hardcoded rules the user can toggle on/off.  
**Where:** New `automations.jsx` view + `rules` array in the data file. Evaluate rules in `app.jsx` inside `updateTask` / `moveTask`.

#### 3.5 Saved search filters
**What:** In the CmdK search, allow saving the current filter (client + tag + status combination) as a named Saved View that persists to the data file.  
**Where:** Extend the `SAVED_VIEWS` constant into the persisted store. Add a "Save this filter" button in the filter bar.

#### 3.6 Dark mode auto-detect
**What:** On first load, read `window.matchMedia('(prefers-color-scheme: dark)')` and set the theme accordingly. Still allow manual override.  
**Where:** `app.jsx` TWEAK_DEFAULTS — replace `"theme": "light"` with a computed default.

#### 3.7 Portfolio / health view
**What:** A new "Portfolio" page showing all clients as rows with columns: Open tasks, Overdue, Hours this week, Budget burn %, Last activity.  
**Where:** New view `PortfolioView` in `views.jsx`. Nav item in `ui.jsx` sidebar.

---

### PHASE 4 — Future / longer-term

| Feature | Notes |
|---|---|
| File attachments on tasks | Store files in a `/uploads` folder on the server; save paths in `task.attachments[]` |
| Comment reactions | Add `reactions: [{emoji, userId}]` to the comment shape; render emoji counts |
| Calendar sync (Google Cal) | Use Google Calendar API; sync task due dates as all-day events |
| Mobile PWA | Add a `manifest.json` and service worker for offline support and "Add to Home Screen" |
| Guest / client portal | Serve a read-only filtered view scoped to one client behind a UUID token URL |
| AI task summaries | Call Claude API to summarise task activity log or generate a status update |
| Slack notifications | Post to a webhook when a task is created, completed, or overdue |
| Electron packaging | Use `reference-implementation/electron-main.js` to ship as a native .exe/.app |

---

## 4. Beginner Setup Guide — Windows Desktop

This section is for people who have never used a terminal before. Follow every step in order.

---

### Step 1 — Install Node.js

Node.js is the engine that runs Helm's server on your computer. You only do this once.

1. Open your browser and go to **https://nodejs.org**
2. Click the big green button labelled **"LTS" (recommended for most users)**
3. A file called something like `node-v20.x.x-x64.msi` will download
4. Open that file once the download finishes (it is in your Downloads folder)
5. Click **Next** on every screen — the defaults are all correct
6. Click **Finish** when it completes

> **How to check it worked:** Press the **Windows key**, type `cmd`, and press Enter. A black window opens. Type `node --version` and press Enter. You should see a number like `v20.11.0`. If you do, Node.js is installed.

---

### Step 2 — Download or locate the Helm folder

If you received the project as a zip file:

1. Find `helm-main.zip` (or similar) in your Downloads folder
2. Right-click it and choose **Extract All…**
3. Choose a location you can find easily, like your Desktop
4. Click **Extract**

If you cloned it from GitHub, the folder is wherever you cloned it (likely `C:\Users\YourName\helm`).

In this guide, we assume the folder is at:  
`C:\Users\chewj\OneDrive\Desktop\Claude Code Files\design_handoff_helm`

---

### Step 3 — Start Helm

1. Open **File Explorer** (the folder icon in your taskbar)
2. Navigate to the Helm folder (the one that contains `start.bat`, `server.js`, and a folder called `design-reference`)
3. You should see a file called **`start.bat`**
4. **Double-click `start.bat`**

A black window will open and show messages like:

```
Installing dependencies...
Helm is running at http://localhost:3000
```

> **Important:** Leave this black window open while you use Helm. Closing it stops the server.

---

### Step 4 — Open Helm in your browser

1. Open your browser (Chrome, Edge, Firefox — any of them)
2. Click the address bar at the top
3. Type exactly: `http://localhost:3000`
4. Press **Enter**

Helm will load and show the dashboard. Your data is saved automatically — if you close the browser and come back, everything will still be there.

---

### Step 5 — Stop Helm

When you are finished for the day:

1. Click the black `start.bat` window in your taskbar
2. Press **Ctrl + C** (hold Ctrl, then press the letter C)
3. The server stops. It is safe to close the window.

---

### Troubleshooting

**"node is not recognised as an internal or external command"**  
Node.js did not install correctly. Repeat Step 1. After installation, close and reopen the black window and try again.

**The black window closes immediately after double-clicking start.bat**  
Right-click `start.bat` and choose **"Run as administrator"**. If it still closes, open File Explorer, right-click the address bar, choose "Open in Terminal", and type `node server.js` and press Enter to see the error.

**"Cannot GET /"** in the browser  
The server started but the static files are in the wrong place. Make sure you are running `start.bat` from inside the `design_handoff_helm` folder, not from inside `design-reference/`.

**Port 3000 is already in use**  
Something else is using port 3000. Close other apps or restart your computer and try again.

**Data disappeared**  
If you reset data from the Tweaks panel, the seed data reloads. If `helm-data.json` was deleted manually, the server falls back to the example data. Your data is safe as long as `helm-data.json` exists in the Helm folder.

---

## 5. Running the app (developer shortcut)

```bash
npm install     # first time only
npm start       # starts Express on http://localhost:3000
```

Or double-click `start.bat` on Windows.

Data is auto-saved to `helm-data.json`. To reset to the sample workspace, click the **Tweaks panel → Reset all data** button in the bottom-right of the UI.

---

## 6. Data persistence — how it works and future hosting options

### How your data is saved right now

Every change you make (new task, new client, timer stop) is sent to the Express server and written to **`helm-data.json`** — a plain file on your hard drive inside the Helm project folder.

**This has nothing to do with the browser.** Clearing cookies, clearing browser cache, switching browsers — none of that affects your data. The file lives on disk, not in Chrome.

### What can actually destroy your data

| Risk | Effect |
|---|---|
| Deleting `helm-data.json` manually | Gone permanently |
| Hard drive failure | Gone permanently |
| Clicking "Reset all data" in the Tweaks panel | Resets to seed data |
| Closing start.bat mid-save | Rare — a flush runs on tab close via `beforeunload` |

### Option A — OneDrive auto-backup (5 minutes, free)

Add a Windows Scheduled Task that copies `helm-data.json` to your OneDrive folder every hour. No infrastructure, no code changes. Protects against accidental deletion and drive failure.

### Option B — Deploy to a cloud server (recommended for multi-device access)

Host the whole app on Railway, Render, or Fly.io (all have free tiers). The server runs 24/7 in the cloud, the data lives on the cloud server's disk, and you access Helm from any browser on any device via a real URL instead of `localhost:3000`.

**Steps (roughly):**
1. Push repo to GitHub (already done)
2. Connect Railway/Render to the GitHub repo
3. Set start command to `node server.js`
4. Add a persistent disk volume (so `helm-data.json` survives deploys)

### Option C — Hosted database (most robust)

Replace the `helm-data.json` file writes in `server.js` with calls to **Supabase** (free hosted PostgreSQL). Data lives in Supabase's cloud, accessible from anywhere, with full backup and point-in-time recovery.

**Steps (roughly):**
1. Create a free Supabase project
2. Create a single `helm_data` table with a `payload JSONB` column
3. Swap the `fs.readFileSync` / `fs.writeFileSync` calls in `server.js` for Supabase client calls
4. Remove the `helm-data.json` dependency entirely

**Cost:** Free tier covers this app with room to spare.

---

## 7. File reference

| File | Purpose |
|---|---|
| `server.js` | Express server: static file serving + `/api/data` persistence |
| `design-reference/Helm.html` | App entry point — open this or visit `http://localhost:3000` |
| `design-reference/app.jsx` | All state, API wiring, CRUD handlers |
| `design-reference/ui.jsx` | Sidebar, Topbar, TaskPanel, FloatingTimer, CmdK, all primitives |
| `design-reference/views.jsx` | The 10 main views |
| `design-reference/templates.jsx` | Project Templates feature |
| `design-reference/data.jsx` | Seed data and domain constants |
| `design-reference/styles.css` | All design tokens — edit here to change colours/spacing/type |
| `reference-implementation/` | Production-ready Electron + Vite + TypeScript snippets |
