# Data Model — `helm-data.json`

This is the **single file** the app reads on startup and writes on quit. Keep it human-readable (pretty-printed) so it can live in a sync folder and survive the occasional manual peek/edit. All dates are **ISO 8601 strings** (`"2026-05-28"` for dates, full ISO for timestamps). All durations are **integer minutes**. All IDs are strings.

## Top-level shape

```jsonc
{
  "meta": {
    "version": 1,            // schema version — drive migrations off this
    "savedAt": "2026-05-28T17:04:00.000Z",
    "app": "helm"
  },
  "profile": { /* the single user + preferences */ },
  "clients": [ /* Client[] */ ],
  "tags":    [ /* Tag[] */ ],
  "tasks":   [ /* Task[] */ ],
  "timeEntries": [ /* TimeEntry[] */ ],
  "inbox":   [ /* InboxItem[] */ ],
  "users":   [ /* User[] — collaborators; single-user today, array for future teams */ ]
}
```

> The prototype's in-memory store currently tracks `{ profile, tasks, timeEntries, inbox, meta }` and treats `clients`/`tags`/`users` as constants in `data.jsx`. **For production, promote `clients`, `tags`, and `users` into the JSON file** so the user can create/edit/delete them (the user explicitly wants custom tags and clients). The UI already references them by id, so this is additive.

## TypeScript types (use these in `src/`)

```ts
export type ID = string;
export type ISODate = string;       // "2026-05-28"
export type ISODateTime = string;   // "2026-05-28T17:04:00.000Z"
export type Minutes = number;       // integer

export type Status   = "todo" | "progress" | "review" | "blocked" | "done";
export type Priority = "p1" | "p2" | "p3";
export type Recurring = null | "daily" | "weekly" | "monthly" | "quarterly";

export interface Profile {
  id: ID;                 // "u-me"
  name: string;
  initials: string;       // 1–2 chars, auto-derived from name but overridable
  role: string;           // "Owner", "Founder", …
  preferences: {
    theme: "light" | "dark";
    accent: string;       // hex, one of the 6 presets (see DESIGN_TOKENS.md)
    density: "comfy" | "compact";
    sidebarCollapsed: boolean;
    showFloatingTimer: boolean;
    dataFolder?: string;  // optional mirror of the chosen path (source of truth is Electron config)
  };
}

export interface Client {
  id: ID;                 // "c-halcyon"
  name: string;
  color: string;          // hex, used for swatches/tags/gantt bars
  initials: string;       // 2 chars for the avatar tile
  rate: number;           // billable $/hour
  retainer: number;       // monthly $ (0 = none / one-off)
  brief: string;          // one-line description
}

export interface Tag {
  id: ID;                 // "t-design"
  name: string;
  color: string;          // hex
}

export interface User {   // collaborators (future multi-user); profile is the current user
  id: ID;                 // "u-jm"
  name: string;
  initials: string;
}

export interface Subtask {
  id: ID;
  title: string;
  done: boolean;
}

export interface Comment {
  id: ID;
  user: ID;               // author id ("u-me" = the profile user)
  text: string;
  at: ISODateTime;
}

export interface Activity {
  kind: "create" | "status" | "comment" | "edit";
  text: string;           // e.g. "moved to In Review"
  user: ID;
  at: ISODateTime;
}

export interface Task {
  id: ID;
  title: string;
  status: Status;
  priority: Priority;
  client: ID | null;      // -> Client.id
  tags: ID[];             // -> Tag.id[]
  assignees: ID[];        // -> User.id[] (["u-me"] today; array for teams)
  due: ISODate | null;
  start: ISODate | null;  // used by Timeline/Gantt; null = not scheduled
  estimate: Minutes;      // planned effort
  logged: Minutes;        // accumulated tracked time (sum of this task's TimeEntry durations)
  description: string;
  subtasks: Subtask[];
  comments: Comment[];
  activity: Activity[];
  recurring: Recurring;
  createdAt: ISODateTime;
}

export interface TimeEntry {
  id: ID;
  task: ID;               // -> Task.id
  client: ID | null;      // denormalized from the task at log time (-> Client.id)
  duration: Minutes;
  date: ISODate;
  note: string;
}

export type InboxKind = "mention" | "assigned" | "due" | "comment" | "status";
export interface InboxItem {
  id: ID;
  kind: InboxKind;
  who: ID | null;         // actor (null for system notices like "due soon")
  task: ID;               // -> Task.id
  text: string;
  at: ISODateTime;
  read: boolean;
}

export interface HelmData {
  meta: { version: number; savedAt: ISODateTime; app: "helm" };
  profile: Profile;
  clients: Client[];
  tags: Tag[];
  users: User[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  inbox: InboxItem[];
}
```

