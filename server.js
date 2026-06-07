const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "helm-data.json");
const SEED_FILE = path.join(__dirname, "reference-implementation", "helm-data.example.json");
const STATIC_DIR = path.join(__dirname, "design-reference");

app.use(express.json({ limit: "10mb" }));
app.use(express.static(STATIC_DIR));

// Load data — reads helm-data.json if it exists, otherwise falls back to seed
app.get("/api/data", (req, res) => {
  const file = fs.existsSync(DATA_FILE) ? DATA_FILE : SEED_FILE;
  try {
    const raw = fs.readFileSync(file, "utf8");
    res.json(JSON.parse(raw));
  } catch (e) {
    console.error("Failed to read data file:", e);
    res.status(500).json({ error: "Failed to load data" });
  }
});

// Save data — atomically writes to helm-data.json
app.post("/api/data", (req, res) => {
  try {
    const payload = { ...req.body, meta: { ...req.body.meta, savedAt: new Date().toISOString(), app: "helm" } };
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf8");
    fs.renameSync(tmp, DATA_FILE);
    res.json({ ok: true, savedAt: payload.meta.savedAt });
  } catch (e) {
    console.error("Failed to save data file:", e);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Reset data — deletes helm-data.json so next GET returns seed
app.post("/api/reset", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to reset data" });
  }
});

app.listen(PORT, () => {
  console.log(`Helm running at http://localhost:${PORT}`);
});
