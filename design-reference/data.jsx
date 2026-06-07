// ============ Helm — sample data ============
// Freelance consultant managing many clients; heavy density.

const TODAY = new Date(2026, 4, 28); // May 28, 2026 (matches "current date")

const daysFromToday = (d) => {
  const date = new Date(TODAY);
  date.setDate(date.getDate() + d);
  return date;
};

const fmtDate = (d) => d.toISOString().slice(0, 10);

const ME = { id: "u-me", name: "Sasha Pereira", initials: "SP", role: "Owner" };
const COLLAB = [
  { id: "u-jm", name: "Jordan Mehta", initials: "JM" },
  { id: "u-li", name: "Lin Iwasaki", initials: "LI" },
  { id: "u-rk", name: "Rosa Klein", initials: "RK" },
];
const ALL_USERS = [ME, ...COLLAB];

// Clients (act as both tag and grouping)
const CLIENTS = [
  { id: "c-northwind", name: "Northwind Studios", color: "#0ea5e9", initials: "NS", retainer: 6000, rate: 145, brief: "Brand refresh + new marketing site." },
  { id: "c-atelier",   name: "Atelier Mori",      color: "#a855f7", initials: "AM", retainer: 4500, rate: 135, brief: "E-commerce build on Shopify Plus." },
  { id: "c-halcyon",   name: "Halcyon Health",    color: "#10b981", initials: "HH", retainer: 8200, rate: 165, brief: "Patient portal UX redesign." },
  { id: "c-brunel",    name: "Brunel Capital",    color: "#f59e0b", initials: "BC", retainer: 5000, rate: 175, brief: "Investor narrative + deck." },
  { id: "c-saffron",   name: "Saffron Foods",     color: "#ef4444", initials: "SF", retainer: 3200, rate: 125, brief: "Packaging system + retail launch." },
  { id: "c-verdant",   name: "Verdant Arch.",     color: "#84cc16", initials: "VA", retainer: 2800, rate: 130, brief: "Portfolio site, low-touch." },
  { id: "c-kiln",      name: "Kiln & Kettle",     color: "#ec4899", initials: "KK", retainer: 4000, rate: 140, brief: "Restaurant rebrand + menu." },
  { id: "c-pelagic",   name: "Pelagic Maritime",  color: "#06b6d4", initials: "PM", retainer: 0,    rate: 155, brief: "One-off case study writeup." },
];

// Tag taxonomy beyond clients
const TAGS = [
  { id: "t-design",   name: "Design",      color: "#a855f7" },
  { id: "t-dev",      name: "Development", color: "#0ea5e9" },
  { id: "t-content",  name: "Content",     color: "#ec4899" },
  { id: "t-research", name: "Research",    color: "#84cc16" },
  { id: "t-meeting",  name: "Meeting",     color: "#f59e0b" },
  { id: "t-admin",    name: "Admin",       color: "#64748b" },
  { id: "t-billing",  name: "Billing",     color: "#10b981" },
  { id: "t-urgent",   name: "Urgent",      color: "#ef4444" },
  { id: "t-deep",     name: "Deep Work",   color: "#6366f1" },
];

// Statuses for kanban
const STATUSES = [
  { id: "todo",       name: "Backlog",      color: "#94a3b8" },
  { id: "progress",   name: "In Progress",  color: "#0ea5e9" },
  { id: "review",     name: "In Review",    color: "#a855f7" },
  { id: "blocked",    name: "Blocked",      color: "#ef4444" },
  { id: "done",       name: "Done",         color: "#10b981" },
];

const PRIORITIES = [
  { id: "p1", name: "P1 · Urgent",  color: "var(--p1)" },
  { id: "p2", name: "P2 · High",    color: "var(--p2)" },
  { id: "p3", name: "P3 · Normal",  color: "var(--p3)" },
];

// helper to build a task
let _tid = 0;
const t = (overrides) => ({
  id: `t-${++_tid}`,
  title: "Untitled",
  status: "todo",
  priority: "p3",
  client: null,
  tags: [],
  assignees: ["u-me"],
  due: null,
  start: null,
  estimate: 60, // minutes
  logged: 0,
  description: "",
  subtasks: [],
  comments: [],
  activity: [],
  recurring: null,
  createdAt: daysFromToday(-21),
  ...overrides,
});

