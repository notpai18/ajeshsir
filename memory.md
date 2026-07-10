# Ajesh Joe Portal — Project Memory

This document is the single source of truth for the state of the project. It tracks changes, known bugs, feature status, and architectural decisions.

## Change History

*   **2026-07-10**:
    *   **Removed Supporting Panels**: Completely removed the "Platform Stats", "Announcements", "Recently Added", and "Popular" panels from the bottom of the Student Dashboard landing page per user request.
    *   **Pulled changes from main**: Pulled the latest updates from the `main` branch. Resolved merge conflicts in `src/components/StudentDashboard.tsx` (combined imports and accepted incoming Redesigned V2 Landing Page structure while removing old STEP 1 block).
*   **2026-07-09**:
    *   **Created `AGENTS.md`**: Established strict agent rules regarding the use of `design.md` for UI/frontend tasks and `MEMORY.md` for overall state tracking.
    *   **Redesigned Exam Selection Grid**: Refactored the `StudentDashboard.tsx` exam selection grid to strictly follow the `design.md` Professor's Study aesthetic. Applied a custom 5-color palette (Deep Maroon, Maroon Red, Mustard Gold, Warm Sand, Charcoal) specifically to the 5 exam tracks.

## Feature Status

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Theme System** | In Progress | Transitioning to the "Professor's Study" light theme. |
| **Student Dashboard** | In Progress | Exam selection grid updated. Needs further alignment with `design.md`. |
| **Professor Dashboard** | Stable | Acts as the reference implementation (`design.md`) for the new visual identity. |

## Known Bugs

*(No known bugs at this time)*

## Decisions Log

*   **2026-07-09**: All UI components must strictly adhere to the `design.md` guidelines. Unauthorized external CSS frameworks (e.g., Tailwind) or component libraries are strictly prohibited. Vanilla CSS and the local stack are the standard.
*   **2026-07-09**: Mapped the 5-color palette to the exam tracks on the Student Dashboard to create distinct but cohesive visual identities for each exam type.