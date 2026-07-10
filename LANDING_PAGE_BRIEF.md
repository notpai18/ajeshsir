# Landing Page Build Brief — "The Elegant Language of Electrons"

> **Hand this entire file to Claude (or any senior front-end/creative dev). It is self-contained.**
> Goal: a scroll-driven, 3D landing page for a chemistry educator's portal that looks
> **award-winning and hand-crafted — never AI-generated** — and that the professor is proud to show.
>
> **Decisions already made (do not re-litigate):**
> - **Integrated** into the existing **React 19 + Vite + Tailwind v4** app (not a standalone file).
> - **Real WebGL 3D** via **three.js + react-three-fiber + drei** (not Spline, not faux-3D).
> - **All four chemistry motifs:** molecular structures, atomic orbitals, lab glassware & reactions, crystal lattices.
> - **Art direction: Scholarly & Premium** — restrained, editorial, museum-like. Prestige over hype.
> - Everything reveals **dynamically on scroll**. Build must land in **one shot** — this brief is the spec.

---

## 0) The one-line pitch

A cinematic-but-scholarly scroll journey through a chemist's world — a single rotating molecule greets you,
dissolves into orbitals, pours through lab glassware, crystallises into a lattice, and resolves into an
invitation to a free, rigorous chemistry library. Deep oxblood, antique gold, warm cream. Quiet, confident, real.

---

## 1) Who / why / success criteria

- **Subject:** Prof. **Ajesh Joe** — chemistry educator. Ph.D. (IISc), postdoctoral research (Cambridge), ~20 years teaching. Runs a **free, open-access, non-commercial** study repository.
- **Audience (in priority order):** (1) the **professor** — must feel dignified, scholarly, premium; (2) serious **aspirants** (JEE/NEET/CSIR-NET/M.Sc) — must feel rigorous and inspiring; (3) parents/peers — must read as credible and prestigious.
- **Success =** "Is this an Awwwards-worthy site?" **yes**, and "Would a senior professor put his name on it?" **yes**. If a section feels like a generic SaaS/AI template, it has failed.
- **Non-negotiable:** it must not look AI-generated (see §9 guardrails).

---

## 2) Art direction — "Professor's Study, after dark"

Scholarly & premium. Think **the library of a distinguished chemist**: leather-oxblood, brass, aged paper,
one museum spotlight on a glass molecular model. Restraint is the whole point — **motion is slow, weighty,
and deliberate**; whitespace is generous; type does the talking; the 3D is the single hero per scene.

- **Mood words:** editorial, tactile, engineered, timeless, hushed, exact.
- **Reference *techniques* (not to copy, to match the bar):** Awwwards "Site of the Day" scroll storytelling; Apple product-page scroll-pinning + scrubbed 3D; editorial kinetic typography; Active-Theory/Igloo-grade WebGL restraint; Locomotive/Lenis smooth-scroll feel.
- **Two canvases, deliberately:** the page **alternates** between **warm cream light sections** (paper, editorial) and **deep charcoal/oxblood dark sections** (the "lab at night," where glowing 3D lives). This rhythm is a core device — light for reading, dark for spectacle.

---

## 3) Design system to reuse (verbatim — this is the existing "Professor's Study" system)

Pull tokens from the repo's `design.md` / `DESIGN_SYSTEM.md`. Summary:

**Five-color palette (the ONLY accents — no green, no blue, ever):**
| Role | Hex |
|---|---|
| Deep Oxblood (primary) | `#4A0E1B` |
| Burgundy (secondary accent) | `#7C2532` |
| Antique Gold (fill/marks) | `#C9A13B` · gold **text** `#8A6A16` |
| Warm Sand | `#D9C2A2` |
| Charcoal (ink / dark canvas) | `#22201F` |

**Neutrals:** cream canvas `#F6F2EA`, card `#FFFFFF`, warm borders `#EAE1D2`/`#E3D8C5`, subtle fill `#FBF7F0`.
**Text ramp (warm):** ink `#22201F`, body `#3A342E`/`#5A534B`, muted `#8A7E6F`, faint `#A79A88`.

