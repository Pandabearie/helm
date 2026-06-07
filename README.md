# Handoff: Helm — Practice Management App (with local JSON persistence)

## Overview

**Helm** is a single-user program/project management app for a freelancer or consultant juggling many clients. Think Asana/Linear, but built around *clients* and *billable time* rather than a single team backlog. This bundle contains a complete, working **HTML/React prototype** of the entire UI plus a precise spec for turning it into a real desktop app whose data lives in a **single JSON file** that the user keeps on their Desktop or in a Google-Drive-synced folder.

The headline behavior the user wants from the production build:

> On startup, the app **reads a `.json` file from a folder the user chooses**. While the app runs, edits are kept in memory (and autosaved). When the app **closes, it writes the `.json` file back**. Putting that folder inside Google Drive (or Dropbox/iCloud) gives cross-device sync "for free."

This is fundamentally a **local-first desktop app**, so the recommended target is **Electron** (ships a real `.exe`/`.app`, can read/write arbitrary local files, runs offline). Tauri is a lighter alternative if the developer prefers Rust/smaller binaries. A pure browser web app **cannot** silently read/write a chosen local file on every launch/close, so it is not suitable for the stated requirement (see `ARCHITECTURE.md` for the full rationale and a fallback).

## About the Design Files

The files in `design-reference/` are a **design reference created in HTML** — a high-fidelity, fully interactive prototype showing the intended look, layout, and behavior. **They are not the production codebase.** The prototype is a single page that loads React + Babel from a CDN and transpiles JSX in the browser (fine for a mock, wrong for production).

Your job is to **recreate this design in a real, production-grade environment**: a Vite + React + TypeScript app packaged with Electron, with the in-browser Babel removed, the data layer swapped from `localStorage` to the JSON-file sync described here, and the code split into proper modules/components. Reuse the prototype's CSS (it is already clean, token-driven, and framework-agnostic) and port the JSX components close to verbatim — the visual design is **final** and should be reproduced faithfully.

There is no pre-existing codebase to conform to, so you are choosing the stack. The recommended stack is spelled out in `ARCHITECTURE.md`; follow it unless you have a strong reason not to.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, interactions, light/dark theming, and animations are all defined. Recreate the UI pixel-for-pixel. All design tokens are in `design-reference/styles.css` (`:root` and `[data-theme="dark"]`) and summarized in `DESIGN_TOKENS.md`.

## What's in this bundle

```
design_handoff_helm/
├── README.md              ← you are here: product + scope + screen specs
├── ARCHITECTURE.md        ← recommended stack, Electron JSON-sync design, why local-first
├── DATA_MODEL.md          ← the exact JSON schema the app reads/writes + migration map
├── DESIGN_TOKENS.md       ← colors, type, spacing, radii, shadows, motion
├── reference-implementation/
│   ├── electron-main.js   ← drop-in Electron main process: pick folder, read on open, write on quit
│   ├── preload.js         ← secure IPC bridge exposed to the renderer
│   ├── store.ts           ← renderer-side data store: load/save/autosave, mirrors prototype state
│   └── helm-data.example.json  ← a valid data file (the seed workspace) to test against
└── design-reference/      ← the HTML prototype (look + behavior source of truth)
    ├── Helm.html          ← entry; open in a browser to interact with the full app
    ├── styles.css         ← ALL design tokens + component styles (reuse this nearly verbatim)
    ├── data.jsx           ← seed/sample data + domain constants (clients, tags, statuses…)
    ├── ui.jsx             ← primitives: Icon set, Avatar, Sidebar, Topbar, TaskPanel, CmdK, FloatingTimer, ProfileModal, toasts
    ├── views.jsx          ← the 10 views (Overview, List, Board, Calendar, Timeline, Clients, MyTasks, Reports, Timesheet, Inbox)
    ├── app.jsx            ← top-level state, persistence wiring, keyboard shortcuts, Tweaks panel
    └── tweaks-panel.jsx   ← the in-prototype "Tweaks" control panel (DEV/preview tool — do NOT ship; see note)
```

> **Do not ship `tweaks-panel.jsx`.** It is a prototype-only affordance for previewing theme/accent/density. In production, expose those as real Settings (theme + accent + density already map to the `profile`/preferences object — see `DATA_MODEL.md`).

---

## Domain model (plain English)

- **Task** — the core unit. Has title, status, priority (P1/P2/P3), an optional **client**, any number of **tags**, assignees (array — single-user today but built for teams), a **due date**, an optional **start date** (used by the Timeline/Gantt), a time **estimate** (minutes) and **logged** time (minutes), a description, **subtasks** (checklist), **comments**, an **activity** log, and an optional **recurring** cadence.
- **Client** — e.g. "Halcyon Health." Has a color, initials, an hourly **rate**, a monthly **retainer**, and a short brief. **A client behaves as a special tag**: tasks reference one client, and the Clients view groups everything by it.
- **Tag** — user-defined label with a color (Design, Development, Billing, Urgent…). Tasks can have many.
- **Time entry** — a logged work session: which task, which client, duration (minutes), date, note. Produced by the floating timer or manual entry; powers the Timesheet and Reports.
- **Inbox item** — a notification (mention, assignment, due-soon, comment, status change) linked to a task.
- **Profile** — the single user: name, initials, role. Editable in-app.