const TASKS = [
  // Northwind Studios
  t({ title: "Finalize Northwind brand guidelines v2", client: "c-northwind", tags: ["t-design", "t-deep"], priority: "p1", status: "review", start: daysFromToday(-3), due: daysFromToday(0), estimate: 240, logged: 195,
    description: "Incorporate feedback from Tuesday review. Tighten color tokens, add motion principles section.",
    subtasks: [
      { id: "s1", title: "Refine logo lockups", done: true },
      { id: "s2", title: "Update typography page", done: true },
      { id: "s3", title: "Add motion principles", done: false },
      { id: "s4", title: "Export PDF + Figma library", done: false },
    ],
    comments: [
      { id: "cm1", user: "u-jm", text: "Pages 12–14 still showing old wordmark.", at: daysFromToday(-1) },
      { id: "cm2", user: "u-me", text: "Caught — pushing fix tonight.", at: daysFromToday(-1) },
    ],
    activity: [
      { kind: "status", text: "moved to In Review", user: "u-me", at: daysFromToday(-1) },
      { kind: "comment", text: "commented", user: "u-jm", at: daysFromToday(-1) },
    ],
  }),
  t({ title: "Marketing site — homepage hero direction", client: "c-northwind", tags: ["t-design"], priority: "p2", status: "progress", start: daysFromToday(-1), due: daysFromToday(2), estimate: 180, logged: 75 }),
  t({ title: "Stakeholder review — Thursday 2pm", client: "c-northwind", tags: ["t-meeting"], priority: "p2", status: "todo", due: daysFromToday(3), estimate: 60 }),
  t({ title: "Component library audit", client: "c-northwind", tags: ["t-design", "t-research"], priority: "p3", status: "todo", due: daysFromToday(8), estimate: 300 }),
  t({ title: "Send May invoice", client: "c-northwind", tags: ["t-billing", "t-admin"], priority: "p2", status: "todo", due: daysFromToday(3), estimate: 15, recurring: "monthly" }),

  // Atelier Mori
  t({ title: "PDP template — variant selector", client: "c-atelier", tags: ["t-dev"], priority: "p1", status: "progress", start: daysFromToday(-2), due: daysFromToday(1), estimate: 360, logged: 210,
    subtasks: [
      { id: "s1", title: "Sketch interaction states", done: true },
      { id: "s2", title: "Build component", done: true },
      { id: "s3", title: "Hook up to product API", done: false },
      { id: "s4", title: "QA mobile", done: false },
    ],
  }),
  t({ title: "Cart drawer animation polish", client: "c-atelier", tags: ["t-dev", "t-design"], priority: "p2", status: "progress", start: daysFromToday(-1), due: daysFromToday(4), estimate: 150, logged: 60 }),
  t({ title: "Migrate legacy collection pages", client: "c-atelier", tags: ["t-dev"], priority: "p3", status: "todo", due: daysFromToday(12), estimate: 480 }),
  t({ title: "Weekly sync — Wed 11am", client: "c-atelier", tags: ["t-meeting"], priority: "p3", status: "todo", due: daysFromToday(2), estimate: 45, recurring: "weekly" }),
  t({ title: "Atelier — May invoice", client: "c-atelier", tags: ["t-billing", "t-admin"], priority: "p2", status: "done", due: daysFromToday(-2), estimate: 15, logged: 12 }),

  // Halcyon Health (biggest client)
  t({ title: "Patient portal — appointment flow", client: "c-halcyon", tags: ["t-design", "t-deep"], priority: "p1", status: "progress", start: daysFromToday(-4), due: daysFromToday(5), estimate: 720, logged: 360,
    description: "Redesign the multi-step booking flow. Reduce drop-off at insurance step.",
    subtasks: [
      { id: "s1", title: "Audit current funnel data", done: true },
      { id: "s2", title: "Sketch alt flows", done: true },
      { id: "s3", title: "Hi-fi insurance step", done: false },
      { id: "s4", title: "Prototype review with Halcyon", done: false },
      { id: "s5", title: "Hand-off doc", done: false },
    ],
  }),
  t({ title: "Accessibility audit — provider dashboard", client: "c-halcyon", tags: ["t-design", "t-research"], priority: "p2", status: "review", start: daysFromToday(-6), due: daysFromToday(-1), estimate: 300, logged: 285 }),
  t({ title: "User interviews — 5 patients", client: "c-halcyon", tags: ["t-research"], priority: "p2", status: "blocked", due: daysFromToday(6), estimate: 480, description: "Blocked on IRB approval — chasing weekly." }),
  t({ title: "Empty states pass — dashboard widgets", client: "c-halcyon", tags: ["t-design"], priority: "p3", status: "todo", due: daysFromToday(10), estimate: 240 }),
  t({ title: "Halcyon retainer — May", client: "c-halcyon", tags: ["t-billing", "t-admin"], priority: "p2", status: "todo", due: daysFromToday(3), estimate: 15, recurring: "monthly" }),
  t({ title: "Compliance training (HIPAA refresher)", client: "c-halcyon", tags: ["t-admin"], priority: "p3", status: "todo", due: daysFromToday(15), estimate: 60 }),

  // Brunel Capital
  t({ title: "Investor deck — narrative arc v3", client: "c-brunel", tags: ["t-content", "t-deep"], priority: "p1", status: "progress", start: daysFromToday(-2), due: daysFromToday(1), estimate: 420, logged: 180 }),
  t({ title: "Market sizing slide — data refresh", client: "c-brunel", tags: ["t-research", "t-content"], priority: "p2", status: "todo", due: daysFromToday(2), estimate: 180 }),
  t({ title: "Deck design pass", client: "c-brunel", tags: ["t-design"], priority: "p2", status: "todo", due: daysFromToday(4), estimate: 360 }),
  t({ title: "Brunel — quarterly call", client: "c-brunel", tags: ["t-meeting"], priority: "p2", status: "todo", due: daysFromToday(7), estimate: 60 }),

  // Saffron Foods
  t({ title: "Packaging dieline — granola pouch", client: "c-saffron", tags: ["t-design"], priority: "p2", status: "review", start: daysFromToday(-7), due: daysFromToday(-2), estimate: 240, logged: 220 }),
  t({ title: "Color match w/ printer (Pantone)", client: "c-saffron", tags: ["t-design", "t-urgent"], priority: "p1", status: "progress", start: daysFromToday(-1), due: daysFromToday(1), estimate: 90, logged: 45 }),
  t({ title: "Retail launch checklist", client: "c-saffron", tags: ["t-content", "t-admin"], priority: "p3", status: "todo", due: daysFromToday(20), estimate: 180 }),
  t({ title: "Saffron — May invoice", client: "c-saffron", tags: ["t-billing"], priority: "p2", status: "done", due: daysFromToday(-3), estimate: 15, logged: 10 }),

  // Verdant Architects
  t({ title: "Portfolio site — project page template", client: "c-verdant", tags: ["t-dev", "t-design"], priority: "p3", status: "progress", start: daysFromToday(-3), due: daysFromToday(8), estimate: 360, logged: 120 }),
  t({ title: "Image optimization pipeline", client: "c-verdant", tags: ["t-dev"], priority: "p3", status: "todo", due: daysFromToday(11), estimate: 120 }),
  t({ title: "Verdant — onboarding call", client: "c-verdant", tags: ["t-meeting"], priority: "p3", status: "done", due: daysFromToday(-5), estimate: 45, logged: 50 }),

  // Kiln & Kettle
  t({ title: "Menu typography exploration", client: "c-kiln", tags: ["t-design", "t-deep"], priority: "p2", status: "progress", start: daysFromToday(-2), due: daysFromToday(3), estimate: 240, logged: 90 }),
  t({ title: "Wordmark v4 — 3 directions", client: "c-kiln", tags: ["t-design"], priority: "p1", status: "review", start: daysFromToday(-5), due: daysFromToday(0), estimate: 360, logged: 340 }),
  t({ title: "Photography brief", client: "c-kiln", tags: ["t-content"], priority: "p3", status: "todo", due: daysFromToday(6), estimate: 90 }),
  t({ title: "Signage system — sketch round", client: "c-kiln", tags: ["t-design"], priority: "p2", status: "todo", due: daysFromToday(14), estimate: 300 }),

  // Pelagic Maritime (one-off)
  t({ title: "Pelagic case study — interview notes", client: "c-pelagic", tags: ["t-content", "t-research"], priority: "p3", status: "progress", start: daysFromToday(-1), due: daysFromToday(5), estimate: 240, logged: 90 }),
  t({ title: "Case study draft v1", client: "c-pelagic", tags: ["t-content", "t-deep"], priority: "p2", status: "todo", due: daysFromToday(9), estimate: 360 }),

  // Personal/Admin (no client)
  t({ title: "File Q2 estimated taxes", tags: ["t-admin", "t-urgent"], priority: "p1", status: "todo", due: daysFromToday(2), estimate: 90 }),
  t({ title: "Book Q3 co-working desk", tags: ["t-admin"], priority: "p3", status: "todo", due: daysFromToday(14), estimate: 30 }),
  t({ title: "Update portfolio — 2026 work", tags: ["t-content", "t-design"], priority: "p3", status: "todo", due: daysFromToday(28), estimate: 480 }),
  t({ title: "Quarterly review (self)", tags: ["t-deep"], priority: "p3", status: "todo", due: daysFromToday(10), estimate: 120, recurring: "quarterly" }),
];

