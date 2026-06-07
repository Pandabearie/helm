// ============ Helm — UI primitives & icons ============

const Icon = ({ name, size = 16, stroke = 1.75, ...rest }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", ...rest };
  switch (name) {
    case "home":      return <svg {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case "inbox":     return <svg {...p}><path d="M3 12l3-8h12l3 8"/><path d="M3 12v8h18v-8"/><path d="M3 12h5l1 3h6l1-3h5"/></svg>;
    case "calendar":  return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case "timeline":  return <svg {...p}><path d="M3 6h10M3 12h14M3 18h7"/><circle cx="15" cy="6" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>;
    case "list":      return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "kanban":    return <svg {...p}><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/></svg>;
    case "reports":   return <svg {...p}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>;
    case "timer":     return <svg {...p}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>;
    case "mytasks":   return <svg {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-4 3.5-7 7-7s7 3 7 7"/></svg>;
    case "clients":   return <svg {...p}><circle cx="9" cy="9" r="3"/><circle cx="17" cy="11" r="2"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M14 19c0-2 1.5-3.5 4-3.5"/></svg>;
    case "search":    return <svg {...p}><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>;
    case "plus":      return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "x":         return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "check":     return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case "chev-down": return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case "chev-right":return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case "chev-left": return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case "menu":      return <svg {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "more":      return <svg {...p}><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>;
    case "sun":       return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>;
    case "moon":      return <svg {...p}><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>;
    case "play":      return <svg {...p} fill="currentColor" stroke="none"><path d="M7 5v14l12-7z"/></svg>;
    case "pause":     return <svg {...p} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
    case "filter":    return <svg {...p}><path d="M3 6h18M6 12h12M10 18h4"/></svg>;
    case "tag":       return <svg {...p}><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="8" r="1.4"/></svg>;
    case "flag":      return <svg {...p}><path d="M5 21V4h11l-2 4 2 4H5"/></svg>;
    case "flame":     return <svg {...p}><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-1-3 1-5 3-6z"/></svg>;
    case "lock":      return <svg {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case "receipt":   return <svg {...p}><path d="M5 3h14v18l-2-1-2 1-2-1-2 1-2-1-2 1-2-1V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>;
    case "bell":      return <svg {...p}><path d="M6 18a6 6 0 1 1 12 0M12 4v2M10 21a2 2 0 0 0 4 0"/></svg>;
    case "settings":  return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2L5 5.8l-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></svg>;
    case "user":      return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case "atsign":    return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>;
    case "msg":       return <svg {...p}><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1 4.5A8 8 0 0 1 21 12z"/></svg>;
    case "link":      return <svg {...p}><path d="M10 14l4-4M9 7l1-1a4 4 0 0 1 6 6l-1 1M15 17l-1 1a4 4 0 0 1-6-6l1-1"/></svg>;
    case "attach":    return <svg {...p}><path d="M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>;
    case "repeat":    return <svg {...p}><path d="M17 2l4 4-4 4M3 12V8a2 2 0 0 1 2-2h16"/><path d="M7 22l-4-4 4-4M21 12v4a2 2 0 0 1-2 2H3"/></svg>;
    case "expand":    return <svg {...p}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>;
    case "collapse":  return <svg {...p}><path d="M9 3v6H3M15 21v-6h6M9 9L3 3M15 15l6 6"/></svg>;
    case "sidebar":   return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>;
    case "drag":      return <svg {...p}><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>;
    case "trash":     return <svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>;
    case "edit":      return <svg {...p}><path d="M4 20h4l12-12a2.8 2.8 0 0 0-4-4L4 16v4z"/></svg>;
    case "layers":    return <svg {...p}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
    case "circle":    return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
    default:          return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

// ============ shared bits ============

const Avatar = ({ user, size = "md" }) => {
  const u = typeof user === "string" ? ALL_USERS.find(x => x.id === user) : user;
  if (!u) return null;
  const hash = u.id.split("").reduce((a,c)=>a+c.charCodeAt(0), 0);
  const hues = [200, 260, 320, 30, 150, 90];
  const h = hues[hash % hues.length];
  return (
    <div className={`avatar ${size}`} style={{ background: `linear-gradient(135deg, hsl(${h}, 70%, 55%), hsl(${(h+40)%360}, 70%, 45%))` }} title={u.name}>
      {u.initials}
    </div>
  );
};

const AvatarStack = ({ users, max = 3, size = "sm" }) => {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div style={{ display: "inline-flex" }}>
      {shown.map((u, i) => (
        <div key={u.id || u} style={{ marginLeft: i === 0 ? 0 : -6 }}>
          <Avatar user={u} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div className={`avatar ${size}`} style={{ marginLeft: -6, background: "var(--surface-3)", color: "var(--text-2)" }}>+{extra}</div>
      )}
    </div>
  );
};

const StatusDot = ({ status }) => <span className={`status-dot ${status}`} />;

const PriorityPill = ({ p }) => {
  const label = p === "p1" ? "P1" : p === "p2" ? "P2" : "P3";
  return <span className={`pill ${p}`}>{label}</span>;
};

const Tag = ({ tag }) => {
  const obj = typeof tag === "string" ? TAGS.find(t => t.id === tag) : tag;
  if (!obj) return null;
  return (
    <span className="tag">
      <span className="dot" style={{ background: obj.color }} />
      {obj.name}
    </span>
  );
};

const ClientTag = ({ clientId }) => {
  const c = CLIENTS.find(x => x.id === clientId);
  if (!c) return null;
  return (
    <span className="tag" style={{ background: c.color + "22", color: c.color }}>
      <span className="dot" style={{ background: c.color }} />
      {c.name}
    </span>
  );
};

const Checkbox = ({ checked, onClick }) => (
  <button className={`cb ${checked ? "checked" : ""}`} onClick={onClick}>
    {checked && <Icon name="check" size={10} stroke={3} />}
  </button>
);

// human-friendly date
const fmtRelDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  const diff = Math.round((date - TODAY) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0 && diff < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  if (diff < 0 && diff > -7) return `${-diff}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fmtMinutes = (m) => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
};

const fmtHMS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
};

const isOverdue = (task) => task.due && task.status !== "done" && new Date(task.due) < TODAY;

// ============ sidebar ============

const Sidebar = ({ view, setView, clientFilter, setClientFilter, tagFilter, setTagFilter, tasks, inboxUnread, onQuickAdd, collapsed, me, onOpenProfile, onNewClient, onNewTag, onSavedView }) => {
  const countBy = (filter) => tasks.filter(filter).length;
  const navItems = [
    { id: "overview",  name: "Overview",      icon: "home" },
    { id: "mytasks",   name: "My Tasks",      icon: "mytasks", badge: countBy(t => t.status !== "done" && t.assignees.includes("u-me")) },
    { id: "inbox",     name: "Inbox",         icon: "inbox", badge: inboxUnread, accent: inboxUnread > 0 },
    { id: "list",      name: "List",          icon: "list" },
    { id: "kanban",    name: "Board",         icon: "kanban" },
    { id: "calendar",  name: "Calendar",      icon: "calendar" },
    { id: "timeline",  name: "Timeline",      icon: "timeline" },
    { id: "clients",   name: "Clients",       icon: "clients" },
    { id: "timesheet",  name: "Timesheet",   icon: "timer" },
    { id: "reports",    name: "Reports",     icon: "reports" },
    { id: "templates",  name: "Templates",   icon: "layers" },
  ];

  if (collapsed) {
    return (
      <aside className="sidebar">
        <div style={{ padding: "16px 0", display: "flex", justifyContent: "center" }}>
          <div className="brand" style={{ fontSize: 22 }}>h<span className="brand-dot">.</span></div>
        </div>
        <div className="sidebar-section" style={{ padding: "4px" }}>
          {navItems.map(it => (
            <button key={it.id} className="nav-item" data-active={view === it.id} onClick={() => setView(it.id)} title={it.name} style={{ justifyContent: "center", padding: 8 }}>
              <Icon name={it.icon} size={18} />
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ flex: 1 }}>
          <div className="brand">Helm<span className="brand-dot">.</span></div>
          <div className="brand-meta">{(me?.name || ME.name).split(" ")[0]}'s practice</div>
        </div>
      </div>

      <div className="sidebar-section">
        {navItems.map(it => (
          <button key={it.id} className="nav-item" data-active={view === it.id} onClick={() => setView(it.id)}>
            <Icon name={it.icon} className="icon" size={16} />
            <span>{it.name}</span>
            {it.badge ? <span className={`badge ${it.accent ? "accent" : ""}`}>{it.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">
          <span>Clients</span>
          <button title="New client" onClick={onNewClient}><Icon name="plus" size={14} /></button>
        </div>
        {CLIENTS.map(c => {
          const ct = countBy(t => t.client === c.id && t.status !== "done");
          return (
            <button
              key={c.id}
              className="client-row"
              data-active={clientFilter === c.id}
              onClick={() => { setClientFilter(clientFilter === c.id ? null : c.id); setView("clients"); }}
              style={clientFilter === c.id ? { background: "var(--surface)", color: "var(--text)", fontWeight: 500 } : null}
            >
              <span className="client-swatch" style={{ background: c.color }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
              <span className="client-count">{ct}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">
          <span>Tags</span>
          <button title="New tag" onClick={onNewTag}><Icon name="plus" size={14} /></button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "4px 10px 8px" }}>
          {TAGS.map(tg => (
            <button key={tg.id}
              onClick={() => setTagFilter(tagFilter === tg.id ? null : tg.id)}
              className="tag"
              style={tagFilter === tg.id ? { background: tg.color + "22", color: tg.color, outline: `1px solid ${tg.color}` } : {}}>
              <span className="dot" style={{ background: tg.color }} />
              {tg.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label"><span>Saved Views</span></div>
        {SAVED_VIEWS.map(sv => (
          <button key={sv.id} className="nav-item" style={{ fontSize: 12.5 }} onClick={() => onSavedView && onSavedView(sv)}>
            <Icon name={sv.icon} className="icon" size={14} />
            <span>{sv.name}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-foot">
        <button className="sidebar-foot-btn" onClick={onOpenProfile} title="Edit profile">
          <Avatar user={me || ME} size="md" />
          <div className="name-min" style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me?.name || ME.name}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{me?.role || ME.role}</div>
          </div>
        </button>
        <button className="btn-ghost" title="Edit profile" onClick={onOpenProfile} style={{ padding: 4, color: "var(--muted)" }}><Icon name="settings" size={16} /></button>
      </div>
    </aside>
  );
};

// ============ topbar ============

const Topbar = ({ crumbs, onSearch, onQuickAdd, theme, setTheme, onToggleSidebar, viewExtras }) => (
  <header className="topbar">
    <button className="btn btn-ghost btn-icon" onClick={onToggleSidebar} title="Toggle sidebar"><Icon name="sidebar" size={16} /></button>
    <div className="crumbs">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          <span className={i === crumbs.length - 1 ? "current" : ""}>{c}</span>
        </React.Fragment>
      ))}
    </div>
    <div className="topbar-spacer" />
    {viewExtras}
    <button className="search-trigger" onClick={onSearch}>
      <Icon name="search" size={14} />
      <span>Search tasks, clients…</span>
      <span className="kbd">⌘K</span>
    </button>
    <button className="btn btn-ghost btn-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
      <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
    </button>
    <button className="btn btn-primary" onClick={onQuickAdd}>
      <Icon name="plus" size={14} stroke={2.5} />
      <span>New task</span>
    </button>
  </header>
);

// ============ floating timer ============

const FloatingTimer = ({ timer, onStop, onResume, onToggleBillable, tasks, onOpenTask }) => {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    if (!timer.running) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [timer.running]);

  const elapsed = timer.running
    ? Math.floor((now - timer.startedAt) / 1000) + timer.accumulated
    : timer.accumulated;

  const task = tasks.find(t => t.id === timer.taskId);

  return (
    <div className={`timer-fab ${timer.running ? "running" : ""}`}>
      {timer.running ? <span className="pulse-dot" /> : <Icon name="timer" size={14} stroke={2} />}
      <div className="timer-task" onClick={() => task && onOpenTask(task.id)} style={{ cursor: task ? "pointer" : "default" }}>
        {task ? task.title : <span style={{ color: "var(--faint)" }}>No task selected</span>}
      </div>
      <span className={`timer-time ${timer.running ? "live" : ""}`}>{fmtHMS(elapsed)}</span>
      <button
        onClick={onToggleBillable}
        title={timer.billable !== false ? "Billable — click to mark non-billable" : "Non-billable — click to mark billable"}
        style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, padding: "0 4px", color: timer.billable !== false ? "var(--accent)" : "var(--muted)", lineHeight: 1 }}
      >$</button>
      {timer.running ? (
        <button className="timer-btn pause" onClick={onStop} title="Pause"><Icon name="pause" size={14} /></button>
      ) : (
        <button className="timer-btn" onClick={onResume} title={timer.taskId ? "Resume timer" : "Start a timer from any task"} disabled={!timer.taskId}><Icon name="play" size={14} /></button>
      )}
    </div>
  );
};

// ============ cmd+k ============

const CmdK = ({ open, onClose, tasks, onPick, onJump }) => {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const ql = q.toLowerCase();
  const matchedTasks = ql ? tasks.filter(t => t.title.toLowerCase().includes(ql)).slice(0, 6) : tasks.filter(t => t.status !== "done").slice(0, 5);
  const matchedClients = ql ? CLIENTS.filter(c => c.name.toLowerCase().includes(ql)) : [];
  const jumps = [
    { id: "overview", name: "Go to Overview", icon: "home" },
    { id: "mytasks", name: "Go to My Tasks", icon: "mytasks" },
    { id: "kanban", name: "Go to Board", icon: "kanban" },
    { id: "calendar", name: "Go to Calendar", icon: "calendar" },
    { id: "timeline", name: "Go to Timeline", icon: "timeline" },
    { id: "clients", name: "Go to Clients", icon: "clients" },
    { id: "timesheet", name: "Go to Timesheet", icon: "timer" },
    { id: "reports", name: "Go to Reports", icon: "reports" },
  ].filter(j => !ql || j.name.toLowerCase().includes(ql));

  const flat = [
    ...matchedTasks.map(t => ({ kind: "task", item: t })),
    ...matchedClients.map(c => ({ kind: "client", item: c })),
    ...jumps.map(j => ({ kind: "jump", item: j })),
  ];

  const handleKey = (e) => {
    if (e.key === "Escape") { onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(flat.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[sel];
      if (!item) return;
      if (item.kind === "task") onPick(item.item.id);
      else if (item.kind === "jump") onJump(item.item.id);
      else if (item.kind === "client") onJump("clients", item.item.id);
      onClose();
    }
  };

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={e => e.stopPropagation()}>
        <div className="cmdk-input-wrap">
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search tasks, clients, or jump to a view…"
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
            onKeyDown={handleKey}
          />
          <span className="kbd" style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "1px 5px", background: "var(--surface-2)", borderRadius: 4, color: "var(--muted)" }}>ESC</span>
        </div>
        <div className="cmdk-results">
          {matchedTasks.length > 0 && <div className="cmdk-group-label">Tasks</div>}
          {matchedTasks.map((t, idx) => (
            <div key={t.id} className={`cmdk-item ${sel === idx ? "sel" : ""}`} onMouseEnter={() => setSel(idx)} onClick={() => { onPick(t.id); onClose(); }}>
              <StatusDot status={t.status} />
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</span>
              {t.client && <ClientTag clientId={t.client} />}
              <span className="meta">{fmtRelDate(t.due)}</span>
            </div>
          ))}
          {matchedClients.length > 0 && <div className="cmdk-group-label">Clients</div>}
          {matchedClients.map((c, i) => {
            const idx = matchedTasks.length + i;
            return (
              <div key={c.id} className={`cmdk-item ${sel === idx ? "sel" : ""}`} onMouseEnter={() => setSel(idx)} onClick={() => { onJump("clients", c.id); onClose(); }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: c.color }} />
                <span>{c.name}</span>
                <span className="meta">Client</span>
              </div>
            );
          })}
          {jumps.length > 0 && <div className="cmdk-group-label">Jump to</div>}
          {jumps.map((j, i) => {
            const idx = matchedTasks.length + matchedClients.length + i;
            return (
              <div key={j.id} className={`cmdk-item ${sel === idx ? "sel" : ""}`} onMouseEnter={() => setSel(idx)} onClick={() => { onJump(j.id); onClose(); }}>
                <Icon name={j.icon} size={14} />
                <span>{j.name}</span>
              </div>
            );
          })}
          {flat.length === 0 && (
            <div className="empty-state"><div className="muted">No matches for "{q}"</div></div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ task detail panel ============

const TaskPanel = ({ taskId, tasks, onClose, onUpdate, onStartTimer, isTimingThis, onDeleteTask, onDuplicateTask, onAddTimeEntry, me }) => {
  const task = tasks.find(t => t.id === taskId);
  const [newSub, setNewSub] = React.useState("");
  const [newComment, setNewComment] = React.useState("");
  const [showMore, setShowMore] = React.useState(false);
  const [showTagPicker, setShowTagPicker] = React.useState(false);
  const [showClientPicker, setShowClientPicker] = React.useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = React.useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = React.useState(false);
  const [showBlockedBy, setShowBlockedBy] = React.useState(false);
  const [showRecurring, setShowRecurring] = React.useState(false);
  const [editingSub, setEditingSub] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [showAddTime, setShowAddTime] = React.useState(false);
  const [addTimeDur, setAddTimeDur] = React.useState(30);
  const [addTimeNote, setAddTimeNote] = React.useState("");
  const [addTimeDate, setAddTimeDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [addTimeBillable, setAddTimeBillable] = React.useState(true);

  // Close popovers when task changes
  React.useEffect(() => {
    setShowMore(false); setShowTagPicker(false);
    setShowClientPicker(false); setShowPriorityPicker(false);
    setShowAssigneePicker(false); setShowBlockedBy(false);
    setShowRecurring(false); setShowAddTime(false);
    setEditingSub(null); setConfirmDelete(false);
  }, [taskId]);

  // Click-outside closes popovers
  React.useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest(".popover") && !e.target.closest("[data-popover-trigger]")) {
        setShowMore(false); setShowTagPicker(false);
        setShowClientPicker(false); setShowPriorityPicker(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!task) return null;

  const client = CLIENTS.find(c => c.id === task.client);
  const completed = task.subtasks.filter(s => s.done).length;
  const update = (patch) => onUpdate(task.id, patch);

  const toggleSub = (sid) => update({
    subtasks: task.subtasks.map(s => s.id === sid ? { ...s, done: !s.done } : s)
  });
  const deleteSub = (sid) => update({
    subtasks: task.subtasks.filter(s => s.id !== sid)
  });
  const renameSub = (sid, title) => update({
    subtasks: task.subtasks.map(s => s.id === sid ? { ...s, title } : s)
  });
  const addSub = () => {
    if (!newSub.trim()) return;
    update({ subtasks: [...task.subtasks, { id: `s${Date.now()}`, title: newSub.trim(), done: false }] });
    setNewSub("");
  };
  const addComment = () => {
    if (!newComment.trim()) return;
    update({
      comments: [...task.comments, { id: `cm${Date.now()}`, user: "u-me", text: newComment.trim(), at: new Date() }],
      activity: [...task.activity, { kind: "comment", text: "commented", user: "u-me", at: new Date() }],
    });
    setNewComment("");
  };
  const deleteComment = (cid) => update({ comments: task.comments.filter(c => c.id !== cid) });
  const cycleStatus = () => {
    const order = ["todo", "progress", "review", "done"];
    const i = order.indexOf(task.status);
    update({ status: order[(i + 1) % order.length] });
  };
  const toggleTag = (tid) => update({
    tags: task.tags.includes(tid) ? task.tags.filter(t => t !== tid) : [...task.tags, tid]
  });

  const doDelete = () => {
    setConfirmDelete(false);
    onDeleteTask(task.id);
    onClose();
  };

  return (
    <>
      <div className={`panel-overlay ${taskId ? "open" : ""}`} onClick={onClose} />
      <aside className={`task-panel ${taskId ? "open" : ""}`}>
        <div className="tp-head">
          <button className="btn btn-ghost btn-sm" onClick={cycleStatus} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StatusDot status={task.status} />
            <span>{STATUSES.find(s => s.id === task.status)?.name}</span>
          </button>
          {task.recurring && <span className="tag" title={`Recurs ${task.recurring}`}><Icon name="repeat" size={11} /> {task.recurring}</span>}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-icon" onClick={() => onStartTimer(task.id)} title={isTimingThis ? "Tracking…" : "Start timer"}>
            <Icon name={isTimingThis ? "pause" : "play"} size={14} />
          </button>
          <div style={{ position: "relative" }}>
            <button data-popover-trigger className="btn btn-ghost btn-icon" onClick={() => setShowMore(o => !o)} title="More">
              <Icon name="more" size={16} />
            </button>
            {showMore && (
              <div className="popover" style={{ top: 32, right: 0, minWidth: 200 }}>
                <button className="popover-item" onClick={() => { update({ status: task.status === "done" ? "todo" : "done" }); setShowMore(false); }}>
                  <Icon name="check" size={14} /> Mark {task.status === "done" ? "incomplete" : "complete"}
                </button>
                <button className="popover-item" onClick={() => { onDuplicateTask && onDuplicateTask(task.id); setShowMore(false); }}>
                  <Icon name="repeat" size={14} /> Duplicate task
                </button>
                <div className="popover-divider" />
                <button className="popover-item" onClick={() => setShowRecurring(o => !o)}>
                  <Icon name="repeat" size={14} />
                  <span style={{ flex:1 }}>Recurring{task.recurring ? ` · ${task.recurring}` : ""}</span>
                  <Icon name={showRecurring ? "chev-down" : "chev-right"} size={12} />
                </button>
                {showRecurring && (
                  <div style={{ padding: "0 0 4px" }}>
                    {[["none","No recurrence"],["daily","Daily"],["weekly","Weekly"],["monthly","Monthly"],["quarterly","Quarterly"]].map(([v, label]) => (
                      <button key={v} className="popover-item" style={{ paddingLeft: 28, fontSize: 12.5 }} onClick={() => { update({ recurring: v === "none" ? null : v }); setShowRecurring(false); setShowMore(false); }}>
                        <span style={{ flex:1 }}>{label}</span>
                        {((v === "none" && !task.recurring) || task.recurring === v) && <Icon name="check" size={12} style={{ color:"var(--accent)" }} />}
                      </button>
                    ))}
                  </div>
                )}
                <div className="popover-divider" />
                <button className="popover-item danger" onClick={() => { setConfirmDelete(true); setShowMore(false); }}>
                  <Icon name="trash" size={14} /> Delete task
                </button>
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div className="tp-body">
          <input
            className="tp-title"
            value={task.title}
            placeholder="Untitled task"
            onChange={e => update({ title: e.target.value })}
          />

          <div style={{ marginTop: 10 }}>
            {/* Client */}
            <div className="tp-row">
              <span className="lbl">Client</span>
              <div style={{ position: "relative" }}>
                <button data-popover-trigger className="field-edit" onClick={() => setShowClientPicker(o => !o)}>
                  {client ? <ClientTag clientId={client.id} /> : <span className="placeholder">No client</span>}
                </button>
                {showClientPicker && (
                  <div className="popover" style={{ top: 36, left: 0, maxHeight: 280, overflowY: "auto" }}>
                    <button className="popover-item" onClick={() => { update({ client: null }); setShowClientPicker(false); }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--muted)" }} /> No client
                    </button>
                    <div className="popover-divider" />
                    {CLIENTS.map(c => (
                      <button key={c.id} className="popover-item" onClick={() => { update({ client: c.id }); setShowClientPicker(false); }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color }} />
                        <span>{c.name}</span>
                        {task.client === c.id && <Icon name="check" size={12} stroke={2.5} style={{ marginLeft: "auto", color: "var(--accent)" }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="tp-row">
              <span className="lbl">Priority</span>
              <div style={{ position: "relative" }}>
                <button data-popover-trigger className="field-edit" onClick={() => setShowPriorityPicker(o => !o)}>
                  <PriorityPill p={task.priority} />
                  <span style={{ color: "var(--muted)", fontSize: 12 }}>{PRIORITIES.find(p => p.id === task.priority)?.name.split("·")[1]?.trim()}</span>
                </button>
                {showPriorityPicker && (
                  <div className="popover" style={{ top: 36, left: 0 }}>
                    {PRIORITIES.map(p => (
                      <button key={p.id} className="popover-item" onClick={() => { update({ priority: p.id }); setShowPriorityPicker(false); }}>
                        <PriorityPill p={p.id} />
                        <span>{p.name.split("·")[1]?.trim()}</span>
                        {task.priority === p.id && <Icon name="check" size={12} stroke={2.5} style={{ marginLeft: "auto", color: "var(--accent)" }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assignees */}
            <div className="tp-row">
              <span className="lbl">Assignees</span>
              <div style={{ position: "relative" }}>
                <button data-popover-trigger className="field-edit" style={{ display:"flex", alignItems:"center", gap:6 }} onClick={() => setShowAssigneePicker(o => !o)}>
                  <AvatarStack users={task.assignees} max={4} size="sm" />
                  <Icon name="plus" size={12} style={{ color:"var(--muted)" }} />
                </button>
                {showAssigneePicker && (
                  <div className="popover" style={{ top: 36, left: 0, minWidth: 180 }}>
                    {ALL_USERS.map(u => {
                      const assigned = task.assignees.includes(u.id);
                      return (
                        <button key={u.id} className="popover-item" onClick={() => {
                          const next = assigned
                            ? task.assignees.filter(id => id !== u.id)
                            : [...task.assignees, u.id];
                          update({ assignees: next.length > 0 ? next : task.assignees });
                        }}>
                          <Avatar user={u} size="sm" />
                          <span style={{ flex:1 }}>{u.name}</span>
                          {assigned && <Icon name="check" size={12} stroke={2.5} style={{ color:"var(--accent)" }} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Due date — editable */}
            <div className="tp-row">
              <span className="lbl">Due date</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="date"
                  className="field-edit"
                  style={{ color: isOverdue(task) ? "var(--p1)" : "var(--text)", maxWidth: 180 }}
                  value={task.due ? fmtDate(new Date(task.due)) : ""}
                  onChange={e => update({ due: e.target.value ? new Date(e.target.value) : null })}
                />
                {task.due && <button className="btn-ghost btn-icon" title="Clear due date" onClick={() => update({ due: null })} style={{ width: 22, height: 22, color: "var(--muted)" }}><Icon name="x" size={12} /></button>}
                {task.due && <span className="text-xs muted">· {fmtRelDate(task.due)}</span>}
              </div>
            </div>

            {/* Time + manual log */}
            <div className="tp-row" style={{ alignItems: "flex-start" }}>
              <span className="lbl" style={{ paddingTop: 5 }}>Time</span>
              <div style={{ flex: 1 }}>
                <div className="text-mono" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "var(--text)" }}>{fmtMinutes(task.logged)}</span>
                  <span className="muted">/</span>
                  <input type="number" className="field-edit" style={{ width: 70, padding: "3px 6px" }} min={0} step={15}
                    value={task.estimate || 0} onChange={e => update({ estimate: parseInt(e.target.value, 10) || 0 })} />
                  <span className="muted">min est.</span>
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: 4, fontSize: 11, padding: "2px 7px", color: "var(--accent)" }}
                    onClick={() => setShowAddTime(o => !o)} title="Log time manually">
                    + log time
                  </button>
                </div>
                {showAddTime && (
                  <div style={{ marginTop: 8, background: "var(--surface-2)", borderRadius: "var(--radius)", padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: "var(--text-2)" }}>Log time manually</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>Minutes</div>
                        <input type="number" className="field-edit" style={{ width: "100%" }} min={1} value={addTimeDur} onChange={e => setAddTimeDur(e.target.value)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>Date</div>
                        <input type="date" className="field-edit" style={{ width: "100%" }} value={addTimeDate} onChange={e => setAddTimeDate(e.target.value)} />
                      </div>
                    </div>
                    <input className="field-edit" style={{ width: "100%", marginBottom: 8 }} placeholder="Note (optional)" value={addTimeNote} onChange={e => setAddTimeNote(e.target.value)} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer", color: "var(--text-2)" }}>
                        <input type="checkbox" checked={addTimeBillable} onChange={e => setAddTimeBillable(e.target.checked)} /> Billable
                      </label>
                      <div style={{ flex: 1 }} />
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowAddTime(false)}>Cancel</button>
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        onAddTimeEntry && onAddTimeEntry(task.id, { duration: Number(addTimeDur) || 30, note: addTimeNote, date: addTimeDate ? new Date(addTimeDate) : new Date(), billable: addTimeBillable });
                        setShowAddTime(false); setAddTimeDur(30); setAddTimeNote(""); setAddTimeDate(new Date().toISOString().slice(0, 10)); setAddTimeBillable(true);
                      }}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Blocked by */}
            <div className="tp-row" style={{ alignItems: "flex-start", minHeight: 36 }}>
              <span className="lbl" style={{ paddingTop: 6 }}>Blocked by</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, position: "relative", flex: 1 }}>
                {(task.blockedBy || []).map(bid => {
                  const bt = tasks.find(t => t.id === bid);
                  return bt ? (
                    <span key={bid} className="tag" style={{ background: "var(--p1-soft, #ffe4e6)", color: "var(--p1)" }}>
                      <Icon name="lock" size={10} />
                      <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bt.title}</span>
                      <button className="tag-x" onClick={() => update({ blockedBy: (task.blockedBy || []).filter(id => id !== bid) })}><Icon name="x" size={9} /></button>
                    </span>
                  ) : null;
                })}
                <button data-popover-trigger className="tag" onClick={() => setShowBlockedBy(o => !o)}
                  style={{ background: "var(--surface-2)", border: "1px dashed var(--border-strong)", cursor: "pointer" }}>
                  <Icon name="plus" size={10} stroke={2.5} /> add
                </button>
                {showBlockedBy && (
                  <div className="popover" style={{ top: 32, left: 0, maxHeight: 220, overflowY: "auto", minWidth: 220 }}>
                    <div style={{ padding: "6px 10px 4px", fontSize: 11, color: "var(--muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Block this task on…</div>
                    {tasks.filter(t => t.id !== task.id && t.status !== "done").map(t => {
                      const isBlocking = (task.blockedBy || []).includes(t.id);
                      return (
                        <button key={t.id} className="popover-item" onClick={() => {
                          const next = isBlocking ? (task.blockedBy || []).filter(id => id !== t.id) : [...(task.blockedBy || []), t.id];
                          update({ blockedBy: next });
                        }}>
                          <StatusDot status={t.status} />
                          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                          {isBlocking && <Icon name="check" size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Tags — editable */}
            <div className="tp-row" style={{ alignItems: "flex-start", minHeight: 40 }}>
              <span className="lbl" style={{ paddingTop: 6 }}>Tags</span>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", position: "relative" }}>
                {task.tags.map(tid => {
                  const tg = TAGS.find(x => x.id === tid);
                  if (!tg) return null;
                  return (
                    <span key={tid} className="tag tag-removable" style={{ background: tg.color + "22", color: tg.color }}>
                      <span className="dot" style={{ background: tg.color }} />
                      {tg.name}
                      <button className="tag-x" onClick={() => toggleTag(tid)} title="Remove tag"><Icon name="x" size={9} stroke={2.5} /></button>
                    </span>
                  );
                })}
                <button data-popover-trigger className="tag" onClick={() => setShowTagPicker(o => !o)} style={{ background: "var(--surface-2)", border: "1px dashed var(--border-strong)", cursor: "pointer" }}>
                  <Icon name="plus" size={10} stroke={2.5} /> tag
                </button>
                {showTagPicker && (
                  <div className="popover" style={{ top: 32, left: 0, maxHeight: 260, overflowY: "auto" }}>
                    {TAGS.map(tg => {
                      const on = task.tags.includes(tg.id);
                      return (
                        <button key={tg.id} className="popover-item" onClick={() => toggleTag(tg.id)}>
                          <span style={{ width: 10, height: 10, borderRadius: 999, background: tg.color }} />
                          <span>{tg.name}</span>
                          {on && <Icon name="check" size={12} stroke={2.5} style={{ marginLeft: "auto", color: "var(--accent)" }} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tp-section-title">Description</div>
          <textarea
            className="tp-desc"
            placeholder="Add a description…"
            value={task.description || ""}
            onChange={e => update({ description: e.target.value })}
          />

          <div className="tp-section-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Subtasks · {completed}/{task.subtasks.length}</span>
          </div>
          {task.subtasks.map(s => (
            <div key={s.id} className={`subtask ${s.done ? "done" : ""}`}>
              <Checkbox checked={s.done} onClick={() => toggleSub(s.id)} />
              <input
                className="sub-title"
                value={s.title}
                onChange={e => renameSub(s.id, e.target.value)}
                onFocus={() => setEditingSub(s.id)}
                onBlur={() => setEditingSub(null)}
              />
              <button className="sub-x" onClick={() => deleteSub(s.id)} title="Delete subtask">
                <Icon name="x" size={12} />
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8 }}>
            <Icon name="plus" size={14} stroke={2} className="muted" />
            <input
              placeholder="Add a subtask…"
              value={newSub}
              onChange={e => setNewSub(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSub()}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, padding: "4px 0" }}
            />
          </div>

          <div className="tp-section-title">Activity</div>
          {task.activity.length === 0 ? (
            <div className="muted text-sm">No activity yet.</div>
          ) : task.activity.slice(-5).reverse().map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-icon"><Icon name={a.kind === "comment" ? "msg" : a.kind === "status" ? "circle" : "edit"} size={11} /></div>
              <div style={{ flex: 1 }}>
                <div className="activity-text"><strong>{ALL_USERS.find(u => u.id === a.user)?.name || me?.name || "You"}</strong> {a.text}</div>
                <div className="activity-time">{fmtRelDate(a.at)}</div>
              </div>
            </div>
          ))}

          <div className="tp-section-title">Comments · {task.comments.length}</div>
          {task.comments.map(c => (
            <div key={c.id} className="comment" style={{ position: "relative" }}>
              <Avatar user={c.user === "u-me" ? me : c.user} size="sm" />
              <div className="comment-body">
                <span className="who">{c.user === "u-me" ? me?.name : ALL_USERS.find(u => u.id === c.user)?.name}</span>
                <span className="when">{fmtRelDate(c.at)}</span>
                <div style={{ marginTop: 4 }}>{c.text}</div>
              </div>
              {c.user === "u-me" && (
                <button className="sub-x" onClick={() => deleteComment(c.id)} style={{ opacity: 0, position: "absolute", top: 14, right: 8 }} title="Delete comment"><Icon name="x" size={12} /></button>
              )}
            </div>
          ))}
          <div className="comment" style={{ alignItems: "flex-start" }}>
            <Avatar user={me} size="sm" />
            <div style={{ flex: 1 }}>
              <textarea
                className="tp-desc"
                placeholder="Add a comment…"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ minHeight: 40 }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                <button className="btn btn-primary btn-sm" onClick={addComment} disabled={!newComment.trim()}>Post</button>
              </div>
            </div>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </aside>

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)} style={{ zIndex: 65 }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2 className="h2">Delete task?</h2>
            </div>
            <div className="modal-body">
              <div className="confirm-msg">"<strong>{task.title}</strong>" will be permanently deleted.</div>
              <div className="confirm-sub">Subtasks, comments, and time entries for this task will also be removed.</div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="btn" style={{ background: "var(--p1)", borderColor: "var(--p1)", color: "white" }} onClick={doDelete}>Delete task</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============ profile modal ============

const ProfileModal = ({ open, onClose, me, onUpdate }) => {
  const [name, setName] = React.useState(me?.name || "");
  const [role, setRole] = React.useState(me?.role || "");
  const [initials, setInitials] = React.useState(me?.initials || "");

  React.useEffect(() => {
    if (open) {
      setName(me?.name || ""); setRole(me?.role || ""); setInitials(me?.initials || "");
    }
  }, [open, me]);

  if (!open) return null;

  // Auto-derive initials from name if user hasn't customized
  const autoInitials = (n) => n.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const submit = () => {
    if (!name.trim()) return;
    onUpdate({ name: name.trim(), role: role.trim() || "Owner", initials: (initials || autoInitials(name)).slice(0, 2).toUpperCase() });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head" style={{ justifyContent: "space-between" }}>
          <h2 className="h2">Profile</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div className="avatar lg" style={{ width: 56, height: 56, fontSize: 20 }}>{(initials || autoInitials(name) || "??").slice(0,2)}</div>
            <div style={{ flex: 1 }}>
              <div className="text-sm muted">Signed in as</div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{name || "Unnamed"}</div>
            </div>
          </div>
          <div className="field-row">
            <label>Name</label>
            <input className="field-input" value={name} onChange={e => { setName(e.target.value); if (!initials || initials === autoInitials(me?.name || "")) setInitials(autoInitials(e.target.value)); }} placeholder="Your name" autoFocus />
          </div>
          <div className="field-row">
            <label>Initials <span className="muted" style={{ fontWeight: 400 }}>· shown on avatars</span></label>
            <input className="field-input" maxLength={2} value={initials} onChange={e => setInitials(e.target.value.toUpperCase())} placeholder={autoInitials(name) || "SP"} style={{ width: 80 }} />
          </div>
          <div className="field-row">
            <label>Role / title</label>
            <input className="field-input" value={role} onChange={e => setRole(e.target.value)} placeholder="Owner, Founder, Designer…" />
          </div>
          <div className="muted text-xs" style={{ marginTop: 8 }}>
            Changes save locally. When you wire up the JSON backend, profile lives in <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "1px 5px", borderRadius: 4 }}>data.profile</code>.
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ============ toast ============
const ToastZone = ({ toasts }) => (
  <div className="toast-zone">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.kind || ""}`}>
        {t.icon && <Icon name={t.icon} size={13} />}
        {t.text}
      </div>
    ))}
  </div>
);

// ============ color presets (shared by client + tag modals) ============
const COLOR_PRESETS = [
  "#0ea5e9","#6366f1","#10b981","#f59e0b","#ef4444","#a855f7",
  "#84cc16","#ec4899","#06b6d4","#f43f5e","#475569","#e11d48",
];

// ============ client modal ============
const ClientModal = ({ onClose, onCreate }) => {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#0ea5e9");
  const [rate, setRate] = React.useState(150);
  const [retainer, setRetainer] = React.useState(0);
  const [brief, setBrief] = React.useState("");
  const initials = name.trim().split(/\s+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  React.useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color, initials, rate: Number(rate) || 0, retainer: Number(retainer) || 0, brief });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ width: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:15 }}>New client</div>
          <button className="btn-ghost" style={{ padding:4 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <div style={{ width:40, height:40, borderRadius:"var(--radius)", background:color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:15, flexShrink:0 }}>{initials}</div>
          <input className="field-edit" style={{ flex:1, fontSize:14 }} placeholder="Client name" value={name} onChange={e => setName(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:500, color:"var(--text-2)", marginBottom:6 }}>Colour</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {COLOR_PRESETS.map(c => (
              <button key={c} onClick={() => setColor(c)} title={c}
                style={{ width:22, height:22, borderRadius:"50%", background:c, border: color === c ? "3px solid var(--text)" : "3px solid transparent", cursor:"pointer" }} />
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"var(--text-2)", marginBottom:4 }}>Hourly rate ($)</div>
            <input type="number" className="field-edit" style={{ width:"100%" }} value={rate} onChange={e => setRate(e.target.value)} min="0" />
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"var(--text-2)", marginBottom:4 }}>Monthly retainer ($)</div>
            <input type="number" className="field-edit" style={{ width:"100%" }} value={retainer} onChange={e => setRetainer(e.target.value)} min="0" />
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:500, color:"var(--text-2)", marginBottom:4 }}>Brief</div>
          <textarea className="panel-desc" placeholder="Short description of this engagement" value={brief} onChange={e => setBrief(e.target.value)} style={{ width:"100%", minHeight:52, fontSize:13, resize:"vertical" }} />
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!name.trim()}>Create client</button>
        </div>
      </div>
    </div>
  );
};

