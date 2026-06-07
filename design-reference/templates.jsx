// ============ Helm — Project Templates ============

// ---- UseTemplateModal ----
const UseTemplateModal = ({ template, onClose, onApply }) => {
  const [clientId, setClientId] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ width: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Use template</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{template.tasks.length} task{template.tasks.length !== 1 ? "s" : ""} will be created</div>
          </div>
          <button className="btn-ghost" style={{ padding: 4 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, color: "var(--text-2)" }}>Assign to client (optional)</div>
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "space-between", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "7px 10px", display: "flex", alignItems: "center" }}
              onClick={() => setOpen(o => !o)}
            >
              {clientId ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="client-swatch" style={{ background: CLIENTS.find(c => c.id === clientId)?.color }} />
                  {CLIENTS.find(c => c.id === clientId)?.name}
                </span>
              ) : (
                <span className="muted">No client — assign later</span>
              )}
              <Icon name="chev-down" size={14} className="muted" />
            </button>
            {open && (
              <div className="popover" style={{ top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100 }}>
                <button
                  className="popover-item"
                  onClick={() => { setClientId(""); setOpen(false); }}
                >
                  <span className="muted">No client</span>
                </button>
                {CLIENTS.map(c => (
                  <button
                    key={c.id}
                    className="popover-item"
                    data-active={clientId === c.id}
                    onClick={() => { setClientId(c.id); setOpen(false); }}
                  >
                    <span className="client-swatch" style={{ background: c.color }} />
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => { onApply(clientId || null); onClose(); }}
          >
            <Icon name="plus" size={14} />
            Create {template.tasks.length} task{template.tasks.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- TemplateTaskRow ----
const TemplateTaskRow = ({ task, index, onChange, onDelete }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [newSubtask, setNewSubtask] = React.useState("");

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    onChange({ subtasks: [...(task.subtasks || []), { id: `st-${Date.now()}`, title: newSubtask.trim(), done: false }] });
    setNewSubtask("");
  };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", marginBottom: 6, background: "var(--surface)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
        <Icon name="drag" size={14} className="muted" style={{ flexShrink: 0, cursor: "grab" }} />
        <input
          className="panel-title-input"
          style={{ flex: 1, fontSize: 13.5, fontWeight: 450, padding: "2px 4px", borderRadius: 4 }}
          value={task.title}
          placeholder="Task title"
          onChange={e => onChange({ title: e.target.value })}
        />
        <select
          style={{ fontSize: 12, padding: "2px 4px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer" }}
          value={task.priority}
          onChange={e => onChange({ priority: e.target.value })}
        >
          <option value="p1">P1 Urgent</option>
          <option value="p2">P2 High</option>
          <option value="p3">P3 Normal</option>
        </select>
        <input
          type="number"
          min="5"
          style={{ width: 62, fontSize: 12, padding: "2px 4px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", textAlign: "right" }}
          value={task.estimate}
          title="Estimate (minutes)"
          onChange={e => onChange({ estimate: Math.max(5, parseInt(e.target.value) || 60) })}
        />
        <span className="muted" style={{ fontSize: 11 }}>min</span>
        <button
          className="btn-ghost"
          style={{ padding: 3, color: "var(--muted)" }}
          title={expanded ? "Collapse" : "Add subtasks / description"}
          onClick={() => setExpanded(o => !o)}
        >
          <Icon name={expanded ? "chev-down" : "chev-right"} size={14} />
        </button>
        <button className="btn-ghost" style={{ padding: 3, color: "var(--muted)" }} title="Remove task" onClick={onDelete}>
          <Icon name="trash" size={14} />
        </button>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "8px 10px 10px 32px" }}>
          <textarea
            className="panel-desc"
            placeholder="Description (optional)"
            value={task.description || ""}
            onChange={e => onChange({ description: e.target.value })}
            style={{ width: "100%", minHeight: 48, fontSize: 12.5, marginBottom: 8, resize: "vertical" }}
          />
          {(task.subtasks || []).map((st, i) => (
            <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Icon name="chev-right" size={12} className="muted" />
              <input
                style={{ flex: 1, fontSize: 12.5, padding: "2px 4px", borderRadius: 4, border: "1px solid transparent", background: "transparent", color: "var(--text)" }}
                value={st.title}
                onChange={e => {
                  const subs = [...task.subtasks];
                  subs[i] = { ...st, title: e.target.value };
                  onChange({ subtasks: subs });
                }}
              />
              <button className="btn-ghost" style={{ padding: 2, color: "var(--muted)" }}
                onClick={() => onChange({ subtasks: task.subtasks.filter((_, j) => j !== i) })}>
                <Icon name="x" size={11} />
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
            <Icon name="plus" size={12} className="muted" />
            <input
              style={{ flex: 1, fontSize: 12.5, padding: "2px 4px", borderRadius: 4, border: "1px solid transparent", background: "transparent", color: "var(--text)" }}
              placeholder="Add subtask…"
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addSubtask(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ---- TemplatePanel ----
const TemplatePanel = ({ templateId, templates, onClose, onUpdate, onDelete, onUse }) => {
  const template = templates.find(t => t.id === templateId);
  const [useOpen, setUseOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!template) return null;

  const updateTask = (index, patch) => {
    const tasks = [...template.tasks];
    tasks[index] = { ...tasks[index], ...patch };
    onUpdate(templateId, { tasks });
  };

  const deleteTask = (index) => {
    onUpdate(templateId, { tasks: template.tasks.filter((_, i) => i !== index) });
  };

  const addTask = () => {
    onUpdate(templateId, {
      tasks: [...template.tasks, { title: "New task", status: "todo", priority: "p3", tags: [], estimate: 60, description: "", subtasks: [] }],
    });
  };

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="task-panel" style={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <Icon name="layers" size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <input
              className="panel-title-input"
              style={{ fontSize: 15, fontWeight: 600 }}
              value={template.name}
              placeholder="Template name"
              onChange={e => onUpdate(templateId, { name: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: 12.5, padding: "5px 12px" }}
              onClick={() => setUseOpen(true)}
              disabled={template.tasks.length === 0}
              title={template.tasks.length === 0 ? "Add tasks first" : "Create tasks from this template"}
            >
              <Icon name="play" size={12} />
              Use template
            </button>
            <button className="btn-ghost" style={{ padding: 6 }} onClick={() => onDelete(templateId)} title="Delete template">
              <Icon name="trash" size={15} style={{ color: "var(--muted)" }} />
            </button>
            <button className="btn-ghost" style={{ padding: 6 }} onClick={onClose}>
              <Icon name="x" size={15} style={{ color: "var(--muted)" }} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: "0 20px 12px" }}>
          <textarea
            className="panel-desc"
            placeholder="Add a description for this template…"
            value={template.description || ""}
            onChange={e => onUpdate(templateId, { description: e.target.value })}
            style={{ width: "100%", minHeight: 52, fontSize: 13, resize: "vertical" }}
          />
        </div>

        {/* Tasks list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tasks ({template.tasks.length})
            </span>
          </div>

          {template.tasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: 13 }}>
              No tasks yet — add some below
            </div>
          )}

          {template.tasks.map((task, i) => (
            <TemplateTaskRow
              key={i}
              task={task}
              index={i}
              onChange={(patch) => updateTask(i, patch)}
              onDelete={() => deleteTask(i)}
            />
          ))}

          <button
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "center", marginTop: 4, border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "7px 0", color: "var(--muted)", fontSize: 13 }}
            onClick={addTask}
          >
            <Icon name="plus" size={14} />
            Add task
          </button>
        </div>
      </aside>

      {useOpen && (
        <UseTemplateModal
          template={template}
          onClose={() => setUseOpen(false)}
          onApply={(clientId) => onUse(template, clientId)}
        />
      )}
    </>
  );
};

// ---- TemplatesView ----
const TemplatesView = ({ templates, onOpenTemplate, onCreate }) => {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 960 }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Project Templates</h1>
          <p className="muted" style={{ margin: "4px 0 0", fontSize: 13.5 }}>
            Pre-built task sets you can apply to any client in one click.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onCreate} style={{ marginTop: 2 }}>
          <Icon name="plus" size={14} />
          New template
        </button>
      </div>

      {templates.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0", color: "var(--muted)" }}>
          <Icon name="layers" size={40} style={{ opacity: 0.25, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No templates yet</div>
          <div style={{ fontSize: 13, marginBottom: 16 }}>Create your first template to speed up project setup.</div>
          <button className="btn btn-primary" onClick={onCreate}>
            <Icon name="plus" size={14} />
            New template
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {templates.map(tpl => (
          <button
            key={tpl.id}
            onClick={() => onOpenTemplate(tpl.id)}
            style={{
              textAlign: "left",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 18px",
              cursor: "pointer",
              transition: "box-shadow 0.12s, border-color 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 30, height: 30, borderRadius: "var(--radius-sm)", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="layers" size={15} style={{ color: "var(--accent)" }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{tpl.name}</span>
            </div>
            {tpl.description && (
              <p className="muted" style={{ fontSize: 12.5, margin: "0 0 10px", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {tpl.description}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="list" size={12} />
                {tpl.tasks.length} task{tpl.tasks.length !== 1 ? "s" : ""}
              </span>
              {tpl.tasks.some(t => t.subtasks?.length > 0) && (
                <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="chev-right" size={12} />
                  {tpl.tasks.reduce((a, t) => a + (t.subtasks?.length || 0), 0)} subtasks
                </span>
              )}
              <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--accent)", fontWeight: 500 }}>Open →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