// Recent time entries (for timesheet)
let _eid = 0;
const e = (overrides) => ({ id: `e-${++_eid}`, ...overrides });

const TIME_ENTRIES = [
  // This week (Mon 5/25 – Sun 5/31) — today is Thu 5/28
  e({ task: "t-1",  client: "c-northwind", duration: 95,  date: daysFromToday(0),  note: "Brand guide motion section" }),
  e({ task: "t-1",  client: "c-northwind", duration: 60,  date: daysFromToday(-1), note: "Review revisions" }),
  e({ task: "t-2",  client: "c-northwind", duration: 75,  date: daysFromToday(0),  note: "Hero direction sketches" }),
  e({ task: "t-6",  client: "c-atelier",   duration: 120, date: daysFromToday(0),  note: "PDP variant selector" }),
  e({ task: "t-6",  client: "c-atelier",   duration: 90,  date: daysFromToday(-2), note: "Build component" }),
  e({ task: "t-7",  client: "c-atelier",   duration: 60,  date: daysFromToday(-1), note: "Cart drawer easing" }),
  e({ task: "t-11", client: "c-halcyon",   duration: 180, date: daysFromToday(-1), note: "Insurance step hi-fi" }),
  e({ task: "t-11", client: "c-halcyon",   duration: 180, date: daysFromToday(-3), note: "Sketch alt flows" }),
  e({ task: "t-12", client: "c-halcyon",   duration: 75,  date: daysFromToday(-2), note: "A11y audit findings" }),
  e({ task: "t-17", client: "c-brunel",    duration: 120, date: daysFromToday(0),  note: "Narrative arc revisions" }),
  e({ task: "t-17", client: "c-brunel",    duration: 60,  date: daysFromToday(-2), note: "Outline v3" }),
  e({ task: "t-21", client: "c-saffron",   duration: 45,  date: daysFromToday(-1), note: "Printer call + match" }),
  e({ task: "t-25", client: "c-verdant",   duration: 60,  date: daysFromToday(-3), note: "Template work" }),
  e({ task: "t-29", client: "c-kiln",      duration: 90,  date: daysFromToday(-1), note: "Type pairings" }),
  e({ task: "t-30", client: "c-kiln",      duration: 60,  date: daysFromToday(-3), note: "Wordmark direction B" }),
];

