# Ajesh Joe Portal — UI Design System ("Professor's Study")

> **Purpose.** This is the single source of truth for building **more pages in the exact
> style of the light‑theme Professor Dashboard** (`src/components/ProfessorDashboard.tsx`).
> Any agent (Antigravity, Claude, etc.) or developer should read this file, then produce new
> screens that are visually indistinguishable in language from that dashboard.
>
> **Golden rule:** if a choice isn't written here, match `ProfessorDashboard.tsx` exactly.
> Every token, class string, and component recipe below is copied verbatim from that file.

---

## 0. Stack & mechanics (read first)

- **React 19 + Vite + Tailwind CSS v4** (`@tailwindcss/vite`). There is **no `tailwind.config.js`** —
  theme lives in `src/index.css` via `@theme`. **Use arbitrary values** for everything:
  `bg-[#4A0E1B]`, `text-[10px]`, `tracking-[0.14em]`, `shadow-[...]`.
- **Icons:** `lucide-react` only. No other icon set, no emoji as UI icons.
- **This project has NO `@types/react`.** So `tsc --noEmit` / `npm run lint` reports **false**
  JSX errors (`key` not stripped, props typed `any`). **Validate with `npx vite build`, never tsc.**
- **Do NOT touch `src/components/original/*`** — that is a separate, unrelated dark "Archon" theme.
- State persists to `localStorage` under `prof_portal_*_v1` keys (see §12).

---

## 1. North star — the aesthetic, in one paragraph

A **warm, light, editorial "professor's study."** Deep maroon as the single decisive accent,
charcoal ink, and warm sand as the supporting warmth — on a cream (not white, not gray) canvas.
Soft, warm, two‑layer shadows; hairline warm borders; rounded corners. Playful **Grandstander**
display type for headings and figures against clean **Plus Jakarta Sans** body text. It should feel
**engineered, calm, and considered — never corporate‑SaaS‑generic and never "AI slop."**

