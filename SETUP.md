# Helm — Setup, Debug Findings & Roadmap

This document covers three things:
1. **Known bugs** — dead buttons and broken wiring found in the current codebase
2. **Gap analysis** — features Asana and Monday.com have that Helm is missing
3. **Suggested additions** — a prioritised backlog of what to build next, with implementation notes

---

## 1. Known Bugs & Dead Wiring

The audit below was run against `design-reference/` (ui.jsx, views.jsx, app.jsx, templates.jsx).

### 1.1 Buttons that render but do nothing

| Component | File | Issue |
|---|---|---|
| Sidebar → Clients "+" button | `ui.jsx` ~line 208 | Renders with `title="Manage"` but has no `onClick`. Should open a "New client" modal. |
| Sidebar → Tags "+" button | `ui.jsx` ~line 231 | Same — no `onClick`. Should open a "New tag" modal. |
| Kanban column "+" button | `views.jsx` ~line 281 | Each column has a `+` icon button with no handler. Should quick-add a task pre-set to that column's status. |

### 1.2 Saved Views — completely non-functional

All four Saved View items in the sidebar ("Due this week", "P1 across clients", "Blocked", "Billing & admin") are rendered as `<button>` elements with no `onClick`. Clicking them does nothing.

**Fix needed:** Each saved view should apply a preset filter (status, priority, tags) to the List view and navigate there.

### 1.3 Assignees field is read-only

In the Task detail panel (`ui.jsx` ~line 608), the Assignees row renders as a plain `<AvatarStack>` with no click handler. There is no way to add or change assignees from the UI.

**Fix needed:** Clicking the assignee area should open a picker popover (same pattern as the client and tag pickers).

### 1.4 FloatingTimer "Resume" button disabled with no feedback

When the timer has no active task (`timer.taskId === null`), the Resume button is `disabled` with no explanation. Users have no way to know they need to start a timer from a task first.

**Fix needed:** When disabled, show a tooltip or inline hint: "Start a timer from any task to begin tracking."

### 1.5 Silent timer stop logs no time entry

When switching tasks mid-session, `stopTimer(true)` is called with `silent = true`, which skips creating a `timeEntry`. The elapsed time is committed to the task's `logged` field but leaves no record in the timesheet.

**Fix needed:** Remove the `silent` flag and always create a time entry, OR show the elapsed time in a toast so the user knows it was counted.

### 1.6 No way to create or edit Clients or Tags from the UI

Clients and Tags are currently hardcoded in `data.jsx` seed data. The app has no screens or modals for adding, editing, or deleting clients or tags. This means the only way to change them is to directly edit `helm-data.json`.

**Fix needed:** New client modal (name, color, rate, retainer, brief) and new tag modal (name, color). This is a critical gap — the app is unusable for a real workspace without it.

---

## 2. Gap Analysis vs. Asana & Monday.com

Features grouped by priority for a solo freelancer.

### 🔴 Critical gaps (blocks real use)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| Create / edit / delete Clients | ✅ | ✅ | ❌ Hardcoded seed data only |
| Create / edit / delete Tags | ✅ | ✅ | ❌ Hardcoded seed data only |
| Edit Assignees on a task | ✅ | ✅ | ❌ Read-only display |
| Functional Saved Views / filters | ✅ | ✅ | ❌ Buttons exist, do nothing |
| Invoice generation or export | ✅ (via integrations) | ✅ (native CRM) | ❌ Not present |

### 🟠 High-value gaps (commonly used daily)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| Task dependencies (blocked by / blocking) | ✅ | ✅ | ❌ |
| Milestones | ✅ | ✅ | ❌ |
| Bulk task editing (multi-select) | ✅ | ✅ | ❌ |
| Convert comment to task | ✅ | ✅ | ❌ |
| Billable vs. non-billable time flag per entry | ✅ | ✅ | ❌ Always treated as billable |
| Budget tracking (hours remaining vs. estimate) | ✅ | ✅ | ❌ |
| Due date reminders / push alerts | ✅ | ✅ | ❌ Inbox notifications are static |
| Duplicate task | ✅ | ✅ | ❌ |
| Manual time entry (add time without timer) | ✅ | ✅ | ❌ Timer only |
| Global search with saved filters | ✅ | ✅ | ⚠️ CmdK exists but no saved filter state |
| Drag-to-reorder tasks within a list | ✅ | ✅ | ❌ |
| Portfolio / cross-client health view | ✅ | ✅ | ❌ |
| Client intake form → auto-creates tasks | ✅ | ✅ | ❌ |

### 🟡 Medium-value gaps (differentiators)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| Recurring task cadence editor (UI) | ✅ | ✅ | ⚠️ Field exists in data model, no UI to set it |
| Automation rules (when X → then Y) | ✅ | ✅ | ❌ |
| Timesheet approval workflow | ✅ | ✅ | ❌ |
| Docs / notes layer per client or project | ✅ | ✅ | ❌ |
| File attachments on tasks | ✅ | ✅ | ❌ |
| Comment reactions (emoji) | ✅ | ✅ | ❌ |
| Dark mode system-preference auto-detect | ✅ | ✅ | ⚠️ Toggle exists, no `prefers-color-scheme` auto |
| Calendar two-way sync (Google Cal) | ✅ | ✅ | ❌ |
| Mobile app | ✅ | ✅ | ❌ Web only |
| Template variable substitution (fill dates/client on apply) | ✅ | ✅ | ⚠️ Templates apply tasks but don't auto-fill dates |
| Status update / project health posts | ✅ | ✅ | ❌ |
| Workload / capacity view | ✅ | ✅ | ❌ |

### 🟢 Nice-to-have (power user / future)

