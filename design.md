
# Chemistry Educator Portal — Design System

> Version: 2.0
> Philosophy: Premium • Elegant • Academic • Minimal • Timeless

## 1. Vision

The Chemistry Educator Portal should feel like a premium university platform inspired by Coursera, Apple, Notion, Harvard Online, Oxford, and Adobe. Every screen must share one cohesive visual language.

## 2. Brand Colors

| Token | Hex | Usage |
|---|---|---|
| Primary Burgundy | #4A0E1B | Buttons, headings, active nav |
| Secondary Burgundy | #7C2532 | Hover, badges, accents |
| Academic Gold | #C9A13B | Premium highlights |
| Premium Beige | #D9C2A2 | Borders, secondary backgrounds |
| Warm Ivory | #F7F3EC | Main page background |
| Dark Text | #22201F | Primary text |

### Rules
- Never use pure black.
- Never introduce random colors.
- Gold is an accent, not a primary color.
- Use centralized theme tokens only.

## 3. Typography

- Primary: Inter
- Secondary: Poppins

| Style | Size | Weight |
|---|---:|---:|
| H1 | 48px | 700 |
| H2 | 36px | 700 |
| H3 | 28px | 600 |
| H4 | 22px | 600 |
| Body | 16px | 400 |
| Small | 14px | 400 |
| Caption | 12px | 500 |

## 4. Spacing

Use only:
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

## 5. Radius

- Small: 12px
- Medium: 18px
- Large: 24px
- Pill: 999px

## 6. Shadows

Cards:
`0 8px 24px rgba(74,14,27,.08)`

Hover:
`0 18px 40px rgba(74,14,27,.12)`

Floating:
`0 30px 70px rgba(74,14,27,.18)`

## 7. Layout

- Background: Warm Ivory
- Cards: White
- Maximum content width: 1440px
- Sticky glass navigation
- Spacious white space
- Consistent 32px section gaps

## 8. Navigation

- Height: 72px
- Glassmorphism
- Active underline: Burgundy
- Hover: Soft beige

## 9. Sidebar

- Width: 280px
- White background
- Active item: Soft burgundy background
- Icons: Burgundy

## 10. Buttons

Primary:
- Burgundy
- White text
- Rounded 16px
- Soft elevation

Secondary:
- White
- Beige border

Ghost:
- Transparent
- Soft hover

## 11. Cards

- White
- Rounded
- Soft shadow
- Large padding
- No heavy borders

## 12. Forms

- White inputs
- Beige borders
- Burgundy focus ring
- Rounded corners
- Consistent heights

Replace filename text inputs with real upload components.

## 13. Professor Dashboard

Provide CRUD for:
- Notes
- Videos
- PYQs
- Practice Sheets
- Announcements

Use upload widgets with:
- Progress
- Validation
- Success/error feedback

## 14. Student Dashboard

Students can:
- View PDFs
- Watch videos
- Download resources
- Read announcements
- Submit doubts

## 15. PDF Viewer

Use React PDF + PDF.js.

Features:
- Embedded viewer
- Zoom
- Search
- Page thumbnails
- Download
- Print
- Fullscreen
- Responsive

Never open placeholder PDFs.

## 16. Video Player

Use embedded YouTube player (react-youtube or IFrame API).

Features:
- Watch inside website
- Playlist sidebar
- Previous/Next lecture
- Fullscreen
- Captions
- Responsive
- No external redirects

## 17. Motion

- Duration: 200–250ms
- Ease-out
- Cards: subtle scale
- Buttons: slight lift
- No excessive animation

## 18. Accessibility

- WCAG AA contrast
- Keyboard navigation
- Visible focus rings
- ARIA labels
- Reduced motion support

## 19. Theme Governance

All colors, spacing, typography, shadows, radii and transitions must come from centralized design tokens.

No hardcoded colors in components.

## 20. Future Components

Follow the same design language for:
- Assignments
- Calendar
- Discussion forums
- Analytics
- Notifications
- Chat
- Student profiles

## Final Goal

The portal should feel like a luxury academic platform with a consistent premium experience across the landing page, dashboards, PDF viewer, video player, authentication, settings, and all future modules.