### The anti‑slop laws (non‑negotiable)
1. **No inset/hard black shadows on light cards.** (The old dashboard's cardinal sin.) Only the
   soft warm shadow in §5.
2. **No pure grays** (`gray-*`, `slate-*`, `zinc-*`). Every neutral is **warm‑tinted** (see §3).
3. **One saturated accent only** — maroon. All status colors are **muted / earthy**, never neon.
   Never a rainbow.
4. **No glassmorphism** — no `backdrop-blur` cards, no translucent low‑opacity card fills.
5. **Honest data only.** Compute stats from real values; never fabricate metrics/among counts.
6. **Every list gets an empty state. Every destructive action gets a confirm dialog.**
7. **Generous, controlled spacing.** Don't crowd; don't sprawl.

---

## 2. Bringing the system into a new page

Two things make a screen "part of this system":

**(a) The CSS is already defined** in `src/index.css` — do not redefine globally:

```css
/* fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Grandstander:wght@400;500;600;700;800;900&display=swap');
@import "tailwindcss";

/* scoped typography utilities — apply these ONLY inside a page, never to <body> */
.dash-root  { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.dash-serif { font-family: 'Grandstander', cursive; letter-spacing: -0.01em; }   /* display font (heads + numbers) */
.dash-mono  { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; } /* metadata */
```

> ⚠️ **Never define a global `--font-display` in `@theme`.** The class `font-display` is used
> site‑wide as a **no‑op** on other pages; defining it would restyle the entire site in both
> themes. Keep display type scoped to the `.dash-serif` class.
>
> Note the class is historically named `dash-serif` but the font is a **display** face
> (Grandstander), *not* a serif. Keep the class name; just know what it renders.

**(b) The page shell** always starts like this:

```tsx
<div className="dash-root min-h-[85vh] bg-[#F6F2EA] text-[#22201F]">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    {/* header, then the 12-col grid */}
  </div>
</div>
```

---

## 3. Color tokens (complete)

Copy hexes exactly. Tailwind form is the arbitrary class you write.

### Brand
| Role | Hex | Tailwind | Where |
|---|---|---|---|
| **Primary — Deep Maroon** | `#4A0E1B` | `bg-[#4A0E1B]` `text-[#4A0E1B]` | primary buttons, active nav, key figures, hero band, avatar, dots |
| Primary hover (deeper) | `#380A14` | `hover:bg-[#380A14]` | primary button hover |
| Primary soft fill | `#F4E7E5` | `bg-[#F4E7E5]` | active nav bg, icon tiles, chips, avatar gradient start |
| **Ink — Charcoal** | `#22201F` | `text-[#22201F]` | headings, key text, page text color |
| **Secondary — Warm Sand** | `#D9C2A2` | `bg-[#D9C2A2]` | hero accents (as `/10`–`/20` blobs), hero label text, warm emphasis |

### Warm neutrals (the "gray" replacements — never use real grays)
| Role | Hex | Tailwind |
|---|---|---|
| Page background (cream) | `#F6F2EA` | `bg-[#F6F2EA]` |
| Surface / card | `#FFFFFF` | `bg-white` |
| Surface‑2 (inputs, subtle fills, hover) | `#FBF7F0` | `bg-[#FBF7F0]` |
| Border — default (cards, tables, modals, menus) | `#EAE1D2` | `border-[#EAE1D2]` |
| Border — inputs & ghost buttons | `#E3D8C5` | `border-[#E3D8C5]` |
| Border — soft inner / dividers | `#EFE7D8` | `border-[#EFE7D8]` |
| Hairline divider (rows, footers) | `#F2ECDF` | `border-[#F2ECDF]` `divide-[#F2ECDF]` |
| Track (progress bars) | `#F0E9DB` | `bg-[#F0E9DB]` |
| Profile gradient end | `#F3EAD8` | `to-[#F3EAD8]` |
| Avatar text (warm cream) | `#F3E3C6` | `text-[#F3E3C6]` |

### Text ramp (warm, dark → faint)
| Use | Hex |
|---|---|
| Primary ink (headings) | `#22201F` |
| Body strong | `#3A342E` |
| Soft ink (ghost btn text) | `#4A443E` |
| Secondary body (long copy) | `#5A534B` |
| Muted UI (nav inactive, row btns) | `#6E645A` |
| Muted labels / metadata | `#8A7E6F` |
| Faint (small dates) | `#A79A88` |
| Faint icon (nav inactive) | `#AC9F8C` |
| Placeholder / search icon | `#B3A996` |

### Status & category colors (muted, earthy — one soft bg + one text each)
| Meaning | Text | Soft bg | Tailwind pair |
|---|---|---|---|
| Success / answered / Easy / "resource" / NEET | `#2F6D4E` | `#E7EFE9` | `bg-[#E7EFE9] text-[#2F6D4E]` |
| Warning / Medium / "msc" / M.Sc | `#8A5E1E` (dot `#A9772E`) | `#F5ECD8` | `bg-[#F5ECD8] text-[#8A5E1E]` |
| Info / schedule / CSIR NET | `#2B5B7A` | `#E5EDF2` | `bg-[#E5EDF2] text-[#2B5B7A]` |
| Wine (JEE Advanced) | `#7A1F2B` | `#F3E6EA` | `bg-[#F3E6EA] text-[#7A1F2B]` |
| Danger / delete (destructive **only**) | `#B23B2E` (hover `#98311F`) | `#FBF0EE` / `#F6E5E1`, border `#E6C9C4` | see danger button in §7 |
| Neutral chip ("general") | `#6E645A` | `#EFE7D8` | `bg-[#EFE7D8] text-[#6E645A]` |

> **Danger ≠ Primary.** Maroon `#4A0E1B` is the brand; destructive actions use the brighter brick
> red `#B23B2E` so "delete" never reads as "primary."

### Domain color maps (reuse these objects verbatim)
```ts
// exam/course identity chip
const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main':     { bg: 'bg-[#F4E7E5]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F3E6EA]', text: 'text-[#7A1F2B]', dot: 'bg-[#7A1F2B]' },
  neet:           { bg: 'bg-[#E7EFE9]', text: 'text-[#2F6D4E]', dot: 'bg-[#2F6D4E]' },
  net:            { bg: 'bg-[#E5EDF2]', text: 'text-[#2B5B7A]', dot: 'bg-[#2B5B7A]' },
  'msc-entrance': { bg: 'bg-[#F5ECD8]', text: 'text-[#8A5E1E]', dot: 'bg-[#A9772E]' },
};

// announcement category chip
const ANN_CAT = {
  general:  { label: 'General',  cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam:     { label: 'Exam',     cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'Resource', cls: 'bg-[#E7EFE9] text-[#2F6D4E]' },
  schedule: { label: 'Schedule', cls: 'bg-[#E5EDF2] text-[#2B5B7A]' },
};
```

---

## 4. Typography

Three families, each with a job. Put `tabular-nums` on **all** numbers.

| Family | Class | Used for |
|---|---|---|
| **Grandstander** (display, 400–900) | `.dash-serif` | page titles, section/panel titles, modal titles, **stat numbers** |
| **Plus Jakarta Sans** (body/UI) | `.dash-root` (set on page wrapper; children inherit) | everything else |
| **JetBrains Mono** | `.dash-mono` | metadata only — dates, file sizes, counts, years, emails |

### Type scale (exact recipes)
| Token | Classes |
|---|---|
| Page H1 | `dash-serif text-3xl font-semibold text-[#22201F] sm:text-[2rem]` |
| Hero H2 | `dash-serif text-2xl font-semibold` (white on maroon) |
| Panel / section / modal title (H3/H4) | `dash-serif text-lg font-semibold text-[#22201F]` |
| **Stat number** | `dash-serif text-4xl font-semibold leading-none tabular-nums text-[#22201F]` |
| Body | `text-sm leading-relaxed text-[#3A342E]` (or `#5A534B` for long copy) |
| Small print | `text-xs text-[#8A7E6F]` |
| **MICRO label** (eyebrows/KPI labels) | `text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F]` |
| Field label | `text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F]` |
| Table header | `text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]` |
| Nav item | `text-sm font-semibold` |
| Button | `text-xs font-bold tracking-wide` |
| Metadata | `dash-mono text-xs tabular-nums text-[#8A7E6F]` (or `text-[11px] text-[#A79A88]`) |

---

## 5. Radius, shadow, spacing, borders

**Radius** (bigger container → bigger radius):
- `rounded-2xl` (16px) → cards, hero, modals, empty states, dropdown menus.
- `rounded-xl` (12px) → buttons, inputs, inner tiles, `h-9 w-9` icon squares, nav items, avatar, segmented control.
- `rounded-lg` (8px) → small icon buttons, row‑action buttons, tiny avatars.
- `rounded-full` → chips, badges, dots, progress tracks & fills.

**Shadows** (warm, never gray/black‑hard):
- **Card:** `shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]`
- **Hero (maroon):** `shadow-[0_22px_44px_-24px_rgba(74,14,27,0.75)]`
- **Modal:** `shadow-2xl` · **Dropdown menu:** `shadow-xl`

**Borders:** always **1px** and warm. Default `border-[#EAE1D2]`; inputs `border-[#E3D8C5]`;
soft inner `border-[#EFE7D8]`; hairline dividers `border-[#F2ECDF]`.

**Spacing rhythm:** page inner `py-8`; grid gap `gap-7`; card padding `p-5` (tiles) / `p-6` (panels);
vertical stacks `space-y-6` (major) / `space-y-4`–`space-y-5` (within a section);
table cells `px-5 py-3.5`, headers `px-5 py-3`.

---

## 6. Copy‑paste class constants (the backbone)

Define these once per page/component and reuse. **Verbatim from `ProfessorDashboard.tsx`.**

```tsx
const CARD =
  'rounded-2xl border border-[#EAE1D2] bg-white shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const INPUT =
  'w-full rounded-xl border border-[#E3D8C5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-[#22201F] placeholder:text-[#B3A996] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white focus:ring-4 focus:ring-[#4A0E1B]/10';
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#380A14] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A0E1B]/20 disabled:opacity-50';
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3D8C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA]';
const ROW_BTN =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#6E645A] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]';
const ROW_BTN_DANGER =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#8A7E6F] transition-colors hover:bg-[#F6E5E1] hover:text-[#B23B2E]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F]';
```

---

## 7. Component recipes

All of these are lifted from the working dashboard. Reuse structure, spacing, and colors exactly.

### Page header (above the grid)
```tsx
<header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className={MICRO}>Professor workspace</p>
    <h1 className="dash-serif mt-1 text-3xl font-semibold text-[#22201F] sm:text-[2rem]">{pageTitle}</h1>
    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#8A7E6F]">{pageSubtitle}</p>
  </div>
  <button className={PRIMARY_BTN}><Plus size={15} /> Primary action</button>
</header>
```

### 12‑column layout (sidebar + main)
```tsx
<div className="grid gap-7 lg:grid-cols-12">
  <aside className="lg:col-span-3">
    <div className="lg:sticky lg:top-24"> {/* sidebar card + note */} </div>
  </aside>
  <main className="lg:col-span-9"> {/* section content */} </main>
</div>
```

### Sidebar: profile card + nav
```tsx
<div className={`${CARD} p-3`}>
  {/* profile */}
  <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#F4E7E5] to-[#F3EAD8] p-3">
    <div className="dash-serif flex h-11 w-11 items-center justify-center rounded-xl bg-[#4A0E1B] text-base font-semibold text-[#F3E3C6]">AJ</div>
    <div className="min-w-0">
      <h3 className="truncate text-sm font-bold text-[#22201F]">Prof. Ajesh Joe</h3>
      <span className="text-[11px] font-medium text-[#8A7E6F]">Repository Editor</span>
    </div>
  </div>
  {/* nav item — ACTIVE state */}
  <button className="group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold bg-[#F4E7E5] text-[#4A0E1B]">
    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#4A0E1B]" />
    <span className="text-[#4A0E1B]"><LayoutDashboard size={17} /></span>
    <span className="flex-1 text-left">Overview</span>
    {/* count badge */}
    <span className="rounded-full bg-[#4A0E1B] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">2</span>
  </button>
  {/* nav item — INACTIVE: text-[#6E645A] hover:bg-[#F6F2EA] hover:text-[#22201F]; icon text-[#AC9F8C] group-hover:text-[#6E645A] */}
</div>
```

### Hero band (bold maroon feature panel)
```tsx
<div className="relative overflow-hidden rounded-2xl bg-[#4A0E1B] p-6 text-white shadow-[0_22px_44px_-24px_rgba(74,14,27,0.75)] sm:p-7">
  <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#D9C2A2]/20 blur-2xl" />
  <div className="pointer-events-none absolute -bottom-14 right-24 h-36 w-36 rounded-full bg-[#D9C2A2]/10 blur-2xl" />
  <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <div className="max-w-md">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D9C2A2]">Eyebrow</p>
      <h2 className="dash-serif mt-2 text-2xl font-semibold leading-snug">Big statement headline</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">Supporting sentence.</p>
    </div>
    <div className="flex shrink-0 gap-7 sm:gap-9">
      {/* each stat */}
      <div>
        <p className="dash-serif text-3xl font-semibold tabular-nums">128</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D9C2A2]">Label</p>
      </div>
    </div>
  </div>
</div>
```

### StatCard (KPI tile)
```tsx
<div className={`${CARD} p-5`}>
  <div className="flex items-start justify-between">
    <span className={MICRO}>Study Notes</span>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]"><FileText size={17} /></span>
  </div>
  <p className="dash-serif mt-3 text-4xl font-semibold leading-none tabular-nums text-[#22201F]">128</p>
  <p className="mt-2 text-xs text-[#8A7E6F]">1,286 total downloads</p>
</div>
```
Grid: `grid grid-cols-2 gap-4 lg:grid-cols-4`.

### Analytics Bar (horizontal, real data)
```tsx
// pct = max>0 && value>0 ? Math.max(5, Math.round(value/max*100)) : 0
<div>
  <div className="mb-1.5 flex items-baseline justify-between gap-3">
    <span className="truncate text-sm font-semibold text-[#3A342E]">{label}</span>
    <span className="dash-mono shrink-0 text-xs tabular-nums text-[#8A7E6F]">{sub}</span>
  </div>
  <div className="h-2.5 overflow-hidden rounded-full bg-[#F0E9DB]">
    <div className="h-full rounded-full bg-[#4A0E1B]" style={{ width: `${pct}%` }} />
  </div>
</div>
```
(Fill color may be an exam `dot` color for "by category" charts.)

### Data table
```tsx
<div className={`${CARD} overflow-hidden`}>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="border-b border-[#EAE1D2] bg-[#FBF7F0]">
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]">Header</th>
          {/* last header: add `text-right` */}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F2ECDF]">
        <tr className="transition-colors hover:bg-[#FBF7F0]">
          <td className="px-5 py-3.5">…</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Chips
```tsx
// identity/category chip with dot
<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold bg-[#F4E7E5] text-[#4A0E1B]">
  <span className="h-1.5 w-1.5 rounded-full bg-[#4A0E1B]" /> JEE Main
</span>
// status/difficulty chip (no dot): bg + text pair from §3, same px-2.5 py-1 text-[10px] font-bold rounded-full
```

### Row actions (edit / delete)
```tsx
<div className="flex justify-end gap-1">
  <button className="rounded-lg p-2 text-[#8A7E6F] transition-colors hover:bg-[#F4E7E5] hover:text-[#4A0E1B]"><Pencil size={15} /></button>
  <button className="rounded-lg p-2 text-[#8A7E6F] transition-colors hover:bg-[#F6E5E1] hover:text-[#B23B2E]"><Trash2 size={15} /></button>
</div>
```

### Toolbar (search + filter) — on every list
```tsx
<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
  <div className="relative flex-1">
    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
    <input className={`${INPUT} pl-10`} placeholder="Search…" />
  </div>
  <select className={`${INPUT} sm:w-44`}>…</select>
</div>
```

### Segmented tabs (e.g., inbox filters)
```tsx
<div className="inline-flex rounded-xl border border-[#EAE1D2] bg-white p-1">
  {/* ACTIVE */}   <button className="rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize bg-[#4A0E1B] text-white">Unanswered <span className="text-white/70">(2)</span></button>
  {/* INACTIVE */} <button className="rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize text-[#6E645A] hover:text-[#22201F]">Answered <span className="text-[#A79A88]">(2)</span></button>
</div>
```

### Empty state (required on every list)
```tsx
<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] px-6 py-14 text-center">
  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1E3D0] text-[#A9772E]"><FileText size={22} /></div>
  <h4 className="dash-serif mt-4 text-base font-semibold text-[#22201F]">No notes here yet</h4>
  <p className="mt-1 max-w-sm text-sm text-[#8A7E6F]">Add your first note or adjust the filters.</p>
  <div className="mt-5"><button className={PRIMARY_BTN}><Plus size={15} /> Add note</button></div>
</div>
```

### Modal shell (Esc + backdrop close)
```tsx
<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
  <button aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#22201F]/40 backdrop-blur-[2px]" />
  <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white shadow-2xl">
    <div className="flex items-start justify-between gap-4 border-b border-[#EFE7D8] px-6 py-5">
      <div>
        <h3 className="dash-serif text-lg font-semibold text-[#22201F]">Title</h3>
        <p className="mt-0.5 text-xs text-[#8A7E6F]">Optional subtitle</p>
      </div>
      <button onClick={onClose} className="rounded-lg p-1.5 text-[#8A7E6F] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]"><X size={18} /></button>
    </div>
    <div className="max-h-[72vh] overflow-y-auto px-6 py-5">{/* form */}</div>
  </div>
</div>
```
The backdrop is the **only** allowed `backdrop-blur` (a mere 2px scrim), and it is a modal overlay — **not** a card treatment.

### Form field + footer
```tsx
<label className="block">
  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F]">Label</span>
  <input className={INPUT} />
