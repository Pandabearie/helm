// electron/preload.js  (reference implementation)
// -----------------------------------------------------------------------------
// The ONLY bridge between the renderer (React UI) and Node/file system.
// Exposes a tiny, safe `window.helm` API. The renderer never touches fs.
// -----------------------------------------------------------------------------

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("helm", {
  // Read the JSON file on startup. Returns:
  //   { ok: true,  data, dataDir, seeded? }   on success
  //   { ok: false, error, dataDir, backupExists }   on corrupt/unreadable file
  load: () => ipcRenderer.invoke("helm:load"),

  // Persist the full in-memory data object (autosave + manual save).
  save: (data) => ipcRenderer.invoke("helm:save", data),

  // Where is the data folder right now?
  getDir: () => ipcRenderer.invoke("helm:getDir"),

  // Let the user move the data folder (e.g. into Google Drive). Returns { ok, dataDir }.
  chooseDir: () => ipcRenderer.invoke("helm:chooseDir"),
});
