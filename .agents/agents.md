# Project Rules

1. **Read `design.md` fully before starting ANY UI or frontend task.**
   - It is the single source of truth for the project's visual identity, component structure, and user experience.
   - All UI work must strictly conform to the design system, tokens, and rules specified within it.
   - **Strict Constraint:** Do not introduce unauthorized high-level CSS frameworks (e.g., Tailwind) or external component libraries unless explicitly approved in `design.md`. Stick strictly to the defined vanilla HTML/CSS or preferred local stack.

2. **Read `MEMORY.md` fully before starting any general task.**
   - It documents every file, every bug, every decision, and every known issue.
   - Do NOT guess or assume the current state of the app — check `MEMORY.md` first.

3. **After completing any task, update `MEMORY.md`:**
   - Add a dated entry to `## Change History` describing what you changed and why.
   - Update the `## Feature Status` table if a feature changed state.
   - Move fixed bugs out of `## Known Bugs` (mark as resolved with date).
   - Add any new bugs you discovered during implementation.
   - Add implemented decisions to the `## Decisions Log`.
   - Never delete anything from `MEMORY.md`. Only append and update.