**Typography (already loaded in `src/index.css`):**
- **Display → `Grandstander`** (rounded, characterful) via the `.dash-serif` class. Headlines, big numbers, the quote.
- **Body/UI → `Plus Jakarta Sans`** via `.dash-root`.
- **Metadata/labels → `JetBrains Mono`** via `.dash-mono` (dates, formulas, eyebrows, counts). Also perfect for chemical formulae (`C₆H₆`, `104.5°`).
- **Micro-label pattern:** `text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F]`.

**Texture & finish:** hairline warm 1px borders; soft warm shadows `0_18px_36px_-26px_rgba(34,32,31,0.35)`; radii `rounded-2xl` (cards) / `rounded-xl` (controls). Add a **very subtle film grain / paper noise** overlay (2–4% opacity) on dark sections — a top anti-AI-slop move. **Never** use inset black shadows, glassmorphism, pure grays, or a second saturated hue.

---

## 4) Tech stack & integration

**Already in the app:** React 19, Vite 6, Tailwind v4 (`@theme` in `index.css`, arbitrary values), `motion` (Framer Motion v12), `lucide-react`. **No `@types/react`** → validate with **`npx vite build`**, never `tsc`.

**Add these deps:**
```
three  @react-three/fiber  @react-three/drei  gsap
# optional but recommended for the premium scroll feel:
lenis            # smooth scroll (a.k.a. @studio-freight/lenis)
maath            # easing/rng helpers for particles
```
- **3D:** `@react-three/fiber` + `@react-three/drei` (`<Float>`, `<Environment>`, `<MeshTransmissionMaterial>` for glass, `<Instances>` for lattices/particles, `<Html>`, `<ScrollControls>`/`useScroll`).
- **Scroll orchestration:** **GSAP + ScrollTrigger** for pinning + scrubbed timelines (glassware sequence, molecule rotation tied to scroll progress). **Framer Motion** for DOM reveals, staggers, text masks. Keep 3D scroll state in **one source of truth** (a scroll-progress context or Lenis + ScrollTrigger) so DOM and WebGL stay in lockstep.
- **Integration:** add a new top-level view/route `LandingPage` and make it the **`home`** view in `AppNew.tsx` (it can **replace the current `Hero`**, with "Enter the library" → existing `selection`/portal flow). Keep it a self-contained folder; don't disturb the Supabase/dashboards work.

**Suggested file structure:**
```
src/landing/
  LandingPage.tsx            # section orchestration + <Canvas> + smooth scroll provider
  scene/
    Scene.tsx                # single persistent R3F <Canvas>, reads global scroll progress
    Molecule.tsx             # benzene / caffeine ball-and-stick (accurate geometry)
    Orbitals.tsx             # s/p/d electron clouds
    Glassware.tsx            # flask + titration + reaction (transmission material)
    Lattice.tsx              # instanced NaCl / diamond lattice
    materials.ts             # palette-tinted CPK material presets
    lighting.tsx             # spotlight + warm environment
  sections/                  # DOM overlay per section (copy, reveals)
  hooks/useScrollProgress.ts # Lenis + ScrollTrigger → normalized 0..1 per section
  data.ts                    # pulls real content (exams, quote, stats) from src/data.ts
```
**Performance rules:** ONE `<Canvas>` for the whole page (swap what's rendered by scroll section, don't mount 4 canvases); `<Suspense>` + lazy-load the 3D; `dpr={[1, 2]}` clamped; instancing for lattices/particles; pause `useFrame` work when a scene is offscreen (`frameloop="demand"` where possible); mobile = **simplified geometry or a pre-rendered poster** + keep the scroll reveals. Target: desktop 60fps, no CLS, Lighthouse Perf ≥ 85 on mid hardware.

---

## 5) The 3D content plan (accurate chemistry = the anti-AI-slop weapon)

**Golden rule: real molecular geometry, palette-tinted materials.** Generic rainbow blobs scream "AI." Instead:

