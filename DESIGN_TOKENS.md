# Design Tokens

All tokens are defined as CSS custom properties in `design-reference/styles.css` under `:root` (light) and `[data-theme="dark"]` (dark). **Reuse that file directly** — this doc is a human-readable summary. Theme is switched by setting `data-theme="light|dark"` on `<html>`. Accent is overridden at runtime by setting `--accent`/`--accent-hover`/`--accent-soft` on `document.documentElement`.

## Typography

| Role | Family | Usage |
|---|---|---|
| UI / body | **Geist** (`--font-ui`) | everything by default; weights 300–700 |
| Numeric / time | **Geist Mono** (`--font-mono`) | timers, durations, money, counts (`font-feature-settings: "tnum"`) |
| Display | **Instrument Serif** (`--font-serif`) | greetings, page titles (h1-serif), big stat values |

Load from Google Fonts (already linked in `Helm.html`). Key sizes: body 14px (compact 13px via density), h1-serif 36px, stat value 38px, section labels 11–12px uppercase with `0.05em` tracking. Min UI text 11px.

## Color — light (`:root`)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#faf9f6` | app background (warm off-white) |
| `--surface` | `#ffffff` | cards, panels, rows |
| `--surface-2` | `#f4f3ee` | subtle fills, headers |
| `--surface-3` | `#ebeae3` | hover fills, chips |
| `--border` | `#e5e3db` | hairlines |
| `--border-strong` | `#d4d1c5` | emphasized borders |
| `--text` | `#14181f` | primary text |
| `--text-2` | `#44505f` | secondary text |
| `--muted` | `#7b8694` | tertiary/labels |
| `--faint` | `#aab3bf` | faint/disabled |

## Color — dark (`[data-theme="dark"]`)

| Token | Hex |
|---|---|
| `--bg` | `#0a0e15` |
| `--surface` | `#11161f` |
| `--surface-2` | `#161c27` |
| `--surface-3` | `#1d2431` |
| `--border` | `#232b3a` |
| `--border-strong` | `#2e3849` |
| `--text` | `#e8ebf2` |
| `--text-2` | `#b6bdcc` |
| `--muted` | `#7c8699` |
| `--faint` | `#525c70` |

## Accent (user-selectable, 6 presets)

Default **Sky** `#0ea5e9` (hover `#0284c7`). Presets used by the Settings color control:

| Name | value | hover |
|---|---|---|
| Sky | `#0ea5e9` | `#0284c7` |
| Indigo | `#6366f1` | `#4f46e5` |
| Emerald | `#10b981` | `#059669` |
| Coral | `#f43f5e` | `#e11d48` |
| Amber | `#f59e0b` | `#d97706` |
| Graphite | `#475569` | `#334155` |

In dark mode the accent is brightened (`--accent: #38bdf8`). Persist the chosen accent on `profile.preferences.accent`.

## Semantic colors

| Concept | Token | Light |
|---|---|---|
| Priority P1 (urgent) | `--p1` / `--p1-soft` | `#e11d48` / `#fee2e6` |
| Priority P2 (high) | `--p2` / `--p2-soft` | `#d97706` / `#fef3c7` |
| Priority P3 (normal) | `--p3` / `--p3-soft` | `#64748b` / `#f1f5f9` |
| Status: Backlog | `--status-todo` | `#94a3b8` |
| Status: In Progress | `--status-progress` | `#0ea5e9` |
| Status: In Review | `--status-review` | `#a855f7` |
| Status: Done | `--status-done` | `#10b981` |
| Status: Blocked | `--status-blocked` | `#ef4444` |

Client colors are per-client (`Client.color`) and drive swatches, client tags (color at 22 alpha bg), and Gantt bars.

## Radius

`--radius-sm` 6px · `--radius` 10px · `--radius-lg` 14px · `--radius-xl` 20px · pills/avatars 999px.

## Shadows

`--shadow-sm` (hairline lift) · `--shadow-md` (cards hover) · `--shadow-lg` (floating timer) · `--shadow-pop` (modals, popovers, task panel). Dark mode uses deeper black shadows.

## Spacing

8px-based rhythm; utility classes `.gap-2/3/4/6` = 8/12/16/24px and `.mt-*/.mb-*` mirror these. Content padding 24px×28px. Sidebar 248px (collapsed 64px). Task panel 520px.

## Motion

| Element | Transition |
|---|---|
| Task panel slide | `transform 0.22s cubic-bezier(0.2,0.7,0.3,1)` |
| Popover pop-in | `0.14s cubic-bezier(0.2,0.7,0.3,1)` (opacity + translateY + scale) |
| Modal | overlay `fade-in 0.18s`, card `pop-in 0.2s` |
| Toast | `toast-in 0.22s` (slide up + fade), auto-dismiss ~2.2s |
| Row add | `fade-row 0.22s` |
| Timer pulse | `pulse 1.4s` infinite on the running dot |
| Hover states | `background/border 0.12s` |

Respect `prefers-reduced-motion` in production (the prototype doesn't gate these; add a guard).

## Iconography

Single inline-SVG `Icon` component in `ui.jsx` (~50 glyphs, 1.75 stroke, 24-box). Copy it verbatim — no icon dependency needed. Avatars are generated gradients keyed off user initials (6 hue presets).