// Notifications / inbox
const INBOX = [
  { id: "n1", kind: "mention",  who: "u-jm", task: "t-1",  text: "mentioned you in Brand guidelines v2", at: daysFromToday(0),  read: false },
  { id: "n2", kind: "assigned", who: "u-li", task: "t-12", text: "assigned an A11y audit follow-up to you", at: daysFromToday(0), read: false },
  { id: "n3", kind: "due",      who: null,   task: "t-11", text: "Patient portal — appointment flow is due in 5 days", at: daysFromToday(0), read: false },
  { id: "n4", kind: "comment",  who: "u-rk", task: "t-20", text: "Pantone 7621 C is close but the cream pulls warm — see swatch", at: daysFromToday(-1), read: false },
  { id: "n5", kind: "status",   who: "u-jm", task: "t-30", text: "moved Wordmark v4 to In Review", at: daysFromToday(-1), read: true },
  { id: "n6", kind: "due",      who: null,   task: "t-32", text: "File Q2 estimated taxes — due in 2 days", at: daysFromToday(-1), read: false },
  { id: "n7", kind: "comment",  who: "u-li", task: "t-11", text: "Stakeholder loved the new step order. Greenlight on visuals.", at: daysFromToday(-2), read: true },
];

// Saved views
const SAVED_VIEWS = [
  { id: "sv1", name: "Due this week",    icon: "calendar" },
  { id: "sv2", name: "P1 across clients", icon: "flame" },
  { id: "sv3", name: "Blocked",           icon: "lock" },
  { id: "sv4", name: "Billing & admin",   icon: "receipt" },
];