Full field-by-field schema with types is in `DATA_MODEL.md`.

---

## Screens / Views

The app is a fixed two-pane shell: a **left sidebar** (brand, primary nav, client list, tag list, saved views, profile) and a **main area** (a topbar with breadcrumbs + search + new-task, then the active view). A **floating timer** sits bottom-right above everything. Modals: Command-K search, Quick-add, Profile, and a slide-in **Task detail panel** from the right.

Exact measurements, colors, and type for every element are in `styles.css`; the per-view notes below describe layout and intent.

### 1. Overview (home dashboard)
- **Purpose:** Morning landing page — what's due, what's in flight, time + money this week.
- **Layout:** Serif greeting ("Good afternoon, {firstName}.") + date/summary line. Then a 4-up row of **stat cards** (Due today, In progress, Tracked today, Billable this week) each with a sparkline. Below: a 2-column grid (`minmax(0,2fr) / minmax(0,1fr)`). Left column = "Today's focus" (overdue + due-today + in-progress, max 8 rows, with an overdue banner) and a 7-day "This week ahead" strip. Right column = "Activity" feed (recent comments/status changes) and "Active clients" list.
- **Notes:** Billable assumes a blended $150/hr in the prototype; in production compute from each client's `rate`.

### 2. My Tasks
- **Purpose:** Everything assigned to me, time-bucketed.
- **Layout:** Buckets in order: **Overdue**, **Today**, **This week**, **Later**, **No due date**, **Completed**. Each bucket is a card with a section header (label + count) and task rows. Rows have a round checkbox (toggles done), title, client tag, priority pill, relative due, and a play button to start the timer.

### 3. Inbox
- **Purpose:** Notifications.
- **Layout:** Header with unread count + "Mark all read." List of items; unread rows have a left accent dot and slightly stronger background. Each row: kind icon, actor + message, the task it's about, client tag, relative time. Clicking marks read and opens the task.

### 4. List
- **Purpose:** Dense, groupable table of all tasks.
- **Layout:** A table with a header row and **group sections**. The grouping is switchable from the topbar segmented control: **Status** (default), **Client**, or **Priority**. Columns: checkbox · title (+ subtask count, recurring icon) · tags (client tag + first tag) · priority · due · logged time · timer button. Row grid template: `28px minmax(0,1fr) minmax(0,200px) 90px 90px 70px 32px`.

### 5. Board (Kanban)
- **Purpose:** Drag tasks across workflow stages.
- **Layout:** 5 columns — **Backlog, In Progress, In Review, Blocked, Done** — each 300px, horizontally scrolling, max-height `calc(100vh - 130px)`. Cards show client + tags, title, subtask progress, priority pill, relative due, logged time, assignee avatars. **Native HTML5 drag-and-drop**: dragging a card to a column sets its status and appends an activity entry. Drop target highlights (`.kb-col-body.over`). This is the most important interaction to preserve.

### 6. Calendar
- **Purpose:** Monthly view of due dates.
- **Layout:** Month grid, weeks start **Monday**. Day cells (min-height 110px) list up to 4 task chips colored by priority (P1/P2) or client; "+N more" overflow. Today's number is an accent pill. Prev/Today/Next controls.

### 7. Timeline (Gantt)
- **Purpose:** Scheduling across a date range, grouped by client.
- **Layout:** Left label column (260px) + a horizontally scrolling day grid (day width 36px, range −7 to +28 days from "today"). Weekends and "today" columns are tinted. Each task with both `start` and `due` renders a colored **bar** (client color) spanning those days, with a translucent overlay showing logged/estimate progress. Client group headers separate the rows.

### 8. Clients
- **Purpose:** The client-centric view — pick a client, see all their work.
- **Layout — gallery:** Responsive cards (min 320px). Each: colored avatar, name, brief, stat row (Open / Overdue / Hours-this-week / Retainer), and the 3 most recent open tasks. **Detail (click a card):** header with big avatar, name, brief, and a stat strip (Rate, Retainer, Hours this week, Billable). Then a 5-up status-count row, then the full task list (reuses the List view grouped by status). A back button returns to the gallery. The sidebar client list and ⌘K also deep-link here.

### 9. Timesheet
- **Purpose:** Weekly time + billing.
- **Layout:** Header with week label + Total hours and Billable $. A **matrix**: rows = clients, columns = Mon–Sun, cells = hours (chip colored by client), plus a per-client weekly total + $ (hours × client rate). A "Daily total" footer row. Below: "Recent entries" table (date, note + task, client, duration, billable).

### 10. Reports
- **Purpose:** Analytics.
- **Layout:** 4 stat cards (Hours logged, Billable revenue, Tasks completed, Avg cycle time) then a responsive grid of cards: **Hours by client** (bars), **Time by tag** (bars), **Daily tracked hours** (column chart), **Status mix** (stacked bar + legend), **Weekly throughput** (columns), **Utilization** (SVG donut, 72% of a 40h target). Charts are hand-rolled SVG/divs — reproduce as-is or swap for the codebase's chart lib.