- **Re-skin CPK coloring to the palette** (this alone makes it look art-directed): Carbon `#22201F` (charcoal), Hydrogen `#F6F2EA`/`#D9C2A2` (cream), Oxygen `#7C2532` (burgundy), Nitrogen `#C9A13B` (gold), bonds = warm sand `#D9C2A2` cylinders. Metals/ions in oxblood. **Matte + one spotlight**, subtle brass rim-light. No neon, no chrome.
- **Correct geometry (call it out so it reads as authored by a chemist):**
  - **Benzene C₆H₆** — planar regular hexagon, C–C ≈ 1.39 Å, delocalised (render the aromatic ring/inner circle). Hero candidate.
  - **Water H₂O** — bent, **104.5°**. **Methane CH₄** — tetrahedral, **109.5°**. **Ammonia NH₃** — trigonal pyramidal. **Caffeine / aspirin** — recognisable organics for richness.
  - **Orbitals** — `s` sphere, `p` dumbbell on 3 axes, `d` cloverleaf; soft volumetric/point-cloud clouds, gold-on-charcoal glow.
  - **Glassware** — Erlenmeyer flask + burette; use `MeshTransmissionMaterial` (real refraction/thickness) — the premium moment. A **titration**: a burette drips, liquid level rises, a **color change** ripples through (sand→gold→burgundy), scrubbed by scroll.
  - **Lattices** — **NaCl** (alternating FCC ions) and/or **diamond** (tetrahedral carbon network), built with `<Instances>`; assembles/rotates on scroll.
- **Motion character:** slow rotation, gentle float/breathing, parallax depth. Tie **rotation & assembly to scroll progress** (scrub), not just autoplay — that's the "reacts to scroll" wow.

---

## 6) Scroll storyboard (section by section) — copy is REAL, from the codebase

The page is a vertical narrative. Each section names: **the 3D**, **the copy** (ready to use, editable), and **the motion**.

### S1 · HERO — "The elegant language of electrons" (dark)
- **3D:** a single **benzene / complex organic molecule**, spotlit, slowly rotating, centre stage. Faint drifting particles (dust in a light beam). Grain overlay.
- **Copy:**
  - Eyebrow (mono): `PROF. AJESH JOE · CHEMISTRY`
  - H1 (Grandstander, huge): **"The elegant language of electrons."**
  - Sub: *"A free, rigorous chemistry library for JEE, NEET, CSIR-NET and M.Sc aspirants — built on intuition, not memorisation."*
  - CTA: **Enter the library** → portal · secondary: **Meet the professor**
  - Scroll cue (mono, bottom): `SCROLL TO BEGIN ↓`
- **Motion:** headline **masked line-reveal** (words rise behind a clip). Molecule fades in from dark + assembles. On first scroll, molecule **rotates and recedes** as text parallaxes up.

### S2 · PHILOSOPHY — the quote (light → cream)
- **3D:** background orbital (single `p`-orbital) drifting, low-opacity, behind the paper.
- **Copy — the verbatim quote (hero of this section):**
  > *"Academic excellence does not rely on memorising reactions, but on developing deep physical intuition and chemical logic. A chemistry problem is simply a mechanism waiting to be written in the elegant language of electrons — our role is to teach students its grammar, so they can write their own solutions."*
  > — **Prof. Ajesh Joe**
- **Motion:** quote reveals **word-by-word** on scroll (kinetic type, gold key-words: *intuition*, *logic*, *grammar*). A gold underline **draws** under the attribution.

### S3 · THE CRAFT — glassware reaction (dark, PINNED + SCRUBBED)
- **3D (signature moment):** the **titration** — pinned section, scroll **scrubs** the reaction: burette drips → flask liquid rises → **color change** sand→gold→burgundy → gentle bubbling. Transmission glass, spotlit.
- **Copy (reveals alongside the reaction stages):**
  - Eyebrow: `HOW WE TEACH`
  - H2: **"From first principles to the exam hall."**
  - 3 short beats (each appears at a reaction stage): **Concept** ("derive it, don't memorise it") · **Rigor** ("multi-concept problems, worked step by step") · **Mastery** ("previous-year patterns, decoded").
- **Motion:** GSAP `ScrollTrigger` **pin** for ~150vh; timeline `scrub`; the three beats stagger in at 33/66/100% progress.

### S4 · THE PROFESSOR — credibility (light)
- **3D:** a slowly rotating **crystal lattice** (diamond) beside the bio — structure = rigor.
- **Copy (real):**
  - Eyebrow: `ABOUT THE PROFESSOR`
  - H2: **"A scholar devoted to teaching."**
  - Body: *"Ph.D. in Chemistry from the Indian Institute of Science, postdoctoral research at the University of Cambridge, and two decades lecturing organic chemistry, physical chemistry, and materials science."*
  - **Research interests (chips):** Advanced Organic Synthesis & Reaction Mechanisms · Quantum Chemistry & Molecular Dynamics · Solid-State Chemistry & Materials Science · Spectroscopic Methods.
  - **Photo:** leave a real-photo slot (portrait); fallback = the sand "AJ" monogram from the current About page. *(A real portrait massively helps the "not AI" goal — see open questions.)*
