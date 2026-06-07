# Architecture — Helm production build

## TL;DR

Build **Helm** as a **local-first Electron desktop app** (React + TypeScript + Vite renderer). The single source of truth is one **JSON file** the user picks (Desktop or a Google-Drive-synced folder). The app **reads it on launch**, holds everything in memory while running (with periodic autosave), and **writes it on quit**. No server, no database, no account. Works fully offline; "sync" is delegated to whatever syncs that folder (Google Drive / Dropbox / iCloud / OneDrive).

```
┌────────────────────────── Electron app ──────────────────────────┐
│                                                                   │
│  Main process (Node)            Renderer (React UI = the prototype)│
│  ─────────────────────          ──────────────────────────────────│
│  • owns the file system         • all views/components (ported)    │
│  • reads helm-data.json   ──IPC──▶ hydrates in-memory `data`       │
│    on app start                 • user edits mutate `data`         │
│  • writes helm-data.json  ◀─IPC── autosave (debounced) + on quit   │
│    on quit / autosave           • NEVER touches fs directly        │
│  • remembers folder choice                                         │
│    in app config                                                   │
└───────────────────────────────────────────────────────────────────┘
            │
            ▼
   ~/Desktop/Helm/helm-data.json   ← or ~/Google Drive/Helm/helm-data.json
```

## Why local-first / Electron (and not a web app)

The user's requirement — *"read a `.json` from a folder I specify on startup, write it back when I close"* — needs durable, silent access to a **specific local file across launches**. Browsers deliberately forbid that:

- The **File System Access API** (`showOpenFilePicker`) can persist a handle, but Chrome **re-prompts for permission on every page load**, and it's unsupported in Firefox/Safari. That breaks "just open the app and it loads."
- A plain web app also can't auto-write on close reliably (`beforeunload` can't run async fs work).

**Electron** removes all of this: the Node **main process** has full fs access, can read on `app.whenReady()` and write on `before-quit`, and ships a double-clickable **`.exe`/`.dmg`/AppImage** — matching the user's earlier "starts when I click it" goal. **Tauri** is an equally valid, lighter (Rust) alternative; the IPC shape below maps 1:1.

**Fallback if they ever want browser-only:** keep the prototype's `localStorage` store and add manual **Import/Export JSON** buttons (download writes the file, file-input reads it). Acceptable, but not the requested auto-on-open/close behavior. Recommend Electron.

## Recommended stack

| Concern | Choice | Notes |
|---|---|---|
| Shell | **Electron** (or Tauri) | real `.exe`/`.app`, fs access, offline |
| Renderer | **React 18 + TypeScript** | port the prototype's components |
| Build | **Vite** (`@vitejs/plugin-react`) | drop the in-browser Babel entirely |
| Packaging | **electron-builder** | NSIS installer (Win), dmg (mac), AppImage (Linux) |
| Styling | **the prototype's `styles.css` as-is** | token-driven, no framework needed; CSS Modules or a single global import both fine |
| State | plain React state + a `store` module | the app is small; Zustand is optional sugar, not required |
| Dates | keep ISO strings in JSON; `Date` only in memory | the prototype already does `new Date(t.due)` at read sites |
| IDs | `crypto.randomUUID()` | replace the prototype's `Date.now()` ids |

Project layout:

```
helm/
├── package.json
├── electron/
│   ├── main.ts          ← from reference-implementation/electron-main.js
│   ├── preload.ts       ← from reference-implementation/preload.js
│   └── config.ts        ← persists the chosen data-folder path (electron-store or a tiny json in userData)
├── src/
│   ├── main.tsx         ← React entry
│   ├── App.tsx          ← port of app.jsx (swap localStorage → window.helm IPC store)
│   ├── store.ts         ← from reference-implementation/store.ts
│   ├── data/seed.ts     ← from data.jsx (sample workspace + domain constants)
│   ├── components/…      ← from ui.jsx (Icon, Sidebar, Topbar, TaskPanel, CmdK, FloatingTimer, ProfileModal, Toast)
│   ├── views/…           ← from views.jsx (one file per view)
│   └── styles.css        ← from the prototype, verbatim
└── electron-builder.yml
```