### Task detail panel (slide-in, used by every view)
- **Purpose:** Read/edit one task. **This is where most of the recent feature work lives — recreate it carefully.**
- **Layout:** 520px panel sliding from the right over a dimmed overlay. Header: status button (cycles todo→progress→review→done), recurring chip, timer play/pause, a **"⋯ more" menu** (Mark complete, Make/clear recurring, **Delete task**), close. Body: editable **title**; a meta block with **editable Client** (popover picker), **editable Priority** (popover), Assignees (avatar stack), **editable Due date** (native date input + clear button + relative label), **editable Time estimate** (number input, minutes) alongside logged time, and **editable Tags** (removable chips with an "x" on hover + an "+ tag" popover listing all tags). Then editable description, **Subtasks** (checkbox + inline-rename + hover-delete "x" + add row), an **Activity** log, and **Comments** (own comments are deletable; new-comment composer).
- **Delete safety:** "Delete task" opens a **confirm modal** ("Delete task? … subtasks, comments, and time entries will also be removed"). On confirm, the task and its time entries/inbox items are removed and a toast appears.

### Global chrome
- **Sidebar:** brand "Helm.", "{firstName}'s practice" subtitle, primary nav (Overview, My Tasks, Inbox w/ unread badge, List, Board, Calendar, Timeline, Clients, Timesheet, Reports), a **Clients** list (color swatch + open count, click to filter/deep-link), a **Tags** list (click to filter), Saved Views, and a **profile button** at the bottom (avatar + name + role → opens Profile modal). Collapsible to a 64px icon rail.
- **Topbar:** sidebar toggle, breadcrumbs, optional view controls (e.g. List grouping segmented control), **search trigger (⌘K)**, theme toggle (sun/moon), **+ New task**.
- **Command-K** (`⌘K`/`Ctrl-K`): fuzzy search across tasks + clients + "jump to view," arrow-key navigation, Enter to open/navigate.
- **Quick-add** (`⌘N`/`Ctrl-N` or + New task): title field + inline client/priority/date/tag pickers.
- **Profile modal:** edit **name**, **initials** (auto-derived from name, overridable), and **role**. Saves to `profile` and updates the greeting, avatars, and "{firstName}'s practice" everywhere.
- **Floating timer:** bottom-right pill. Start from any task's play button; shows running task + live `HH:MM:SS`; pause **commits** a time entry (rounded to the minute) to that task's logged total and the timesheet. Switching tasks auto-commits the previous session.

---

## Interactions & Behavior (must-haves)

1. **Editable-everywhere task panel** — title, client, priority, due date, estimate, tags, description, subtasks, comments all persist on change. (User explicitly asked for high fidelity *after* creation — every field stays editable.)
2. **Delete** — tasks (with confirm modal) and subtasks (hover "x", no confirm); deleting a task cascades to its time entries + inbox items. Own comments deletable.
3. **Tag editing from the task** — add via "+ tag" popover, remove via hover-"x" on each chip.
4. **Drag-and-drop Kanban** — sets status + logs activity.
5. **Time tracking** — floating timer start/stop/switch; commits time entries; feeds Timesheet + Reports.
6. **Profile editing** — name/initials/role, reflected app-wide.
7. **Keyboard** — `⌘K` search, `⌘N` quick-add, `Esc` closes panel/modals.
8. **Theme** — light/dark via `data-theme` on `<html>`; **accent color** via CSS variables (6 presets); **density** toggles base font-size. Persist these as user preferences.
9. **Fluidity** — changes apply instantly with subtle motion: panel slide (0.22s cubic-bezier), popover pop-in, toast in/out, row fade-in. Keep these.

## State Management

The entire app state is five collections + UI state:

```
data = { profile, tasks[], timeEntries[], inbox[], meta }   // <- this is what gets persisted to JSON
ui   = { view, openTaskId, filters, timer, modals, toasts }  // <- ephemeral, not persisted
```

In the prototype, `app.jsx` holds these in React state and **mirrors `data` to `localStorage`** (debounced 400ms + flush on `beforeunload`). For production, **replace that mirror with the JSON-file store** in `reference-implementation/store.ts` — same shape, same lifecycle, different sink. Everything else (views, panel, timer) is unchanged because they only read/patch the in-memory `data`.

See `DATA_MODEL.md` for the schema and `ARCHITECTURE.md` for the read-on-open / write-on-quit wiring.

## Assets

No external image assets. All icons are inline SVG in a single `Icon` component (`ui.jsx`) — copy it verbatim. Fonts are Google Fonts: **Geist** (UI), **Geist Mono** (numbers/time), **Instrument Serif** (display/greetings). Avatars are generated gradients from user initials. Charts are hand-rolled SVG/CSS.

## Files

See the tree above. Start by opening `design-reference/Helm.html` in a browser to feel the product, then read `ARCHITECTURE.md` → `DATA_MODEL.md` → `reference-implementation/*`, then port view-by-view from `views.jsx` / `ui.jsx`, reusing `styles.css` wholesale.