- **Motion:** portrait/monogram scales in with a soft mask; chips stagger; lattice assembles on enter.

### S5 · THE TRACKS — 5 exam paths (dark)
- **3D:** small orbiting molecules or element tiles, one motif per card on hover.
- **Copy (real, from `src/data.ts`):**
  - Eyebrow: `WHO IT'S FOR` · H2: **"Five paths. One foundation."**
  - **JEE Main** — *Physical & Organic Chemistry: concept sheets and mock drills.*
  - **JEE Advanced** — *Advanced problem-solving, multi-concept derivations, deep-dive lectures.*
  - **NEET Chemistry** — *Conceptual theory, formula sheets, speed-accuracy booklets for medical aspirants.*
  - **CSIR NET** — *Postgraduate quantum chemistry, thermodynamics, molecular spectroscopy.*
  - **M.Sc Entrance** — *Unified notes for IIT JAM, TIFR, and central-university entrances.*
- **Motion:** cards reveal with **stagger + slight 3D tilt on hover** (magnetic). Numbers count up.

### S6 · THE LIBRARY — what's inside (light)
- **3D:** subtle floating orbitals/particles parallaxing behind cards.
- **Copy:** Eyebrow `THE REPOSITORY` · H2 **"Everything you need, nothing you pay."**
  - Four resource pillars: **Study Notes** · **Video Lectures** · **Previous-Year Questions (with step solutions)** · **Practice Sheets** — plus **Doubt resolution** (ask the professor directly).
  - Trust line (mono): `100% FREE · NO LOGIN · OPEN-ACCESS · UPDATED EACH CYCLE`
- **Motion:** pillars reveal on scroll; a thin gold progress rule tracks scroll position.

### S7 · CLOSING — the invitation (dark, the molecule returns)
- **3D:** the hero molecule **dissolves into particles** that drift upward, or a full orbital bloom.
- **Copy:** H2 **"Write your own solutions."** · Sub: *"Free, forever. Built for the students who want to understand — not just pass."* · CTA: **Enter the library →**
- **Motion:** big final CTA with a magnetic button; molecule particle-dissolve on enter; footer fades up.

### S8 · FOOTER
- Brand `Prof. Ajesh Joe — Academic Library`, quiet nav (Home · Resources · About · Contact), the ethos line, `© 2026`. Mono, restrained.

---

## 7) Copy deck (quick-grab, all editable)

- **H1:** The elegant language of electrons.
- **Hero sub:** A free, rigorous chemistry library for JEE, NEET, CSIR-NET and M.Sc aspirants — built on intuition, not memorisation.
- **Quote:** *(verbatim, see S2).*
- **Section H2s:** "From first principles to the exam hall." · "A scholar devoted to teaching." · "Five paths. One foundation." · "Everything you need, nothing you pay." · "Write your own solutions."
- **Stats (real, supportable):** `20+` years teaching · `5` exam tracks · `100%` free / open-access · `Ph.D. IISc · Cambridge`.
- **CTAs:** Enter the library · Meet the professor · Ask a doubt.
- **Mono flourishes to sprinkle:** `C₆H₆` · `104.5°` · `sp³` · `∮ E·dA = Q/ε₀` · `ΔG = ΔH − TΔS`.

---

## 8) Motion & interaction spec