// ============ tag modal ============
const TagModal = ({ onClose, onCreate }) => {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#6366f1");

  React.useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ width: 340 }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:15 }}>New tag</div>
          <button className="btn-ghost" style={{ padding:4 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <span className="tag" style={{ background: color + "22", color }}>
            <span className="dot" style={{ background: color }} />
            {name || "Preview"}
          </span>
          <input className="field-edit" style={{ flex:1, fontSize:14 }} placeholder="Tag name" value={name} onChange={e => setName(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:500, color:"var(--text-2)", marginBottom:6 }}>Colour</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {COLOR_PRESETS.map(c => (
              <button key={c} onClick={() => setColor(c)} title={c}
                style={{ width:22, height:22, borderRadius:"50%", background:c, border: color === c ? "3px solid var(--text)" : "3px solid transparent", cursor:"pointer" }} />
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!name.trim()}>Create tag</button>
        </div>
      </div>
    </div>
  );
};

// ============ quick add ============

const QuickAdd = ({ open, onClose, onCreate, defaultStatus = "todo" }) => {
  const [title, setTitle] = React.useState("");
  const [client, setClient] = React.useState(null);
  const [priority, setPriority] = React.useState("p3");
  const [due, setDue] = React.useState(daysFromToday(2));
  const [tags, setTags] = React.useState([]);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setTitle(""); setClient(null); setPriority("p3"); setDue(daysFromToday(2)); setTags([]);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), client, priority, due, tags, status: defaultStatus });
    onClose();
  };

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={e => e.stopPropagation()} style={{ width: 580 }}>
        <div className="cmdk-input-wrap">
          <Icon name="plus" size={16} stroke={2.5} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="What needs to happen?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
          />
        </div>
        <div style={{ padding: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <select className="filter-chip" value={client || ""} onChange={e => setClient(e.target.value || null)}>
            <option value="">No client</option>
            {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="filter-chip" value={priority} onChange={e => setPriority(e.target.value)}>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="date" className="filter-chip" value={fmtDate(due)} onChange={e => setDue(new Date(e.target.value))} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {TAGS.slice(0, 6).map(tg => (
              <button key={tg.id} className="tag" onClick={() => setTags(tags.includes(tg.id) ? tags.filter(t => t !== tg.id) : [...tags, tg.id])}
                style={tags.includes(tg.id) ? { background: tg.color + "22", color: tg.color, outline: `1px solid ${tg.color}` } : {}}>
                <span className="dot" style={{ background: tg.color }} />{tg.name}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// expose
Object.assign(window, {
  Icon, Avatar, AvatarStack, StatusDot, PriorityPill, Tag, ClientTag, Checkbox,
  fmtRelDate, fmtMinutes, fmtHMS, isOverdue,
  Sidebar, Topbar, FloatingTimer, CmdK, TaskPanel, QuickAdd, ProfileModal, ToastZone,
});
