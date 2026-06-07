// src/store.ts  (reference implementation)
// -----------------------------------------------------------------------------
// Renderer-side data store. This is the ONLY place that knows about persistence.
// It mirrors exactly what app.jsx does in the prototype with localStorage —
// but the sink is the JSON file via window.helm (Electron preload).
//
// Everything else in the app (views, task panel, timer) just reads and patches
// the in-memory `data`. To go multi-user later, replace THIS FILE with an API
// client; the rest of the app is untouched.
// -----------------------------------------------------------------------------

import type { HelmData } from "./types";
import { SEED } from "./data/seed";
import { migrate } from "./migrate";

declare global {
  interface Window {
    helm?: {
      load: () => Promise<{ ok: boolean; data?: any; dataDir?: string; error?: string; seeded?: boolean; backupExists?: boolean }>;
      save: (data: HelmData) => Promise<{ ok: boolean; error?: string }>;
      getDir: () => Promise<string>;
      chooseDir: () => Promise<{ ok: boolean; dataDir?: string }>;
    };
    __helmSnapshot?: () => HelmData;   // main process calls this on quit
  }
}

const isElectron = () => typeof window !== "undefined" && !!window.helm;
const LS_KEY = "helm.store.v1";        // browser fallback only

// ---- LOAD on startup --------------------------------------------------------
export async function loadData(): Promise<{ data: HelmData; warning?: string }> {
  if (isElectron()) {
    const res = await window.helm!.load();
    if (res.ok && res.data) return { data: migrate(res.data) };
    // Corrupt/unreadable file: load seed into memory but DON'T autosave over it.
    return {
      data: SEED,
      warning: res.error
        ? `Couldn't read your data file (${res.error}). Loaded a fresh workspace; your file was left untouched${res.backupExists ? " — a backup exists" : ""}.`
        : undefined,
    };
  }
  // Browser fallback (dev / non-Electron): localStorage
  try {
    const raw = localStorage.getItem(LS_KEY);
    return { data: raw ? migrate(JSON.parse(raw)) : SEED };
  } catch {
    return { data: SEED };
  }
}

// ---- SAVE (autosave + on quit) ---------------------------------------------
let suppressSave = false;   // set true when we loaded a corrupt file (see warning)
export function setSuppressSave(v: boolean) { suppressSave = v; }

export async function saveData(data: HelmData): Promise<void> {
  if (suppressSave) return;
  const stamped: HelmData = { ...data, meta: { ...data.meta, savedAt: new Date().toISOString(), app: "helm" } };
  if (isElectron()) { await window.helm!.save(stamped); return; }
  try { localStorage.setItem(LS_KEY, JSON.stringify(stamped)); } catch {}
}

// ---- React glue -------------------------------------------------------------
// Use inside App.tsx:
//
//   const [data, setData] = useState<HelmData | null>(null);
//   useEffect(() => { loadData().then(({ data, warning }) => {
//     setData(data); if (warning) { setSuppressSave(true); toast(warning); }
//   }); }, []);
//
//   // expose a snapshot for the main process's on-quit save:
//   useEffect(() => { window.__helmSnapshot = () => dataRef.current; }, []);
//
//   // debounced autosave whenever data changes:
//   useEffect(() => {
//     if (!data) return;
//     const id = setTimeout(() => saveData(data), 800);
//     return () => clearTimeout(id);
//   }, [data]);
//
// Keep a ref in sync so __helmSnapshot always returns the latest:
//   const dataRef = useRef(data); useEffect(() => { dataRef.current = data; }, [data]);
//
// NOTE: the prototype splits data into separate useState calls
// (tasks/timeEntries/inbox/profile). You can keep that and assemble a HelmData
// object for save/snapshot, or consolidate into one `data` object as above.
// Either works — just make sure __helmSnapshot returns the full, current doc.