</label>
{/* footer */}
<div className="flex justify-end gap-2 pt-2">
  <button type="button" className={GHOST_BTN}>Cancel</button>
  <button type="submit" className={PRIMARY_BTN}>Save changes</button>
</div>
```
Checkbox: `className="h-4 w-4 accent-[#4A0E1B]"`.

### Confirm (destructive) dialog — always before delete/reset
```tsx
<div className="flex items-start gap-3">
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBF0EE] text-[#B23B2E]"><AlertTriangle size={18} /></span>
  <p className="text-sm leading-relaxed text-[#5A534B]">This can't be undone.</p>
</div>
<div className="mt-6 flex justify-end gap-2">
  <button className={GHOST_BTN}>Cancel</button>
  <button className="inline-flex items-center gap-2 rounded-xl bg-[#B23B2E] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#98311F]">Delete</button>
</div>
```

### Dropdown menu (e.g., quick‑add)
```tsx
<div className="relative">
  <button className={PRIMARY_BTN}><Plus size={15} /> Add resource <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} /></button>
  {open && (<>
    <button className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={close} />
    <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white p-1.5 shadow-xl">
      <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA]">
        <span className="text-[#A9772E]"><FileText size={15} /></span> Study note
      </button>
    </div>
  </>)}
</div>
```

---

## 8. Layout & responsive rules

- Max content width `max-w-7xl`, centered; page padding `px-4 sm:px-6 lg:px-8 py-8`.
- Primary structure is the **3/9 twelve‑column split**; sidebar sticky at `lg:top-24`.
- Everything **stacks on mobile** (`flex-col` → `sm:flex-row`, `grid-cols-2` → `lg:grid-cols-4`).
- **Tables never break the page:** wrap in `overflow-x-auto`, give the table `min-w-[640px]`.
- Wide/among content (charts, code) scrolls inside its own container — the page body never scrolls sideways.

---

## 9. Motion & interaction

- Transitions are **`transition-colors`** on interactive elements. Keep motion subtle; no bounce/spring on layout.
- The only transform used: chevron `rotate-180` when a menu opens.
- Focus: `focus-visible:ring-4 focus-visible:ring-[#4A0E1B]/20` (buttons); inputs `focus:ring-4 focus:ring-[#4A0E1B]/10 focus:border-[#4A0E1B]/50 focus:bg-white`.
- Hover: warm sand tints (`hover:bg-[#F6F2EA]`, rows `hover:bg-[#FBF7F0]`, maroon‑tint on primary‑adjacent).
- Modals close on **Esc** and **backdrop click**.
- **Destructive → confirm dialog, never immediate.** Delete/reset always route through §7's confirm.

---

## 10. Iconography (lucide‑react)

| Context | size |
|---|---|
| Empty‑state glyph (inside a 48px tile) | `22` |
| Nav, section/stat header icons | `17` |
| Buttons, quick‑add rows | `15` |
| Row actions (edit/delete) | `15` |
| Inline / chips / list glyphs | `13`–`14` |
| Tiny meta (pin, check, dates) | `11`–`13` |

Icon tiles: `flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]` (maroon)
or `bg-[#F3EAD8] text-[#A9772E]` (brass) for a secondary accent.

---

## 11. Do / Don't (quick lint)

**Do**
- Use warm neutrals, one maroon accent, muted status colors.
- Put `dash-serif` on titles + numbers, `dash-mono` on metadata, `tabular-nums` on all figures.
- Give every list a search+filter toolbar and an empty state.
- Confirm every destructive action; compute stats from real data.

**Don't**
- ❌ inset/hard shadows on light cards · ❌ `gray-*`/`slate-*` · ❌ a second saturated accent
- ❌ glassmorphism cards · ❌ fabricated metrics · ❌ define global `--font-display`
- ❌ trust `tsc`/`npm run lint` (no `@types/react`) — build with `npx vite build`
- ❌ edit `src/components/original/*` (separate dark theme)

---

## 12. Data & state conventions (for functional pages)

- Client‑only prototype: state lives in `AppNew.tsx`, persisted to `localStorage`
  (`prof_portal_notes_v1`, `…_videos_v1`, `…_pyqs_v1`, `…_sheets_v1`, `…_doubts_v1`,
  `…_announcements_v1`, plus `…_view_v1`, `…_user_role_v1`, and dashboard `prof_portal_settings_v1`).
- CRUD lives in `AppNew.tsx` and is passed down as `onAdd*/onEdit*/onDelete*` props; child components are presentational.
- Types are in `src/types.ts`; seed data in `src/data.ts`. New entity = add type → seed → state+CRUD in `AppNew.tsx` → UI.

---

## 13. Checklist for a new page

1. Wrap in `dash-root min-h-[85vh] bg-[#F6F2EA] text-[#22201F]` → inner `mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8`.
2. Add the page **header** (eyebrow `MICRO` + `dash-serif` H1 + muted subtitle + primary action).
3. Define the `CARD / INPUT / *_BTN / MICRO` constants (or import them).
4. Build content from §7 recipes; wrap data in `CARD`, use `dash-serif` titles, `MICRO` labels.
5. Numbers → `dash-serif … tabular-nums`; metadata → `dash-mono`.
6. Search+filter toolbar + empty state for every list; confirm dialog for every delete.
7. Verify with **`npx vite build`** (never tsc), then eyeball at mobile + desktop widths.
