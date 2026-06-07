// electron/main.js  (reference implementation)
// -----------------------------------------------------------------------------
// Helm — local-first desktop shell.
// Responsibilities of the MAIN process:
//   1. Pick / remember the data folder (Desktop or a Google-Drive-synced dir).
//   2. READ <folder>/helm-data.json on startup and hand it to the renderer.
//   3. WRITE it back atomically on autosave + on quit.
//   4. Keep rolling backups; never clobber a corrupt file.
//
// This is reference code: wire it into a Vite+Electron project (electron-vite,
// electron-forge, or a hand-rolled setup). Convert to .ts if you like.
// -----------------------------------------------------------------------------

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

const CONFIG_PATH = path.join(app.getPath("userData"), "helm-config.json");
const DATA_FILENAME = "helm-data.json";
const BACKUP_FILENAME = "helm-data.backup.json";

let win = null;
let dataDir = null;            // the folder the user chose
let quitting = false;          // guards the before-quit handshake

// ---- tiny config store (remembers the chosen folder across launches) --------
function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")); }
  catch { return {}; }
}
function writeConfig(cfg) {
  try { fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2)); } catch {}
}

function dataFilePath() { return path.join(dataDir, DATA_FILENAME); }
function backupFilePath() { return path.join(dataDir, BACKUP_FILENAME); }

// ---- folder selection -------------------------------------------------------
async function ensureDataDir() {
  const cfg = readConfig();
  if (cfg.dataDir && fs.existsSync(cfg.dataDir)) { dataDir = cfg.dataDir; return; }

  // First run (or folder went missing): ask the user where to keep data.
  const res = await dialog.showOpenDialog({
    title: "Choose where Helm keeps your data",
    message: "Pick a folder (e.g. your Desktop, or a Google Drive folder to sync across devices).",
    properties: ["openDirectory", "createDirectory"],
    buttonLabel: "Use this folder",
  });
  if (res.canceled || !res.filePaths[0]) {
    // Default to ~/Desktop/Helm so the app can still start.
    dataDir = path.join(app.getPath("desktop"), "Helm");
  } else {
    dataDir = res.filePaths[0];
  }
  await fsp.mkdir(dataDir, { recursive: true });
  writeConfig({ ...cfg, dataDir });
}

// ---- read on startup --------------------------------------------------------
async function loadData() {
  const file = dataFilePath();
  try {
    const raw = await fsp.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return { ok: true, data: parsed, dataDir };
  } catch (err) {
    if (err.code === "ENOENT") {
      // No file yet → seed it so the user lands in a populated workspace.
      const seed = await readSeed();
      await atomicWrite(file, seed);
      return { ok: true, data: seed, dataDir, seeded: true };
    }
    // Corrupt/unreadable: DO NOT overwrite. Return error; renderer loads seed
    // into memory and offers "restore from backup" without auto-saving.
    return { ok: false, error: String(err), dataDir, backupExists: fs.existsSync(backupFilePath()) };
  }
}

async function readSeed() {
  // Ship the example workspace inside the app bundle (copy
  // helm-data.example.json next to main, or import it). Fallback: empty doc.
  try {
    const seedPath = path.join(__dirname, "helm-data.example.json");
    return JSON.parse(await fsp.readFile(seedPath, "utf8"));
  } catch {
    return { meta: { version: 1, savedAt: new Date().toISOString(), app: "helm" },
             profile: {}, clients: [], tags: [], users: [], tasks: [], timeEntries: [], inbox: [] };
  }
}

// ---- atomic write (+ backup) ------------------------------------------------
async function atomicWrite(file, dataObj) {
  const dir = path.dirname(file);
  await fsp.mkdir(dir, { recursive: true });

  // rolling backup of the existing good file before overwriting
  try { if (fs.existsSync(file)) await fsp.copyFile(file, backupFilePath()); } catch {}

  const tmp = file + ".tmp";
  const payload = JSON.stringify(
    { ...dataObj, meta: { ...(dataObj.meta || {}), savedAt: new Date().toISOString(), app: "helm" } },
    null, 2
  );
  const handle = await fsp.open(tmp, "w");
  try {
    await handle.writeFile(payload, "utf8");
    await handle.sync();              // flush to disk before rename
  } finally {
    await handle.close();
  }
  await fsp.rename(tmp, file);        // atomic replace
}

async function saveData(dataObj) {
  try { await atomicWrite(dataFilePath(), dataObj); return { ok: true }; }
  catch (err) { return { ok: false, error: String(err) }; }
}

// ---- window -----------------------------------------------------------------
function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: "#0a0e15",      // matches dark theme bg; avoids white flash
    titleBarStyle: "hiddenInset",    // mac; remove for default chrome
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // dev: load Vite dev server; prod: load built index.html
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// ---- IPC: renderer <-> main -------------------------------------------------
ipcMain.handle("helm:load", async () => loadData());
ipcMain.handle("helm:save", async (_e, data) => saveData(data));
ipcMain.handle("helm:getDir", async () => dataDir);
ipcMain.handle("helm:chooseDir", async () => {
  const res = await dialog.showOpenDialog(win, {
    title: "Move Helm data to…",
    properties: ["openDirectory", "createDirectory"],
  });
  if (res.canceled || !res.filePaths[0]) return { ok: false };
  const next = res.filePaths[0];
  // optionally copy the existing file over to the new location
  try {
    const cur = dataFilePath();
    if (fs.existsSync(cur)) await fsp.copyFile(cur, path.join(next, DATA_FILENAME));
  } catch {}
  dataDir = next;
  writeConfig({ ...readConfig(), dataDir });
  return { ok: true, dataDir };
});

// ---- lifecycle: write on quit ----------------------------------------------
// On quit we ask the renderer for its latest snapshot, write it, THEN exit.
app.on("before-quit", async (e) => {
  if (quitting) return;            // second pass: allow real quit
  e.preventDefault();
  quitting = true;
  try {
    if (win && !win.isDestroyed()) {
      const data = await win.webContents.executeJavaScript(
        "window.__helmSnapshot && window.__helmSnapshot()"  // renderer exposes a getter
      );
      if (data) await saveData(data);
    }
  } catch (err) {
    console.error("Helm: final save failed", err);
  } finally {
    app.exit(0);
  }
});

app.whenReady().then(async () => {
  await ensureDataDir();
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