| Feature | Asana | Monday | Helm status |
|---|---|---|---|
| AI task summaries | ✅ | ✅ | ❌ |
| AI-generated project templates | ✅ | ✅ | ❌ |
| Zapier / webhook automations | ✅ | ✅ | ❌ |
| E-signature integration (DocuSign, PandaDoc) | ✅ | ✅ | ❌ |
| Guest / client portal (view-only share link) | ✅ | ✅ | ❌ |
| iOS / Android app | ✅ | ✅ | ❌ |
| Slack integration | ✅ | ✅ | ❌ |

---

## 3. Suggested Additions — Prioritised Backlog

Each item below includes what to build and where it slots into the existing architecture.

---

### PHASE 1 — Fix what's broken (do this first)

#### 1.1 Client CRUD modal
**What:** A "New / Edit client" modal with fields: Name, Color picker, Initials (auto-derived), Hourly rate, Monthly retainer, Brief.  
**Where:** Triggered by the already-present sidebar "+" button (`ui.jsx` line 208). Add `onCreateClient` / `onUpdateClient` / `onDeleteClient` handlers in `app.jsx`. Persist to `helm-data.json` alongside tasks.  
**Note:** `CLIENTS` is currently a constant in `data.jsx` — it needs to move to the persisted store.

#### 1.2 Tag CRUD modal
**What:** A "New / Edit tag" modal with Name and a color swatch picker (reuse the 8 preset colors from the design tokens).  
**Where:** Triggered by the sidebar "+" button (`ui.jsx` line 231). Same pattern as 1.1. Move `TAGS` to persisted store.

#### 1.3 Wire Saved Views
**What:** Each of the 4 saved views should apply a preset filter to the List view. "Due this week" → filter tasks due within 7 days. "P1 across clients" → filter priority=p1. "Blocked" → filter status=blocked. "Billing & admin" → filter tags includes t-billing or t-admin.  
**Where:** Add an `onClick` to each saved view button in `ui.jsx`. Pass a `savedView` state to `app.jsx` and apply it in `filteredTasks`.  
**Note:** Eventually saved views should be user-editable (name + filter config stored in the data file).

#### 1.4 Assignee picker on Task Panel
**What:** Clicking the Assignees row in TaskPanel opens a popover listing `ALL_USERS`. Toggle-select adds/removes from `task.assignees`.  
**Where:** `ui.jsx` TaskPanel, ~line 608. Reuse the same popover pattern already used for client and tag pickers.

#### 1.5 Kanban column "+" quick-add
**What:** Clicking the "+" on a Kanban column opens the Quick-add modal pre-populated with that column's status.  
**Where:** `views.jsx` KanbanView, ~line 281. Pass `onQuickAdd(status)` down and call `setQuickAddOpen(true)` with a default status.

---

### PHASE 2 — Core missing features (highest daily value)

#### 2.1 Duplicate task
**What:** "Duplicate task" option in the Task Panel "⋯" menu. Copies all fields except activity log and comments.  
**Where:** `app.jsx` already has a stub `duplicateTask` handler (referenced in old TODO comments). Wire it up in the panel menu in `ui.jsx`.

#### 2.2 Manual time entry
**What:** An "Add time" button in the Task Panel (next to the logged time field) that opens a small form: duration (HH:MM), date, note. Creates a `timeEntry` and increments `task.logged`.  
**Where:** Add to `ui.jsx` TaskPanel. Handler already exists (`setTimeEntries`) in `app.jsx`.

#### 2.3 Billable / non-billable flag on time entries
**What:** Each time entry and the floating timer gets a toggle: billable (default on) / non-billable.  
**Where:** Add `billable: true` to the `timeEntry` shape in `data.jsx`. Update Timesheet and Reports to only sum billable hours for revenue figures.

#### 2.4 Recurring task UI
**What:** The data model already has a `recurring` field. Add a UI to set it: a dropdown in the Task Panel "⋯" menu (None / Daily / Weekly / Monthly / Quarterly). When a recurring task is marked Done, automatically create the next occurrence.  
**Where:** `ui.jsx` TaskPanel "⋯" menu. Logic in `app.jsx` `toggleDone`.

#### 2.5 Task dependencies
**What:** A "Blocked by" field on each task — a multi-select task picker. Show a visual indicator (lock icon) on blocked tasks throughout List and Board views.  
**Where:** Add `blockedBy: []` to the task schema. Add a picker in `ui.jsx` TaskPanel. Add a `StatusDot` variant for blocked-by in `views.jsx`.

#### 2.6 Budget tracking per client
**What:** Show estimated vs. logged hours on the Client detail view. Add a progress bar: `logged / (retainer / rate * 60)` minutes. Colour goes amber at 80%, red at 100%.  
**Where:** `views.jsx` ClientsView detail section. Data already available (client.rate, client.retainer, task.logged).

#### 2.7 Drag-to-reorder tasks in List view
**What:** Native HTML5 drag-and-drop reordering within each group section of the List view. Persist the order to the data file.  
**Where:** `views.jsx` ListView. Add a `order` field to each task (integer). Sort by `order` in list rendering.

---

### PHASE 3 — High-value additions (power up the app)

#### 3.1 Client notes / docs layer
**What:** A rich-text notes field per client — a free-form scratchpad for briefs, meeting notes, and context. Not linked to tasks.  
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
**What:** A new "Portfolio" page showing all clients as rows with columns: Open tasks, Overdue, Hours this week, Budget burn %, Last activity. Think a spreadsheet-style health dashboard.  
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

## 4. Running the app

```bash
npm install     # first time only
npm start       # starts Express on http://localhost:3000
```

Or double-click `start.bat` on Windows.

Data is auto-saved to `helm-data.json`. To reset to the sample workspace, click the **Tweaks panel → Reset all data** button in the bottom-right of the UI.

---

## 5. File reference

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