- **Smooth scroll:** Lenis (or GSAP ScrollSmoother) — slow, weighty inertia. This single choice sells "premium."
- **Reveals:** Framer Motion — mask/clip line reveals for headings, `staggerChildren` for lists, `whileInView` once. Easing: custom `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out), durations 0.6–1.0s — **unhurried**.
- **Scrubbed 3D:** GSAP ScrollTrigger drives a normalized progress → feed into `useFrame` for molecule rotation, titration stage, lattice assembly. Pin S3 (glassware).
- **Micro-interactions:** magnetic buttons; cursor-follow parallax on the hero molecule (subtle, ≤ 6°); gold link underlines that draw; count-up numbers.
- **Accessibility / performance:** honor `prefers-reduced-motion` → disable scrub/pins, replace 3D with static **poster renders** + simple fades; keyboard-focusable CTAs; semantic headings; alt text; no motion-locked content. Ship the page **usable without WebGL** (poster fallback if `!gl`).

---

## 9) "Does NOT look AI-generated" — hard guardrails

1. **Real chemistry geometry** (correct angles/bonds) and **palette-tinted CPK** — never rainbow generic blobs.
2. **Restraint:** one hero element per scene, lots of intentional negative space, slow motion. Resist filling every corner.
3. **Editorial typography:** big confident Grandstander headlines, mono formulae, real hierarchy — not centered generic sans everywhere.
4. **Texture:** film-grain/paper noise on dark sections; warm 1px borders; soft warm shadows. Kills the "flat AI gradient" look.
5. **Asymmetry & craft:** off-center compositions, deliberate overlaps, a hand-placed feel — not perfectly-symmetrical template blocks.
6. **Real content only** (this brief's copy) — no lorem, no invented stats, no stock-y claims.
7. **Ban list:** emoji as icons, glassmorphism cards, purple/teal SaaS gradients, neon 3D, drop-shadow soup, "Lottie confetti," meaningless floating cubes, hero with a laptop mockup.
8. **One-accent discipline:** oxblood leads; gold + sand + burgundy support; charcoal grounds. No green, no blue.

---

## 10) Responsive & fallbacks

- **Desktop-first spectacle**, but every section must **stack + stay legible** on mobile; heavy 3D → simplified mesh or poster image, reveals stay.
- Wide/pinned scenes must not cause horizontal scroll; test 375px, 768px, 1280px, 1600px.
- Test light↔dark section transitions for contrast (AA text).

---

## 11) Assumptions baked in (override any of these)

- Landing page **replaces the current `Hero`** as the `home` view; "Enter the library" routes into the existing selection/portal.
- Using the **existing design tokens & fonts** already in `index.css` (no new brand).
- **Stats** (20+ yrs, 5 tracks, free, IISc/Cambridge) are real and usable.
- Professor **portrait** may not exist yet → monogram fallback is acceptable for v1.

---

## 12) Open questions for the requester (answer inline if you can; otherwise defaults above hold)

1. **Real portrait of the professor?** (Yes + provide image → biggest single boost to "not AI." No → monogram fallback.)
2. **Exact stats to feature** — confirm "20+ years" and student-count/any real numbers you want shown.
3. **Replace the Hero, or keep Hero and add this as a separate marketing route** (e.g. `/welcome`)?
4. **Smooth-scroll library OK?** (Lenis adds the premium feel but is a dependency — approve or veto.)
5. **Any content you want added** — testimonials, exam results, a short intro video, social links?
6. **Deadline / scope for v1** — full 8 sections, or ship hero + 3 sections first?

---

## 13) One-shot build directive (paste target)

> Build the landing page exactly per this brief: React 19 + Vite + Tailwind v4, integrated as `src/landing/LandingPage.tsx` and set as the `home` view in `AppNew.tsx`. Use react-three-fiber + drei for one persistent `<Canvas>`, GSAP ScrollTrigger for pinned/scrubbed scenes, Framer Motion for DOM reveals, Lenis for smooth scroll. Implement sections S1–S8 with the real copy in §6–7, the palette-tinted accurate-geometry 3D in §5, the motion in §8, and every guardrail in §9. Reuse the `.dash-serif`/`.dash-root`/`.dash-mono` fonts and the five-color palette from `design.md`. Lazy-load 3D with `<Suspense>`, clamp `dpr={[1,2]}`, provide `prefers-reduced-motion` + no-WebGL poster fallbacks, and keep it 60fps on desktop / legible on mobile. Validate with `npx vite build` (no `@types/react`; do not use `tsc`). Deliver production-ready, cleanly-structured components — no placeholders, no lorem.
```
Reference files in the repo: design.md / DESIGN_SYSTEM.md (tokens), src/data.ts (exams, FAQs),
src/components/AboutPage.tsx (bio + quote + palette usage), src/index.css (fonts + @theme).
```