## The persistence lifecycle (the core requirement)

### 1. First run / choosing the folder
- On first launch there's no saved folder path. Show a tiny **"Where should Helm keep your data?"** step (a `dialog.showOpenDialog({ properties: ['openDirectory'] })`).
- Save the chosen directory path in Electron's `userData` config (see `electron/config.ts`). The data file is `<chosenDir>/helm-data.json`.
- If the file doesn't exist yet, write the **seed workspace** (`helm-data.example.json`) so the user lands in a populated app. (Or offer "start empty.")
- Let them change the folder later in **Settings → Data location** (re-pick dir; optionally move/copy the existing file).

### 2. On startup (read)
- Main process reads `<dir>/helm-data.json`, parses, **validates/migrates** by `meta.version` (see `DATA_MODEL.md`), and hands it to the renderer (either via a preload-exposed `loadData()` the renderer awaits on mount, or by pushing it once the window is ready).
- Renderer hydrates React state from it. If read/parse fails, fall back to seed + surface a non-destructive error toast (never overwrite a corrupt file without a backup — see Safety).

### 3. While running (autosave)
- Renderer debounces (≈500ms–2s) after any change to `data` and calls `window.helm.save(data)`; main writes the file. This protects against crashes/power loss between launches. Keep it cheap — the file is small (tens of KB).

### 4. On close (write)
- Main process intercepts `before-quit`/window `close`, requests the latest `data` from the renderer (or uses the last autosaved snapshot), writes the file **atomically**, then quits. The reference `electron-main.js` shows the handshake (prevent default → ask renderer → await write → `app.exit()`).

### 5. Google Drive / Desktop
- It's just a path. If the user points the folder at their Google-Drive-synced directory (e.g. `~/Google Drive/My Drive/Helm`), Drive's own client syncs `helm-data.json` across machines. **Single-writer assumption holds** for one person on one machine at a time; document that simultaneous edits on two machines can conflict (last-writer-wins / Drive makes a conflicted copy). For the stated single-user use, this is fine.

## Write safety (please implement)

- **Atomic writes:** write to `helm-data.json.tmp`, `fsync`, then `rename` over the real file. Prevents truncated files if the app dies mid-write. (Shown in the reference main process.)
- **Rolling backups:** before each on-quit write, copy the current file to `helm-data.backup.json` (or timestamped backups, keep last N). Cheap insurance for a hand-edited JSON file living in a sync folder.
- **Never clobber on corrupt read:** if parse fails on startup, load seed into memory but **do not** autosave over the bad file until the user acts; offer "restore from backup."
- **Schema version + migrations:** stamp `meta.version`; on read, run forward migrations so older files keep working as the app evolves.

## Multi-user (future, leave room)

The user noted possible expansion to a shared workspace. The data model is already team-shaped: `task.assignees` is an array, comments/activity carry `user` ids, and there's a users concept (`ME` + collaborators in `data.jsx`). To go multi-user later, the cleanest path is to **replace only the `store` layer**: swap the JSON-file sink for a small API/DB (SQLite locally, or Postgres + a sync service / Supabase). The UI and in-memory `data` shape can stay identical. Don't build that now — just keep all persistence behind the `store` module so it's a one-file swap.

## What to strip from the prototype

- Remove the **CDN React/Babel `<script>` tags** and in-browser JSX transpile — compile with Vite instead.
- Remove **`tweaks-panel.jsx`** and the `<TweaksPanel>` block in `app.jsx`; promote theme/accent/density to real **Settings** (persist on `profile`/preferences).
- Replace **`localStorage` load/save** in `app.jsx` with the IPC store.
- Replace `Date.now()`/string-concat IDs with `crypto.randomUUID()`.
- Convert the date handling to: **store ISO strings**, parse to `Date` only when computing (the prototype already mostly does this; audit `TODAY`, which is a fixed demo date — in production use real `new Date()` / start-of-day).
