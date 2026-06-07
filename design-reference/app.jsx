// ============ Helm — main app ============

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#0ea5e9",
  "density": "comfy",
  "sidebarCollapsed": false,
  "showFloatingTimer": true
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  { name: "Sky",     value: "#0ea5e9", hover: "#0284c7", soft: "#e0f2fe" },
  { name: "Indigo",  value: "#6366f1", hover: "#4f46e5", soft: "#e0e7ff" },
  { name: "Emerald", value: "#10b981", hover: "#059669", soft: "#d1fae5" },
  { name: "Coral",   value: "#f43f5e", hover: "#e11d48", soft: "#ffe4e6" },
  { name: "Amber",   value: "#f59e0b", hover: "#d97706", soft: "#fef3c7" },
  { name: "Graphite",value: "#475569", hover: "#334155", soft: "#e2e8f0" },
];

// ============ persistence ============
// Loads from / saves to the Express backend (GET /api/data, POST /api/data).
// Data is written to helm-data.json on the server and survives page reloads
// and server restarts.

const seedStore = () => ({
  profile: { ...ME },
  tasks: TASKS,
  timeEntries: TIME_ENTRIES,
  inbox: INBOX,
  templates: TEMPLATES,
  meta: { savedAt: null, version: 1 },
});

const saveStore = (data) => {
  fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, meta: { ...data.meta, savedAt: new Date().toISOString() } }),
  }).catch((e) => console.warn("Helm: could not save data.", e));
};

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = tweaks.theme;
  const setTheme = (v) => setTweak("theme", v);

  // Apply theme & accent
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    const opt = ACCENT_OPTIONS.find(o => o.value === tweaks.accent) || ACCENT_OPTIONS[0];
    document.documentElement.style.setProperty("--accent", opt.value);
    document.documentElement.style.setProperty("--accent-hover", opt.hover);
    if (theme === "light") {
      document.documentElement.style.setProperty("--accent-soft", opt.soft);
      document.documentElement.style.setProperty("--accent-text", opt.hover);
    }
  }, [tweaks.accent, theme]);

  // Density
  React.useEffect(() => {
    document.documentElement.style.fontSize = tweaks.density === "compact" ? "13px" : "14px";
  }, [tweaks.density]);

  // State (seeded with defaults, then overwritten by server data on mount)
  const seed = seedStore();
  const [view, setView] = React.useState("overview");
  const [profile, setProfile] = React.useState(seed.profile);
  const [tasks, setTasks] = React.useState(seed.tasks);
  const [timeEntries, setTimeEntries] = React.useState(seed.timeEntries);
  const [inbox, setInbox] = React.useState(seed.inbox);
  const [templates, setTemplates] = React.useState(seed.templates);
  const [openTemplateId, setOpenTemplateId] = React.useState(null);
  // clientsVer / tagsVer: increment to force re-render after mutating the CLIENTS/TAGS globals
  const [clientsVer, setClientsVer] = React.useState(0);
  const [tagsVer, setTagsVer] = React.useState(0);

  // Fetch persisted data from server on first mount
  React.useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(p => ({ ...p, ...data.profile }));
        if (data.tasks) setTasks(data.tasks);
        if (data.timeEntries) setTimeEntries(data.timeEntries);
        if (data.inbox) setInbox(data.inbox);
        if (data.templates) setTemplates(data.templates);
        // Hydrate global CLIENTS/TAGS arrays from persisted data
        if (data.clients && data.clients.length) { CLIENTS.length = 0; CLIENTS.push(...data.clients); setClientsVer(v => v + 1); }
        if (data.tags && data.tags.length) { TAGS.length = 0; TAGS.push(...data.tags); setTagsVer(v => v + 1); }
      })
      .catch((e) => console.warn("Helm: could not load data from server, using seed.", e));
  }, []);

  const [openTaskId, setOpenTaskId] = React.useState(null);
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const [quickAddStatus, setQuickAddStatus] = React.useState("todo");
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [clientModalOpen, setClientModalOpen] = React.useState(false);
  const [tagModalOpen, setTagModalOpen] = React.useState(false);
  const [savedView, setSavedView] = React.useState(null);
  const [clientFilter, setClientFilter] = React.useState(null);
  const [tagFilter, setTagFilter] = React.useState(null);
  const [focusedClient, setFocusedClient] = React.useState(null);
  const [listGroupBy, setListGroupBy] = React.useState("status");
  const [search, setSearch] = React.useState("");
  const [timer, setTimer] = React.useState({ taskId: null, running: false, startedAt: null, accumulated: 0, billable: true });
  const [toasts, setToasts] = React.useState([]);

  // ---- toast helper ----
  const toastId = React.useRef(0);
  const pushToast = React.useCallback((text, opts = {}) => {
    const id = ++toastId.current;
    setToasts(ts => [...ts, { id, text, ...opts }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), opts.duration || 2200);
  }, []);

  // ---- persistence: save (debounced) whenever core data changes ----
  const saveTimer = React.useRef(null);
  React.useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveStore({ profile, tasks, timeEntries, inbox, templates, clients: [...CLIENTS], tags: [...TAGS], meta: { version: 1 } });
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [profile, tasks, timeEntries, inbox, templates]);

  // Flush on tab close
  React.useEffect(() => {
    const flush = () => saveStore({ profile, tasks, timeEntries, inbox, templates, clients: [...CLIENTS], tags: [...TAGS], meta: { version: 1 } });
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [profile, tasks, timeEntries, inbox, templates]);

  // Sidebar collapse
  const sidebarCollapsed = !!tweaks.sidebarCollapsed;

  // Filter tasks by sidebar selections (applies to most views)
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(t => {
      if (clientFilter && t.client !== clientFilter) return false;
      if (tagFilter && !t.tags.includes(tagFilter)) return false;
      if (savedView) {
        if (savedView.filter.status && t.status !== savedView.filter.status) return false;
        if (savedView.filter.priority && t.priority !== savedView.filter.priority) return false;
        if (savedView.filter.tag && !t.tags.includes(savedView.filter.tag)) return false;
        if (savedView.filter.dueSoon) {
          const due = t.due ? new Date(t.due) : null;
          const cutoff = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          if (!due || due > cutoff || t.status === "done") return false;
        }
      }
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, clientFilter, tagFilter, savedView, search]);

  // Handlers
  const openTask = (id) => setOpenTaskId(id);
  const closeTask = () => setOpenTaskId(null);
  const updateTask = (id, patch) => setTasks(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  const moveTask = (id, status) => {
    updateTask(id, { status });
    const t = tasks.find(x => x.id === id);
    if (t) {
      const act = { kind: "status", text: `moved to ${STATUSES.find(s => s.id === status)?.name}`, user: "u-me", at: new Date() };
      updateTask(id, { activity: [...t.activity, act] });
    }
  };
  const getNextDate = (date, cadence) => {
    const d = new Date(date);
    if (cadence === "daily") d.setDate(d.getDate() + 1);
    else if (cadence === "weekly") d.setDate(d.getDate() + 7);
    else if (cadence === "monthly") d.setMonth(d.getMonth() + 1);
    else if (cadence === "quarterly") d.setMonth(d.getMonth() + 3);
    return d;
  };

  const toggleDone = (id) => {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const newStatus = t.status === "done" ? "todo" : "done";
    moveTask(id, newStatus);
    // Auto-create next occurrence for recurring tasks
    if (newStatus === "done" && t.recurring) {
      const nextDue = t.due ? getNextDate(new Date(t.due), t.recurring) : null;
      const newId = `t-rec-${Date.now()}`;
      setTasks(ts => [...ts, { ...t, id: newId, status: "todo", logged: 0, due: nextDue, start: null, comments: [], activity: [{ kind: "create", text: `auto-created (${t.recurring} recurrence)`, user: "u-me", at: new Date() }], createdAt: new Date() }]);
      pushToast(`Next ${t.recurring} recurrence created`, { icon: "repeat" });
    }
  };
  const createTask = (data) => {
    const newId = `t-new-${Date.now()}`;
    setTasks(ts => [{
      id: newId,
      title: "Untitled",
      status: "todo",
      priority: "p3",
      client: null,
      tags: [],
      assignees: ["u-me"],
      due: null,
      start: null,
      estimate: 60,
      logged: 0,
      description: "",
      subtasks: [],
      comments: [],
      activity: [{ kind: "create", text: "created this task", user: "u-me", at: new Date() }],
      blockedBy: [],
      recurring: null,
      ...data,
    }, ...ts]);
    pushToast("Task created", { icon: "plus" });
  };

  const duplicateTask = (id) => {
    const src = tasks.find(t => t.id === id);
    if (!src) return;
    const newId = `t-dup-${Date.now()}`;
    setTasks(ts => [{ ...src, id: newId, title: src.title + " (copy)", logged: 0, comments: [], activity: [{ kind: "create", text: "duplicated from another task", user: "u-me", at: new Date() }], createdAt: new Date() }, ...ts]);
    pushToast("Task duplicated", { icon: "repeat" });
  };

  const addTimeEntry = (taskId, { duration, note, date, billable = true }) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const mins = Math.max(1, Math.round(Number(duration) || 30));
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, logged: t.logged + mins } : t));
    setTimeEntries(es => [{ id: `e-manual-${Date.now()}`, task: taskId, client: task.client, duration: mins, date: date || new Date(), note: note || "Manual entry", billable }, ...es]);
    const h = Math.floor(mins / 60), m = mins % 60;
    pushToast(`${h > 0 ? h + "h " : ""}${m}m logged`, { icon: "timer" });
  };

  const reorderTasks = (fromId, toId) => {
    setTasks(ts => {
      const from = ts.findIndex(t => t.id === fromId);
      const to = ts.findIndex(t => t.id === toId);
      if (from === -1 || to === -1 || from === to) return ts;
      const next = [...ts];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };
  const deleteTask = (id) => {
    const t = tasks.find(x => x.id === id);
    setTasks(ts => ts.filter(x => x.id !== id));
    setTimeEntries(es => es.filter(e => e.task !== id));
    setInbox(ix => ix.filter(n => n.task !== id));
    if (timer.taskId === id) setTimer({ taskId: null, running: false, startedAt: null, accumulated: 0 });
    pushToast(t ? `Deleted “${t.title.slice(0, 28)}${t.title.length > 28 ? "…" : ""}”` : "Task deleted", { icon: "trash" });
  };
  const updateProfile = (patch) => {
    setProfile(p => ({ ...p, ...patch }));
    pushToast("Profile updated", { icon: "check" });
  };

  // Client handlers (mutate global CLIENTS array + bump version to trigger re-render)
  const createClient = (data) => {
    const newClient = { id: `c-${Date.now()}`, ...data };
    CLIENTS.push(newClient);
    setClientsVer(v => v + 1);
    pushToast(`Client "${newClient.name}" created`, { icon: "plus" });
  };
  const deleteClient = (id) => {
    const idx = CLIENTS.findIndex(c => c.id === id);
    if (idx !== -1) CLIENTS.splice(idx, 1);
    setClientsVer(v => v + 1);
  };

  // Tag handlers
  const createTag = (data) => {
    const newTag = { id: `t-custom-${Date.now()}`, ...data };
    TAGS.push(newTag);
    setTagsVer(v => v + 1);
    pushToast(`Tag "${newTag.name}" created`, { icon: "plus" });
  };
  const deleteTag = (id) => {
    const idx = TAGS.findIndex(t => t.id === id);
    if (idx !== -1) TAGS.splice(idx, 1);
    setTagsVer(v => v + 1);
  };

  // Saved view handler
  const handleSavedView = (sv) => {
    setSavedView(sv);
    setClientFilter(null);
    setTagFilter(null);
    setView("list");
    pushToast(`Showing: ${sv.name}`, { icon: sv.icon });
  };

  // Template handlers
  const createTemplate = () => {
    const id = `tpl-${Date.now()}`;
    setTemplates(ts => [{
      id,
      name: "New Template",
      description: "",
      createdAt: new Date().toISOString(),
      tasks: [],
    }, ...ts]);
    setOpenTemplateId(id);
  };
  const updateTemplate = (id, patch) => setTemplates(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  const deleteTemplate = (id) => {
    setTemplates(ts => ts.filter(t => t.id !== id));
    if (openTemplateId === id) setOpenTemplateId(null);
    pushToast("Template deleted", { icon: "trash" });
  };
  const applyTemplate = (template, clientId) => {
    const now = new Date();
    const newTasks = template.tasks.map(tTask => ({
      id: `t-tpl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: tTask.title,
      status: "todo",
      priority: tTask.priority || "p3",
      client: clientId || null,
      tags: tTask.tags || [],
      assignees: ["u-me"],
      due: null,
      start: null,
      estimate: tTask.estimate || 60,
      logged: 0,
      description: tTask.description || "",
      subtasks: (tTask.subtasks || []).map(st => ({ ...st, id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, done: false })),
      comments: [],
      activity: [{ kind: "create", text: `created from template "${template.name}"`, user: "u-me", at: now }],
      recurring: null,
      createdAt: now,
    }));
    setTasks(ts => [...newTasks, ...ts]);
    pushToast(`${newTasks.length} task${newTasks.length !== 1 ? "s" : ""} created from "${template.name}"`, { icon: "check" });
  };

  // Timer
  const startTimer = (taskId) => {
    if (timer.running && timer.taskId === taskId) return;
    // commit previous time first if changing tasks
    if (timer.running && timer.taskId && timer.taskId !== taskId) {
      stopTimer();
    }
    setTimer({ taskId, running: true, startedAt: Date.now(), accumulated: timer.taskId === taskId ? timer.accumulated : 0 });
  };
  const stopTimer = () => {
    setTimer(t => {
      if (!t.running) return t;
      const elapsed = Math.floor((Date.now() - t.startedAt) / 1000) + t.accumulated;
      if (t.taskId) {
        const mins = Math.max(1, Math.round(elapsed / 60));
        setTasks(ts => ts.map(x => x.id === t.taskId ? { ...x, logged: x.logged + mins } : x));
        const task = tasks.find(x => x.id === t.taskId);
        if (task) {
          setTimeEntries(es => [{ id: `e-new-${Date.now()}`, task: t.taskId, client: task.client, duration: mins, date: new Date(), note: "Tracked session", billable: t.billable !== false }, ...es]);
        }
      }
      return { taskId: t.taskId, running: false, startedAt: null, accumulated: 0, billable: t.billable !== false };
    });
  };
  const resumeTimer = () => {
    if (!timer.taskId) return;
    setTimer(t => ({ ...t, running: true, startedAt: Date.now() }));
  };

  // Cmd+K
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen(o => !o);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setQuickAddOpen(true);
      } else if (e.key === "Escape") {
        if (openTaskId) setOpenTaskId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openTaskId]);

  // Inbox handlers
  const markRead = (id) => setInbox(ix => ix.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setInbox(ix => ix.map(n => ({ ...n, read: true })));
  const inboxUnread = inbox.filter(n => !n.read).length;

  // ============ render the active view ============
  const renderView = () => {
    const baseProps = { tasks: filteredTasks, onOpenTask: openTask, onStartTimer: startTimer };
    switch (view) {
      case "overview":  return <OverviewView {...baseProps} timeEntries={timeEntries} me={profile} />;
      case "mytasks":   return <MyTasksView {...baseProps} onToggleDone={toggleDone} />;
      case "inbox":     return <InboxView inbox={inbox} tasks={tasks} onOpenTask={openTask} onMarkRead={markRead} onMarkAllRead={markAllRead} />;
      case "list":      return <ListView {...baseProps} onToggleDone={toggleDone} groupBy={listGroupBy} onReorderTasks={reorderTasks} />;
      case "kanban":    return <KanbanView {...baseProps} onMoveTask={moveTask} onQuickAdd={(status) => { setQuickAddStatus(status); setQuickAddOpen(true); }} />;
      case "calendar":  return <CalendarView tasks={filteredTasks} onOpenTask={openTask} />;
      case "timeline":  return <TimelineView tasks={filteredTasks} onOpenTask={openTask} />;
      case "clients":   return <ClientsView {...baseProps} timeEntries={timeEntries} focusedClient={focusedClient || clientFilter} setFocusedClient={(id) => { setFocusedClient(id); if (!id) setClientFilter(null); }} />;
      case "timesheet":  return <TimesheetView tasks={tasks} timeEntries={timeEntries} onStartTimer={startTimer} />;
      case "reports":    return <ReportsView tasks={tasks} timeEntries={timeEntries} />;
      case "templates":  return <TemplatesView templates={templates} onOpenTemplate={setOpenTemplateId} onCreate={createTemplate} />;
      default:           return <div className="muted">Coming soon</div>;
    }
  };

  // Crumbs + view-specific topbar extras
  const crumbs = (() => {
    if (view === "clients" && (focusedClient || clientFilter)) {
      const c = CLIENTS.find(x => x.id === (focusedClient || clientFilter));
      return ["Helm", "Clients", c?.name || ""];
    }
    const map = {
      overview: ["Helm", "Overview"], mytasks: ["Helm", "My Tasks"], inbox: ["Helm", "Inbox"],
      list: ["Helm", "All tasks", "List"], kanban: ["Helm", "All tasks", "Board"],
      calendar: ["Helm", "Calendar"], timeline: ["Helm", "Timeline"], clients: ["Helm", "Clients"],
      timesheet: ["Helm", "Timesheet"], reports: ["Helm", "Reports"],
      templates: ["Helm", "Templates"],
    };
    return map[view] || ["Helm"];
  })();

  const viewExtras = (() => {
    if (view === "list") {
      return (
        <div className="viewseg">
          {[["status", "Status"], ["client", "Client"], ["priority", "Priority"]].map(([id, name]) => (
            <button key={id} data-active={listGroupBy === id} onClick={() => setListGroupBy(id)}>{name}</button>
          ))}
        </div>
      );
    }
    if (view === "kanban" || view === "list") {
      // chip bar with filters could go here, but we put it in content
    }
    return null;
  })();

  const isFlush = view === "kanban";
  const isTimingThis = timer.taskId === openTaskId && timer.running;

  // active filter chips bar (above main content for most views)
  const filterBar = (
    (clientFilter || tagFilter || savedView) && view !== "clients" ? (
      <div className="filter-bar">
        <Icon name="filter" size={14} className="muted" />
        <span className="text-xs muted">Filtered by:</span>
        {clientFilter && (
          <button className="filter-chip" data-active onClick={() => setClientFilter(null)}>
            <span className="client-swatch" style={{ background: CLIENTS.find(c => c.id === clientFilter)?.color }} />
            {CLIENTS.find(c => c.id === clientFilter)?.name}
            <Icon name="x" size={12} className="x" />
          </button>
        )}
        {tagFilter && (
          <button className="filter-chip" data-active onClick={() => setTagFilter(null)}>
            <Tag tag={tagFilter} />
            <Icon name="x" size={12} className="x" />
          </button>
        )}
        {savedView && (
          <button className="filter-chip" data-active onClick={() => setSavedView(null)}>
            <Icon name={savedView.icon} size={12} />
            {savedView.name}
            <Icon name="x" size={12} className="x" />
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => { setClientFilter(null); setTagFilter(null); setSavedView(null); }} style={{ marginLeft: 4 }}>Clear all</button>
      </div>
    ) : null
  );

  return (
    <div className="app" data-collapsed={sidebarCollapsed}>
      <Sidebar
        view={view}
        setView={(v) => { setView(v); if (v !== "clients") setFocusedClient(null); setSavedView(null); }}
        clientFilter={clientFilter} setClientFilter={setClientFilter}
        tagFilter={tagFilter} setTagFilter={setTagFilter}
        tasks={tasks}
        inboxUnread={inboxUnread}
        onQuickAdd={() => { setQuickAddStatus("todo"); setQuickAddOpen(true); }}
        collapsed={sidebarCollapsed}
        me={profile}
        onOpenProfile={() => setProfileOpen(true)}
        onNewClient={() => setClientModalOpen(true)}
        onNewTag={() => setTagModalOpen(true)}
        onSavedView={handleSavedView}
      />
      <div className="main">
        <Topbar
          crumbs={crumbs}
          onSearch={() => setCmdkOpen(true)}
          onQuickAdd={() => setQuickAddOpen(true)}
          theme={theme}
          setTheme={setTheme}
          onToggleSidebar={() => setTweak("sidebarCollapsed", !sidebarCollapsed)}
          viewExtras={viewExtras}
        />
        <div className={`content ${isFlush ? "flush" : ""}`}>
          {!isFlush && filterBar}
          {renderView()}
        </div>
      </div>

      {tweaks.showFloatingTimer && (
        <FloatingTimer
          timer={timer}
          onStop={() => stopTimer()}
          onResume={resumeTimer}
          onToggleBillable={() => setTimer(t => ({ ...t, billable: !t.billable }))}
          tasks={tasks}
          onOpenTask={openTask}
        />
      )}

      <TaskPanel
        taskId={openTaskId}
        tasks={tasks}
        onClose={closeTask}
        onUpdate={updateTask}
        onStartTimer={startTimer}
        isTimingThis={isTimingThis}
        onDeleteTask={deleteTask}
        onDuplicateTask={duplicateTask}
        onAddTimeEntry={addTimeEntry}
        me={profile}
      />

      <CmdK
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        tasks={tasks}
        onPick={(id) => openTask(id)}
        onJump={(v, clientId) => { setView(v); if (clientId) { setFocusedClient(clientId); setClientFilter(clientId); } }}
      />

      <QuickAdd
        open={quickAddOpen}
        onClose={() => { setQuickAddOpen(false); setQuickAddStatus("todo"); }}
        onCreate={createTask}
        defaultStatus={quickAddStatus}
      />

      {clientModalOpen && <ClientModal onClose={() => setClientModalOpen(false)} onCreate={createClient} />}
      {tagModalOpen && <TagModal onClose={() => setTagModalOpen(false)} onCreate={createTag} />}

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        me={profile}
        onUpdate={updateProfile}
      />

      {openTemplateId && (
        <TemplatePanel
          templateId={openTemplateId}
          templates={templates}
          onClose={() => setOpenTemplateId(null)}
          onUpdate={updateTemplate}
          onDelete={deleteTemplate}
          onUse={applyTemplate}
        />
      )}

      <ToastZone toasts={toasts} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio
          label="Mode"
          value={tweaks.theme}
          options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakColor
          label="Accent"
          value={tweaks.accent}
          options={ACCENT_OPTIONS.map(o => o.value)}
          onChange={(v) => setTweak("accent", v)}
        />

        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={tweaks.density}
          options={[{ value: "comfy", label: "Comfy" }, { value: "compact", label: "Compact" }]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakToggle label="Collapsed sidebar" value={tweaks.sidebarCollapsed} onChange={(v) => setTweak("sidebarCollapsed", v)} />
        <TweakToggle label="Floating timer" value={tweaks.showFloatingTimer} onChange={(v) => setTweak("showFloatingTimer", v)} />

        <TweakSection label="Try it" />
        <TweakButton label="Edit profile" onClick={() => setProfileOpen(true)} />
        <TweakButton label="Open ⌘K search" onClick={() => setCmdkOpen(true)} />
        <TweakButton label="Quick-add task" onClick={() => setQuickAddOpen(true)} />
        <TweakButton
          label={timer.running ? "Pause timer" : "Start timer on first open task"}
          onClick={() => {
            if (timer.running) stopTimer();
            else if (timer.taskId) resumeTimer();
            else startTimer(tasks.find(t => t.status !== "done")?.id);
          }}
        />
        <TweakButton
          label="Reset all data"
          onClick={() => {
            fetch("/api/reset", { method: "POST" }).catch(() => {});
            const s = seedStore();
            setProfile(s.profile); setTasks(s.tasks);
            setTimeEntries(s.timeEntries); setInbox(s.inbox); setTemplates(s.templates);
            pushToast("Data reset to sample workspace", { icon: "repeat" });
          }}
        />
      </TweaksPanel>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