## Referential integrity / invariants

- `task.client` is `null` or an existing `Client.id`. **Deleting a client** should either block while tasks reference it, or null those tasks' `client` (prototype assumes the latter is acceptable — your call, but be consistent).
- `task.tags[]` only contains existing `Tag.id`s. Deleting a tag removes it from all tasks.
- **Deleting a task** cascades: remove its `TimeEntry`s (those with `entry.task === task.id`) and its `InboxItem`s. The prototype already does this in `deleteTask`.
- `task.logged` should equal the sum of its time entries' durations. The timer increments both together; if you ever recompute, derive `logged` from `timeEntries`.
- `TimeEntry.client` is denormalized for fast Timesheet/Reports grouping; keep it in sync with the task's client at log time.

## Migration strategy

Stamp every file with `meta.version`. On read, run an ordered list of forward migrations until the file matches the current app version, then load. Example:

```ts
const MIGRATIONS: ((d: any) => any)[] = [
  // v0 -> v1: prototype localStorage shape -> file shape
  (d) => ({
    meta: { version: 1, savedAt: new Date().toISOString(), app: "helm" },
    profile: { ...d.profile, preferences: d.preferences ?? defaultPrefs },
    clients: d.clients ?? SEED.clients,   // promote constants into the file
    tags:    d.tags    ?? SEED.tags,
    users:   d.users   ?? SEED.users,
    tasks: d.tasks ?? [], timeEntries: d.timeEntries ?? [], inbox: d.inbox ?? [],
  }),
  // v1 -> v2: (future) …
];

export function migrate(raw: any): HelmData {
  let d = raw, v = raw?.meta?.version ?? 0;
  for (let i = v; i < MIGRATIONS.length; i++) d = MIGRATIONS[i](d);
  return d as HelmData;
}
```

## Mapping the prototype → the file

| Prototype (`data.jsx` / `app.jsx`) | Production file | Change |
|---|---|---|
| `ME` constant | `profile` | promote to file; add `preferences` (theme/accent/density/etc. currently in the Tweaks defaults) |
| `CLIENTS` constant | `clients[]` | promote to file; make CRUD-able |
| `TAGS` constant | `tags[]` | promote to file; make CRUD-able (user wants custom tags) |
| `COLLAB`/`ALL_USERS` | `users[]` | promote to file |
| `TASKS` state | `tasks[]` | dates → ISO strings; ids → uuid |
| `TIME_ENTRIES` state | `timeEntries[]` | dates → ISO strings |
| `INBOX` state | `inbox[]` | dates → ISO strings |
| `localStorage["helm.store.v1"]` | `<dir>/helm-data.json` | swap sink to IPC file store |
| `STATUSES`, `PRIORITIES` | keep as code constants | these are app enums, not user data |
| `TODAY` (fixed demo date) | real `new Date()` | the prototype pins "today" to 2026-05-28 so sample data looks live; use the real date in production |

A valid, fully-populated example file (the seed workspace, already in the file shape) is in `reference-implementation/helm-data.example.json` — point the app at it to test read/render before wiring writes.
