// ============ Helm — views ============

// ---------- Overview ----------
const OverviewView = ({ tasks, onOpenTask, timeEntries, onStartTimer, me }) => {
  const open = tasks.filter(t => t.status !== "done");
  const dueToday = tasks.filter(t => t.due && fmtDate(new Date(t.due)) === fmtDate(TODAY) && t.status !== "done");
  const overdue = tasks.filter(t => isOverdue(t));
  const thisWeek = tasks.filter(t => {
    if (!t.due || t.status === "done") return false;
    const d = (new Date(t.due) - TODAY) / 86400000;
    return d >= 0 && d <= 7;
  });
  const inProgress = tasks.filter(t => t.status === "progress");
  const todayMinutes = timeEntries.filter(e => fmtDate(new Date(e.date)) === fmtDate(TODAY)).reduce((a, e) => a + e.duration, 0);
  const weekMinutes = timeEntries.reduce((a, e) => a + e.duration, 0); // sample is "this week"
  const clientsActive = new Set(open.map(t => t.client).filter(Boolean)).size;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  // Spark for stat
  const Spark = ({ data, color = "var(--accent)" }) => {
    const max = Math.max(...data, 1);
    const w = 64, h = 22;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
    return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  };

  // Activity feed (most recent comments / status changes)
  const recentActivity = tasks
    .flatMap(t => t.activity.map(a => ({ ...a, taskTitle: t.title, taskId: t.id, client: t.client })))
    .concat(
      tasks.flatMap(t => t.comments.map(c => ({ kind: "comment", text: `"${c.text.slice(0, 60)}${c.text.length > 60 ? "…" : ""}"`, user: c.user, at: c.at, taskTitle: t.title, taskId: t.id, client: t.client })))
    )
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 8);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <h1 className="h1-serif">{greeting}, {(me?.name || ME.name).split(" ")[0]}.</h1>
      </div>
      <div className="muted" style={{ marginBottom: 24 }}>
        {TODAY.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {open.length} open tasks across {clientsActive} clients
      </div>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-spark"><Spark data={[2,3,2,4,5,6,5]} /></div>
          <div className="stat-label">Due today</div>
          <div className="stat-value">{dueToday.length}</div>
          <div className="stat-sub">
            {overdue.length > 0 ? <span className="delta-down">● {overdue.length} overdue</span> : <span className="delta-up">● on track</span>}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-spark"><Spark data={[1,2,4,3,5,4,7]} color="var(--status-progress)" /></div>
          <div className="stat-label">In progress</div>
          <div className="stat-value">{inProgress.length}</div>
          <div className="stat-sub muted">across {new Set(inProgress.map(t => t.client).filter(Boolean)).size} clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-spark"><Spark data={[60,90,120,80,150,180,todayMinutes]} color="var(--status-review)" /></div>
          <div className="stat-label">Tracked today</div>
          <div className="stat-value text-mono">{Math.floor(todayMinutes / 60)}<span style={{ fontSize: 18, color: "var(--muted)" }}>h</span> {todayMinutes % 60}<span style={{ fontSize: 18, color: "var(--muted)" }}>m</span></div>
          <div className="stat-sub muted">{fmtMinutes(weekMinutes)} this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-spark"><Spark data={[2,3,2,3,4,3,4]} color="var(--status-done)" /></div>
          <div className="stat-label">Billable this week</div>
          <div className="stat-value">${Math.round(weekMinutes / 60 * 150).toLocaleString()}</div>
          <div className="stat-sub muted">at avg $150/hr</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 20 }}>
        {/* Today's focus */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 className="h2">Today's focus</h2>
            <span className="muted text-sm">{dueToday.length + overdue.length} items</span>
          </div>
          <div className="card" style={{ padding: 0 }}>
            {overdue.length > 0 && (
              <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--p1)", borderBottom: "1px solid var(--border)", background: "var(--p1-soft)", display: "flex", alignItems: "center", gap: 6, borderRadius: "14px 14px 0 0" }}>
                <Icon name="flame" size={13} /> {overdue.length} task{overdue.length > 1 ? "s" : ""} overdue — clear these first
              </div>
            )}
            {[...overdue, ...dueToday, ...inProgress].slice(0, 8).map(t => {
              const c = CLIENTS.find(x => x.id === t.client);
              return (
                <div key={t.id} className="task-row" style={{ gridTemplateColumns: "28px minmax(0, 1fr) minmax(0, 160px) 70px 70px 32px" }} onClick={() => onOpenTask(t.id)}>
                  <StatusDot status={t.status} />
                  <div className="task-title-cell">
                    <span className="task-title">{t.title}</span>
                    {isOverdue(t) && <span className="pill p1" style={{ fontSize: 10 }}>Overdue</span>}
                  </div>
                  <div>{c ? <ClientTag clientId={c.id} /> : <span className="muted text-xs">—</span>}</div>
                  <PriorityPill p={t.priority} />
                  <span className="text-xs" style={{ color: isOverdue(t) ? "var(--p1)" : "var(--text-2)" }}>{fmtRelDate(t.due)}</span>
                  <button className="btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); onStartTimer(t.id); }} title="Track time">
                    <Icon name="play" size={12} />
                  </button>
                </div>
              );
            })}
            {dueToday.length + overdue.length + inProgress.length === 0 && (
              <div className="empty-state"><Icon name="check" size={24} /><div>Nothing on the docket. Touch grass.</div></div>
            )}
          </div>

          <h2 className="h2 mt-6 mb-3">This week ahead</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = daysFromToday(i);
              const dt = tasks.filter(t => t.due && fmtDate(new Date(t.due)) === fmtDate(d) && t.status !== "done");
              const isToday = i === 0;
              return (
                <div key={i} className="card" style={{ padding: 10, minHeight: 100, borderColor: isToday ? "var(--accent)" : "var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {d.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-serif" style={{ fontSize: 22, lineHeight: 1, marginTop: 2, color: isToday ? "var(--accent)" : "var(--text)" }}>{d.getDate()}</div>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                    {dt.slice(0, 3).map(t => {
                      const c = CLIENTS.find(x => x.id === t.client);
                      return <div key={t.id} onClick={() => onOpenTask(t.id)} className="cal-task" style={c ? { background: c.color + "22", color: c.color, borderLeftColor: c.color } : {}}>{t.title}</div>;
                    })}
                    {dt.length > 3 && <div className="text-xs muted">+{dt.length - 3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: activity + clients */}
        <div style={{ minWidth: 0 }}>
          <h2 className="h2 mb-3">Activity</h2>
          <div className="card" style={{ padding: 14 }}>
            {recentActivity.map((a, i) => (
              <div key={i} className="activity-item" style={{ paddingTop: i === 0 ? 0 : 10 }}>
                <div className="activity-icon"><Icon name={a.kind === "comment" ? "msg" : "circle"} size={10} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="activity-text" style={{ fontSize: 12.5 }}>
                    <strong>{ALL_USERS.find(u => u.id === a.user)?.name.split(" ")[0]}</strong> {a.text}
                  </div>
                  <div onClick={() => onOpenTask(a.taskId)} style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 2, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    on <span style={{ textDecoration: "underline", textDecorationColor: "var(--border-strong)" }}>{a.taskTitle}</span>
                  </div>
                  <div className="activity-time">{fmtRelDate(a.at)}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="h2 mt-6 mb-3">Active clients</h2>
          <div className="card" style={{ padding: 0 }}>
            {CLIENTS.filter(c => open.some(t => t.client === c.id)).slice(0, 6).map((c, i) => {
              const ct = open.filter(t => t.client === c.id);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                  <div className="avatar md" style={{ background: c.color, borderRadius: 6 }}>{c.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div className="text-xs muted">{ct.length} open · ${c.retainer.toLocaleString()}/mo retainer</div>
                  </div>
                  <Icon name="chev-right" size={14} className="muted" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- List view ----------
const ListView = ({ tasks, onOpenTask, onStartTimer, onToggleDone, groupBy }) => {
  // Group by status by default; or by client / priority
  const groups = {};
  tasks.forEach(t => {
    let key;
    if (groupBy === "client") key = t.client || "_no_client";
    else if (groupBy === "priority") key = t.priority;
    else key = t.status;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const groupOrder = groupBy === "client"
    ? [...CLIENTS.map(c => c.id), "_no_client"]
    : groupBy === "priority"
    ? ["p1", "p2", "p3"]
    : STATUSES.map(s => s.id);

  const groupName = (k) => {
    if (groupBy === "client") return k === "_no_client" ? "No client" : CLIENTS.find(c => c.id === k)?.name || k;
    if (groupBy === "priority") return PRIORITIES.find(p => p.id === k)?.name || k;
    return STATUSES.find(s => s.id === k)?.name || k;
  };

  return (
    <div>
      <div className="task-table">
        <div className="task-row head">
          <span></span>
          <span>Task</span>
          <span>Tags</span>
          <span>Priority</span>
          <span>Due</span>
          <span style={{ textAlign: "right" }}>Time</span>
          <span></span>
        </div>
        {groupOrder.map(g => {
          const items = groups[g];
          if (!items || items.length === 0) return null;
          return (
            <React.Fragment key={g}>
              <div className="section-bar">
                {groupBy !== "status" && groupBy !== "priority" && <span style={{ width: 8, height: 8, borderRadius: 2, background: CLIENTS.find(c => c.id === g)?.color || "var(--muted)" }} />}
                {groupBy === "status" && <StatusDot status={g} />}
                {groupBy === "priority" && <PriorityPill p={g} />}
                <span>{groupName(g)}</span>
                <span className="count">{items.length}</span>
              </div>
              {items.map(t => {
                const c = CLIENTS.find(x => x.id === t.client);
                return (
                  <div key={t.id} className="task-row" onClick={() => onOpenTask(t.id)}>
                    <Checkbox checked={t.status === "done"} onClick={(e) => { e.stopPropagation(); onToggleDone(t.id); }} />
                    <div className="task-title-cell">
                      <span className={`task-title ${t.status === "done" ? "done" : ""}`}>{t.title}</span>
                      {t.subtasks.length > 0 && <span className="text-xs muted" style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><Icon name="check" size={11} />{t.subtasks.filter(s => s.done).length}/{t.subtasks.length}</span>}
                      {t.recurring && <Icon name="repeat" size={11} className="muted" />}
                    </div>
                    <div className="task-tags-cell">
                      {c && <ClientTag clientId={c.id} />}
                      {t.tags.slice(0, 1).map(tg => <Tag key={tg} tag={tg} />)}
                      {t.tags.length > 1 && <span className="text-xs muted">+{t.tags.length - 1}</span>}
                    </div>
                    <PriorityPill p={t.priority} />
                    <span className="text-xs" style={{ color: isOverdue(t) ? "var(--p1)" : "var(--text-2)" }}>{fmtRelDate(t.due)}</span>
                    <span className="text-mono text-xs cell-right muted">{fmtMinutes(t.logged)}</span>
                    <button className="btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); onStartTimer(t.id); }}><Icon name="play" size={12} /></button>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Kanban ----------
const KanbanView = ({ tasks, onOpenTask, onMoveTask, onStartTimer, onQuickAdd }) => {
  const [dragId, setDragId] = React.useState(null);
  const [overCol, setOverCol] = React.useState(null);

  const byStatus = {};
  STATUSES.forEach(s => byStatus[s.id] = []);
  tasks.forEach(t => byStatus[t.status]?.push(t));

  return (
    <div className="kanban">
      {STATUSES.map(s => (
        <div key={s.id} className="kb-col">
          <div className="kb-col-head">
            <StatusDot status={s.id} />
            <span>{s.name}</span>
            <span className="count">{byStatus[s.id].length}</span>
            <div style={{ flex: 1 }} />
            <button className="btn-ghost btn-icon" style={{ width: 22, height: 22 }} title={`Add task to ${s.name}`} onClick={() => onQuickAdd && onQuickAdd(s.id)}><Icon name="plus" size={12} /></button>
          </div>
          <div
            className={`kb-col-body ${overCol === s.id ? "over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOverCol(s.id); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId) onMoveTask(dragId, s.id);
              setDragId(null);
              setOverCol(null);
            }}
          >
            {byStatus[s.id].map(t => {
              const c = CLIENTS.find(x => x.id === t.client);
              return (
                <div
                  key={t.id}
                  className={`kb-card ${dragId === t.id ? "dragging" : ""}`}
                  draggable
                  onDragStart={() => setDragId(t.id)}
                  onDragEnd={() => { setDragId(null); setOverCol(null); }}
                  onClick={() => onOpenTask(t.id)}
                >
                  <div className="kb-tags">
                    {c && <ClientTag clientId={c.id} />}
                    {t.tags.slice(0, 2).map(tg => <Tag key={tg} tag={tg} />)}
                  </div>
                  <div className="kb-title">{t.title}</div>
                  {t.subtasks.length > 0 && (
                    <div className="text-xs muted" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="check" size={11} stroke={2} />
                      {t.subtasks.filter(s => s.done).length}/{t.subtasks.length} subtasks
                    </div>
                  )}
                  <div className="kb-foot">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <PriorityPill p={t.priority} />
                      <span className="text-xs" style={{ color: isOverdue(t) ? "var(--p1)" : "var(--muted)" }}>{fmtRelDate(t.due)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {t.logged > 0 && <span className="text-mono text-xs muted">{fmtMinutes(t.logged)}</span>}
                      <AvatarStack users={t.assignees} max={2} size="sm" />
                    </div>
                  </div>
                </div>
              );
            })}
            {byStatus[s.id].length === 0 && (
              <div style={{ padding: "20px 8px", color: "var(--faint)", fontSize: 12, textAlign: "center", border: "1px dashed var(--border)", borderRadius: 8 }}>
                Drop tasks here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- Calendar (monthly) ----------
const CalendarView = ({ tasks, onOpenTask }) => {
  const [cursor, setCursor] = React.useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const monthStart = new Date(cursor);
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const startWeekday = (monthStart.getDay() + 6) % 7; // Mon=0
  const daysInMonth = monthEnd.getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const tasksByDay = {};
  tasks.forEach(t => {
    if (!t.due) return;
    const k = fmtDate(new Date(t.due));
    if (!tasksByDay[k]) tasksByDay[k] = [];
    tasksByDay[k].push(t);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 className="h1-serif">{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h1>
        </div>
        <div className="row gap-2">
          <button className="btn btn-icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><Icon name="chev-left" size={14} /></button>
          <button className="btn btn-sm" onClick={() => setCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))}>Today</button>
          <button className="btn btn-icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><Icon name="chev-right" size={14} /></button>
        </div>
      </div>
      <div className="cal-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-day off" />;
          const k = fmtDate(d);
          const items = tasksByDay[k] || [];
          const isToday = k === fmtDate(TODAY);
          return (
            <div key={i} className={`cal-day ${isToday ? "today" : ""}`}>
              <div className="cal-num">{d.getDate()}</div>
              {items.slice(0, 4).map(t => {
                const c = CLIENTS.find(x => x.id === t.client);
                return (
                  <div key={t.id}
                    className={`cal-task ${t.status === "done" ? "done" : ""} ${t.priority === "p1" ? "p1" : t.priority === "p2" ? "p2" : ""}`}
                    onClick={() => onOpenTask(t.id)}
                    style={c && t.priority === "p3" ? { background: c.color + "22", color: c.color, borderLeftColor: c.color } : {}}
                    title={t.title}
                  >{t.title}</div>
                );
              })}
              {items.length > 4 && <div className="text-xs muted">+{items.length - 4} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Timeline (Gantt) ----------
const TimelineView = ({ tasks, onOpenTask }) => {
  const dayWidth = 36;
  // Span: 7 days before today to 28 days after
  const rangeStart = daysFromToday(-7);
  const rangeEnd = daysFromToday(28);
  const totalDays = Math.round((rangeEnd - rangeStart) / 86400000) + 1;
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(rangeStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Group tasks by client
  const grouped = {};
  CLIENTS.forEach(c => grouped[c.id] = []);
  grouped._none = [];
  tasks.forEach(t => {
    if (!t.start || !t.due) return;
    (grouped[t.client] || grouped._none).push(t);
  });

  const dayIndex = (d) => Math.max(0, Math.min(totalDays - 1, Math.round((new Date(d) - rangeStart) / 86400000)));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 className="h1-serif">Timeline</h1>
        <span className="muted text-sm">{rangeStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {rangeEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
      <div className="tl-wrap" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 260 + totalDays * dayWidth }}>
          <div className="tl-head">
            <div style={{ padding: "10px 12px" }}>Task</div>
            <div className="tl-day-cols" style={{ gridTemplateColumns: `repeat(${totalDays}, ${dayWidth}px)` }}>
              {days.map((d, i) => {
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isToday = fmtDate(d) === fmtDate(TODAY);
                return (
                  <div key={i} className={`tl-day-cell ${isWeekend ? "weekend" : ""} ${isToday ? "today" : ""}`}>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{d.toLocaleDateString("en-US", { weekday: "narrow" })}</div>
                    <div style={{ fontWeight: 600 }}>{d.getDate()}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {Object.entries(grouped).map(([cid, items]) => {
            if (items.length === 0) return null;
            const c = CLIENTS.find(x => x.id === cid);
            return (
              <React.Fragment key={cid}>
                <div className="tl-row" style={{ background: "var(--surface-2)", minHeight: 32 }}>
                  <div className="tl-row-label" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
                    {c ? <><span className="client-swatch" style={{ background: c.color }} />{c.name}</> : "Other"}
                  </div>
                  <div className="tl-track" style={{ "--day-w": `${dayWidth}px`, gridTemplateColumns: `repeat(${totalDays}, ${dayWidth}px)` }} />
                </div>
                {items.map(t => {
                  const s = dayIndex(t.start);
                  const e = dayIndex(t.due);
                  const left = s * dayWidth;
                  const width = Math.max(dayWidth - 4, (e - s + 1) * dayWidth - 4);
                  const color = c ? c.color : "var(--accent)";
                  const progress = t.estimate ? Math.min(100, (t.logged / t.estimate) * 100) : 0;
                  return (
                    <div key={t.id} className="tl-row">
                      <div className="tl-row-label">
                        <StatusDot status={t.status} />
                        <span className="lbl-name">{t.title}</span>
                      </div>
                      <div className="tl-track" style={{ "--day-w": `${dayWidth}px`, position: "relative" }}>
                        <div
                          className={`tl-bar ${t.status === "done" ? "done" : ""}`}
                          style={{ left: left + 2, width, background: color }}
                          onClick={() => onOpenTask(t.id)}
                          title={`${t.title}\n${fmtMinutes(t.logged)} / ${fmtMinutes(t.estimate)}`}
                        >
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: "rgba(255,255,255,0.25)", borderRadius: 6 }} />
                          <span style={{ position: "relative", zIndex: 1 }}>{t.title}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- Clients view ----------
const ClientsView = ({ tasks, timeEntries, onOpenTask, focusedClient, setFocusedClient, onStartTimer }) => {
  if (focusedClient) {
    const c = CLIENTS.find(x => x.id === focusedClient);
    const clientTasks = tasks.filter(t => t.client === c.id);
    const byStatus = {};
    STATUSES.forEach(s => byStatus[s.id] = clientTasks.filter(t => t.status === s.id));
    const clientHours = timeEntries.filter(e => e.client === c.id).reduce((a, e) => a + e.duration, 0) / 60;
    const billable = clientHours * c.rate;

    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={() => setFocusedClient(null)} style={{ marginBottom: 12 }}>
          <Icon name="chev-left" size={12} /> All clients
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div className="avatar lg" style={{ background: c.color, borderRadius: 10, width: 56, height: 56, fontSize: 18 }}>{c.initials}</div>
          <div style={{ flex: 1 }}>
            <h1 className="h1-serif" style={{ lineHeight: 1 }}>{c.name}</h1>
            <div className="muted" style={{ marginTop: 6 }}>{c.brief}</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <div><div className="text-xs muted">Rate</div><div className="text-serif" style={{ fontSize: 22 }}>${c.rate}<span className="muted" style={{ fontSize: 13 }}>/hr</span></div></div>
            <div><div className="text-xs muted">Retainer</div><div className="text-serif" style={{ fontSize: 22 }}>${c.retainer ? c.retainer.toLocaleString() : "—"}</div></div>
            <div><div className="text-xs muted">This week</div><div className="text-serif" style={{ fontSize: 22 }}>{clientHours.toFixed(1)}<span className="muted" style={{ fontSize: 13 }}>h</span></div></div>
            <div><div className="text-xs muted">Billable</div><div className="text-serif" style={{ fontSize: 22, color: "var(--status-done)" }}>${Math.round(billable).toLocaleString()}</div></div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
          {STATUSES.map(s => (
            <div key={s.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                <StatusDot status={s.id} />
                {s.name}
              </div>
              <div className="text-serif" style={{ fontSize: 28, marginTop: 4 }}>{byStatus[s.id].length}</div>
            </div>
          ))}
        </div>

        <h2 className="h2 mb-3">Tasks ({clientTasks.length})</h2>
        <ListView tasks={clientTasks} onOpenTask={onOpenTask} onStartTimer={onStartTimer} onToggleDone={() => {}} groupBy="status" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="h1-serif" style={{ marginBottom: 4 }}>Clients</h1>
      <div className="muted" style={{ marginBottom: 24 }}>{CLIENTS.length} clients · {tasks.filter(t => t.client && t.status !== "done").length} open tasks</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {CLIENTS.map(c => {
          const ct = tasks.filter(t => t.client === c.id);
          const open = ct.filter(t => t.status !== "done").length;
          const overdue = ct.filter(t => isOverdue(t)).length;
          const hours = timeEntries.filter(e => e.client === c.id).reduce((a, e) => a + e.duration, 0) / 60;
          const recent = ct.filter(t => t.status !== "done").slice(0, 3);
          return (
            <div key={c.id} className="card card-hover" style={{ cursor: "pointer" }} onClick={() => setFocusedClient(c.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div className="avatar md" style={{ background: c.color, borderRadius: 6 }}>{c.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{c.name}</div>
                  <div className="text-xs muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.brief}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-2)", marginBottom: 12 }}>
                <div><div className="text-xs muted">Open</div><div style={{ fontWeight: 500, fontSize: 14 }}>{open}</div></div>
                <div><div className="text-xs muted">Overdue</div><div style={{ fontWeight: 500, fontSize: 14, color: overdue ? "var(--p1)" : "var(--text)" }}>{overdue}</div></div>
                <div><div className="text-xs muted">Hours/wk</div><div style={{ fontWeight: 500, fontSize: 14 }} className="text-mono">{hours.toFixed(1)}</div></div>
                <div style={{ marginLeft: "auto" }}><div className="text-xs muted">Retainer</div><div style={{ fontWeight: 500, fontSize: 14 }} className="text-mono">${(c.retainer / 1000).toFixed(1)}k</div></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {recent.map(t => (
                  <div key={t.id} className="text-xs" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-2)" }}>
                    <StatusDot status={t.status} />
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</span>
                    <span style={{ color: isOverdue(t) ? "var(--p1)" : "var(--muted)" }}>{fmtRelDate(t.due)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- My Tasks ----------
const MyTasksView = ({ tasks, onOpenTask, onStartTimer, onToggleDone }) => {
  const mine = tasks.filter(t => t.assignees.includes("u-me"));
  const buckets = {
    overdue: mine.filter(t => isOverdue(t)),
    today: mine.filter(t => t.due && fmtDate(new Date(t.due)) === fmtDate(TODAY) && t.status !== "done"),
    week: mine.filter(t => {
      if (!t.due || t.status === "done") return false;
      const d = (new Date(t.due) - TODAY) / 86400000;
      return d > 0 && d <= 7 && fmtDate(new Date(t.due)) !== fmtDate(TODAY);
    }),
    later: mine.filter(t => {
      if (!t.due || t.status === "done") return false;
      const d = (new Date(t.due) - TODAY) / 86400000;
      return d > 7;
    }),
    noDate: mine.filter(t => !t.due && t.status !== "done"),
    done: mine.filter(t => t.status === "done"),
  };

  const Bucket = ({ label, items, color }) => items.length > 0 && (
    <div className="card" style={{ padding: 0, marginBottom: 14 }}>
      <div className="section-bar" style={{ color }}>
        <span>{label}</span>
        <span className="count">{items.length}</span>
      </div>
      {items.map(t => {
        const c = CLIENTS.find(x => x.id === t.client);
        return (
          <div key={t.id} className="task-row" style={{ gridTemplateColumns: "28px minmax(0, 1fr) minmax(0, 200px) 70px 80px 32px" }} onClick={() => onOpenTask(t.id)}>
            <Checkbox checked={t.status === "done"} onClick={(e) => { e.stopPropagation(); onToggleDone(t.id); }} />
            <div className="task-title-cell">
              <span className={`task-title ${t.status === "done" ? "done" : ""}`}>{t.title}</span>
              {t.subtasks.length > 0 && <span className="text-xs muted">{t.subtasks.filter(s => s.done).length}/{t.subtasks.length}</span>}
            </div>
            <div>{c && <ClientTag clientId={c.id} />}</div>
            <PriorityPill p={t.priority} />
            <span className="text-xs" style={{ color: isOverdue(t) ? "var(--p1)" : "var(--text-2)" }}>{fmtRelDate(t.due)}</span>
            <button className="btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); onStartTimer(t.id); }}><Icon name="play" size={12} /></button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <h1 className="h1-serif" style={{ marginBottom: 4 }}>My Tasks</h1>
      <div className="muted" style={{ marginBottom: 24 }}>{mine.filter(t => t.status !== "done").length} open · {buckets.done.length} completed</div>
      <Bucket label="⚠ Overdue" items={buckets.overdue} color="var(--p1)" />
      <Bucket label="Today" items={buckets.today} color="var(--accent)" />
      <Bucket label="This week" items={buckets.week} color="var(--text-2)" />
      <Bucket label="Later" items={buckets.later} color="var(--text-2)" />
      <Bucket label="No due date" items={buckets.noDate} color="var(--muted)" />
      <Bucket label="Completed" items={buckets.done.slice(0, 8)} color="var(--status-done)" />
    </div>
  );
};

// ---------- Reports ----------
const ReportsView = ({ tasks, timeEntries }) => {
  const totalMinutes = timeEntries.reduce((a, e) => a + e.duration, 0);
  const byClient = {};
  CLIENTS.forEach(c => byClient[c.id] = 0);
  timeEntries.forEach(e => { if (e.client) byClient[e.client] = (byClient[e.client] || 0) + e.duration; });
  const maxClient = Math.max(...Object.values(byClient), 1);

  const byTag = {};
  TAGS.forEach(t => byTag[t.id] = 0);
  tasks.forEach(t => t.tags.forEach(tg => { byTag[tg] += t.logged; }));
  const maxTag = Math.max(...Object.values(byTag), 1);

  const byDay = {};
  for (let i = -6; i <= 0; i++) byDay[fmtDate(daysFromToday(i))] = 0;
  timeEntries.forEach(e => {
    const k = fmtDate(new Date(e.date));
    if (k in byDay) byDay[k] += e.duration;
  });

  // Status mix
  const statusMix = {};
  STATUSES.forEach(s => statusMix[s.id] = tasks.filter(t => t.status === s.id).length);
  const totalTasks = tasks.length;

  // Throughput last 4 weeks (fake but plausible)
  const throughput = [9, 12, 11, 14];

  return (
    <div>
      <h1 className="h1-serif" style={{ marginBottom: 4 }}>Reports</h1>
      <div className="muted" style={{ marginBottom: 24 }}>Week of {daysFromToday(-3).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Hours logged</div><div className="stat-value">{(totalMinutes/60).toFixed(1)}</div><div className="stat-sub delta-up">▲ 12% vs last week</div></div>
        <div className="stat-card"><div className="stat-label">Billable revenue</div><div className="stat-value">${Math.round(totalMinutes/60 * 150).toLocaleString()}</div><div className="stat-sub delta-up">▲ 8%</div></div>
        <div className="stat-card"><div className="stat-label">Tasks completed</div><div className="stat-value">{tasks.filter(t => t.status === "done").length}</div><div className="stat-sub muted">across all clients</div></div>
        <div className="stat-card"><div className="stat-label">Avg cycle time</div><div className="stat-value">3.2<span style={{fontSize:18, color:"var(--muted)"}}>d</span></div><div className="stat-sub delta-down">▼ slower than avg</div></div>
      </div>

      <div className="report-grid">
        <div className="card">
          <h3 className="h3 mb-3">Hours by client</h3>
          {CLIENTS.filter(c => byClient[c.id] > 0).sort((a,b) => byClient[b.id] - byClient[a.id]).map(c => (
            <div key={c.id} className="bar-row">
              <span className="lbl">{c.name}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: `${(byClient[c.id] / maxClient) * 100}%`, background: c.color }} /></span>
              <span className="val">{(byClient[c.id]/60).toFixed(1)}h</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="h3 mb-3">Time by tag</h3>
          {TAGS.filter(t => byTag[t.id] > 0).sort((a,b) => byTag[b.id] - byTag[a.id]).map(t => (
            <div key={t.id} className="bar-row">
              <span className="lbl">{t.name}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: `${(byTag[t.id] / maxTag) * 100}%`, background: t.color }} /></span>
              <span className="val">{(byTag[t.id]/60).toFixed(1)}h</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="h3 mb-3">Daily tracked hours</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, padding: "8px 0" }}>
            {Object.entries(byDay).map(([k, v]) => {
              const d = new Date(k);
              const h = (v / 60);
              const max = Math.max(...Object.values(byDay), 60) / 60;
              return (
                <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: "100%", display: "flex", alignItems: "flex-end", height: 110 }}>
                    <div style={{ width: "100%", height: `${(h / max) * 100}%`, background: "linear-gradient(to top, var(--accent), var(--accent-hover))", borderRadius: "4px 4px 0 0", minHeight: 2 }} />
                  </div>
                  <div className="text-xs muted">{d.toLocaleDateString("en-US", { weekday: "narrow" })}</div>
                  <div className="text-xs text-mono">{h.toFixed(1)}h</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="h3 mb-3">Status mix</h3>
          <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginBottom: 12, border: "1px solid var(--border)" }}>
            {STATUSES.map(s => {
              const w = statusMix[s.id] / totalTasks * 100;
              return w > 0 ? <div key={s.id} style={{ width: `${w}%`, background: s.color }} title={`${s.name} · ${statusMix[s.id]}`} /> : null;
            })}
          </div>
          {STATUSES.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "3px 0" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
              <span>{s.name}</span>
              <span style={{ marginLeft: "auto" }} className="text-mono muted">{statusMix[s.id]}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="h3 mb-3">Weekly throughput</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
            {throughput.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", height: `${(v / 16) * 100}%`, background: "var(--status-done)", borderRadius: "4px 4px 0 0" }} />
                <div className="text-xs muted">W{i + 1}</div>
                <div className="text-xs text-mono">{v}</div>
              </div>
            ))}
          </div>
          <div className="text-xs muted" style={{ marginTop: 6 }}>Tasks completed per week</div>
        </div>

        <div className="card">
          <h3 className="h3 mb-3">Utilization</h3>
          <div style={{ position: "relative", height: 130, display: "grid", placeItems: "center" }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="52" fill="none" stroke="var(--surface-3)" strokeWidth="14" />
              <circle cx="65" cy="65" r="52" fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${Math.PI * 104 * 0.72} ${Math.PI * 104}`} transform="rotate(-90 65 65)" />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div className="text-serif" style={{ fontSize: 32, lineHeight: 1 }}>72<span style={{fontSize:18}}>%</span></div>
              <div className="text-xs muted" style={{ marginTop: 4 }}>of 40h target</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Timesheet ----------
const TimesheetView = ({ tasks, timeEntries, onStartTimer }) => {
  // Weekly grid: Mon..Sun, by client, daily totals
  const weekStart = (() => {
    const d = new Date(TODAY);
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
    return d;
  })();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const grid = {}; // client -> [mins per day]
  CLIENTS.forEach(c => grid[c.id] = days.map(() => 0));
  timeEntries.forEach(e => {
    const di = days.findIndex(d => fmtDate(d) === fmtDate(new Date(e.date)));
    if (di >= 0 && e.client && grid[e.client]) grid[e.client][di] += e.duration;
  });

  const total = (arr) => arr.reduce((a, b) => a + b, 0);
  const dayTotals = days.map((_, i) => CLIENTS.reduce((acc, c) => acc + grid[c.id][i], 0));
  const weekTotal = total(dayTotals);
  const billableTotal = CLIENTS.reduce((acc, c) => acc + (total(grid[c.id]) / 60) * c.rate, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 className="h1-serif">Timesheet</h1>
          <div className="muted">Week of {weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
          <div><div className="text-xs muted">Total</div><div className="text-serif" style={{ fontSize: 26 }}>{(weekTotal/60).toFixed(1)}<span className="muted" style={{ fontSize: 13 }}>h</span></div></div>
          <div><div className="text-xs muted">Billable</div><div className="text-serif" style={{ fontSize: 26, color: "var(--status-done)" }}>${Math.round(billableTotal).toLocaleString()}</div></div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `220px repeat(7, 1fr) 100px`, fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
          <div style={{ padding: "12px 14px" }}>Client</div>
          {days.map((d, i) => {
            const isToday = fmtDate(d) === fmtDate(TODAY);
            return (
              <div key={i} style={{ padding: "12px 8px", textAlign: "center", color: isToday ? "var(--accent)" : "var(--muted)" }}>
                <div>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className="text-mono" style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginTop: 2 }}>{d.getDate()}</div>
              </div>
            );
          })}
          <div style={{ padding: "12px 14px", textAlign: "right" }}>Total</div>
        </div>
        {CLIENTS.filter(c => total(grid[c.id]) > 0).map(c => {
          const tot = total(grid[c.id]);
          return (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: `220px repeat(7, 1fr) 100px`, borderBottom: "1px solid var(--border)", alignItems: "center" }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="client-swatch" style={{ background: c.color }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
              </div>
              {grid[c.id].map((m, i) => (
                <div key={i} style={{ padding: "10px 8px", textAlign: "center" }}>
                  {m > 0 ? (
                    <div style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, background: c.color + "22", color: c.color, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500 }}>
                      {(m/60).toFixed(1)}h
                    </div>
                  ) : <span className="faint">·</span>}
                </div>
              ))}
              <div style={{ padding: "12px 14px", textAlign: "right" }} className="text-mono text-sm">
                <div style={{ fontWeight: 500 }}>{(tot/60).toFixed(1)}h</div>
                <div className="text-xs muted">${Math.round((tot/60) * c.rate).toLocaleString()}</div>
              </div>
            </div>
          );
        })}
        <div style={{ display: "grid", gridTemplateColumns: `220px repeat(7, 1fr) 100px`, background: "var(--surface-2)", fontWeight: 600 }}>
          <div style={{ padding: "12px 14px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Daily total</div>
          {dayTotals.map((m, i) => (
            <div key={i} style={{ padding: "12px 8px", textAlign: "center" }} className="text-mono text-sm">{m > 0 ? `${(m/60).toFixed(1)}h` : "—"}</div>
          ))}
          <div style={{ padding: "12px 14px", textAlign: "right" }} className="text-mono text-sm">{(weekTotal/60).toFixed(1)}h</div>
        </div>
      </div>

      <h2 className="h2 mt-6 mb-3">Recent entries</h2>
      <div className="task-table">
        <div className="task-row head" style={{ gridTemplateColumns: "80px 1fr 180px 100px 100px" }}>
          <span>Date</span>
          <span>Note</span>
          <span>Client</span>
          <span style={{ textAlign: "right" }}>Duration</span>
          <span style={{ textAlign: "right" }}>Billable</span>
        </div>
        {[...timeEntries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12).map(e => {
          const c = CLIENTS.find(x => x.id === e.client);
          const task = tasks.find(t => t.id === e.task);
          return (
            <div key={e.id} className="task-row" style={{ gridTemplateColumns: "80px 1fr 180px 100px 100px", cursor: "default" }}>
              <span className="text-xs muted">{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.note}</div>
                <div className="text-xs muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task?.title}</div>
              </div>
              <div>{c && <ClientTag clientId={c.id} />}</div>
              <span className="text-mono text-sm cell-right">{fmtMinutes(e.duration)}</span>
              <span className="text-mono text-sm cell-right" style={{ color: "var(--status-done)" }}>${Math.round((e.duration/60) * (c?.rate || 0))}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Inbox ----------
const InboxView = ({ inbox, tasks, onOpenTask, onMarkRead, onMarkAllRead }) => {
  const items = [...inbox].sort((a, b) => new Date(b.at) - new Date(a.at));
  const unread = items.filter(i => !i.read).length;

  const kindIcon = { mention: "atsign", assigned: "user", due: "calendar", comment: "msg", status: "circle" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 className="h1-serif">Inbox</h1>
          <div className="muted">{unread} unread of {items.length}</div>
        </div>
        {unread > 0 && <button className="btn btn-sm" onClick={onMarkAllRead}>Mark all read</button>}
      </div>
      <div className="card" style={{ padding: 0 }}>
        {items.map(n => {
          const task = tasks.find(t => t.id === n.task);
          const c = task && CLIENTS.find(x => x.id === task.client);
          return (
            <div key={n.id}
              onClick={() => { onMarkRead(n.id); if (task) onOpenTask(task.id); }}
              style={{
                display: "flex", gap: 12, padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                background: n.read ? "transparent" : "var(--surface)",
                position: "relative", cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "var(--surface)"}
            >
              {!n.read && <div style={{ position: "absolute", left: 6, top: "50%", width: 6, height: 6, borderRadius: 999, background: "var(--accent)", transform: "translateY(-50%)" }} />}
              <div className="activity-icon" style={{ width: 28, height: 28, marginLeft: 6 }}>
                <Icon name={kindIcon[n.kind]} size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: "var(--text)" }}>
                  {n.who && <strong>{ALL_USERS.find(u => u.id === n.who)?.name} </strong>}{n.text}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  {task && <span className="text-xs muted">on <span style={{ color: "var(--text-2)" }}>{task.title}</span></span>}
                  {c && <ClientTag clientId={c.id} />}
                  <span className="text-xs faint">· {fmtRelDate(n.at)}</span>
                </div>
              </div>
              <Icon name="chev-right" size={14} className="muted" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// expose
Object.assign(window, {
  OverviewView, ListView, KanbanView, CalendarView, TimelineView,
  ClientsView, MyTasksView, ReportsView, TimesheetView, InboxView,
});