const TEMPLATES = [
  {
    id: "tpl-1",
    name: "Brand Identity Project",
    description: "Full brand identity engagement: discovery, logo, guidelines, and delivery.",
    createdAt: new Date().toISOString(),
    tasks: [
      { title: "Discovery call & brief", status: "todo", priority: "p2", tags: ["t-meeting"], estimate: 60, description: "Align on brand positioning, audience, and deliverables.", subtasks: [{ id: "s1", title: "Prepare discovery questionnaire", done: false }, { id: "s2", title: "Send recap notes", done: false }] },
      { title: "Competitive & visual audit", status: "todo", priority: "p3", tags: ["t-research"], estimate: 180, description: "Audit 5–8 competitors and 3 visual reference directions.", subtasks: [] },
      { title: "Moodboard & direction presentation", status: "todo", priority: "p2", tags: ["t-design", "t-meeting"], estimate: 240, description: "Present 2–3 moodboards. Client selects one direction.", subtasks: [{ id: "s1", title: "Compile moodboard A", done: false }, { id: "s2", title: "Compile moodboard B", done: false }, { id: "s3", title: "Compile moodboard C", done: false }] },
      { title: "Logo exploration — 3 directions", status: "todo", priority: "p1", tags: ["t-design", "t-deep"], estimate: 480, description: "", subtasks: [{ id: "s1", title: "Wordmark direction", done: false }, { id: "s2", title: "Logomark direction", done: false }, { id: "s3", title: "Combination mark", done: false }] },
      { title: "Logo refinement & lockups", status: "todo", priority: "p1", tags: ["t-design"], estimate: 360, description: "Refine chosen direction. Produce full lockup set: horizontal, stacked, icon-only.", subtasks: [] },
      { title: "Colour & type system", status: "todo", priority: "p2", tags: ["t-design"], estimate: 240, description: "Define primary and secondary palette, type pairings, and usage rules.", subtasks: [] },
      { title: "Brand guidelines document", status: "todo", priority: "p2", tags: ["t-design", "t-content"], estimate: 300, description: "", subtasks: [{ id: "s1", title: "Logo usage section", done: false }, { id: "s2", title: "Colour section", done: false }, { id: "s3", title: "Typography section", done: false }, { id: "s4", title: "Imagery & tone", done: false }] },
      { title: "Final delivery & handoff", status: "todo", priority: "p2", tags: ["t-admin"], estimate: 90, description: "Package all files. Export PDF guidelines. Send handoff email.", subtasks: [] },
      { title: "Send invoice", status: "todo", priority: "p2", tags: ["t-billing", "t-admin"], estimate: 15, description: "", subtasks: [] },
    ],
  },
  {
    id: "tpl-2",
    name: "Website Build",
    description: "End-to-end website project: discovery through launch and handoff.",
    createdAt: new Date().toISOString(),
    tasks: [
      { title: "Kickoff & sitemap", status: "todo", priority: "p2", tags: ["t-meeting"], estimate: 90, description: "", subtasks: [{ id: "s1", title: "Agree on page list", done: false }, { id: "s2", title: "Define success metrics", done: false }] },
      { title: "Content inventory & copy brief", status: "todo", priority: "p2", tags: ["t-content", "t-research"], estimate: 120, description: "Audit existing content. Write brief for new pages.", subtasks: [] },
      { title: "Wireframes", status: "todo", priority: "p1", tags: ["t-design"], estimate: 360, description: "Low-fi wireframes for all key pages. Client sign-off before visual design.", subtasks: [] },
      { title: "Visual design — homepage", status: "todo", priority: "p1", tags: ["t-design", "t-deep"], estimate: 480, description: "", subtasks: [{ id: "s1", title: "Hero section", done: false }, { id: "s2", title: "Features section", done: false }, { id: "s3", title: "Social proof", done: false }, { id: "s4", title: "Footer", done: false }] },
      { title: "Visual design — inner pages", status: "todo", priority: "p1", tags: ["t-design"], estimate: 600, description: "", subtasks: [] },
      { title: "Design review & revisions", status: "todo", priority: "p2", tags: ["t-meeting", "t-design"], estimate: 180, description: "", subtasks: [] },
      { title: "Development — setup & build", status: "todo", priority: "p1", tags: ["t-dev", "t-deep"], estimate: 960, description: "Build all pages from approved designs.", subtasks: [{ id: "s1", title: "Repo & hosting setup", done: false }, { id: "s2", title: "Component build", done: false }, { id: "s3", title: "CMS integration", done: false }] },
      { title: "QA & cross-browser testing", status: "todo", priority: "p2", tags: ["t-dev"], estimate: 240, description: "", subtasks: [] },
      { title: "Client review & UAT", status: "todo", priority: "p2", tags: ["t-meeting"], estimate: 120, description: "", subtasks: [] },
      { title: "Launch", status: "todo", priority: "p1", tags: ["t-dev", "t-admin"], estimate: 120, description: "DNS cutover, SSL check, submit sitemap.", subtasks: [] },
      { title: "Post-launch review & handoff", status: "todo", priority: "p3", tags: ["t-admin", "t-content"], estimate: 90, description: "", subtasks: [] },
      { title: "Send final invoice", status: "todo", priority: "p2", tags: ["t-billing", "t-admin"], estimate: 15, description: "", subtasks: [] },
    ],
  },
  {
    id: "tpl-3",
    name: "Monthly Retainer",
    description: "Recurring monthly engagement — kickoff, delivery cycle, and invoicing.",
    createdAt: new Date().toISOString(),
    tasks: [
      { title: "Monthly kickoff call", status: "todo", priority: "p2", tags: ["t-meeting"], estimate: 45, description: "Agree on deliverables and priorities for the month.", subtasks: [] },
      { title: "Deliver agreed work", status: "todo", priority: "p1", tags: ["t-design", "t-dev"], estimate: 480, description: "Main deliverable block for the month.", subtasks: [] },
      { title: "Mid-month check-in", status: "todo", priority: "p3", tags: ["t-meeting"], estimate: 30, description: "", subtasks: [] },
      { title: "Prepare progress report", status: "todo", priority: "p2", tags: ["t-content", "t-admin"], estimate: 60, description: "", subtasks: [] },
      { title: "End-of-month review call", status: "todo", priority: "p2", tags: ["t-meeting"], estimate: 45, description: "", subtasks: [] },
      { title: "Send monthly invoice", status: "todo", priority: "p1", tags: ["t-billing", "t-admin"], estimate: 15, description: "", subtasks: [] },
    ],
  },
];

// expose globally to other Babel scripts
Object.assign(window, {
  TODAY, daysFromToday, fmtDate,
  ME, COLLAB, ALL_USERS,
  CLIENTS, TAGS, STATUSES, PRIORITIES,
  TASKS, TIME_ENTRIES, INBOX, SAVED_VIEWS,
  TEMPLATES,
});
