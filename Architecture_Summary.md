# Architecture Summary: Chemistry Learning Platform

## Overview
This document outlines the technical architecture, technology stack, and structural patterns used in the Chemistry Learning Platform. The platform is designed to provide a highly modular, responsive, and robust academic environment catering to both students and professors.

---

## 1. Technology Stack

- **Core Library**: React 19
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4) with bespoke utility classes.
- **Build Tool**: Vite (v6) for rapid development and optimized production builds.
- **Backend & Database**: Supabase (PostgreSQL, Authentication, and Storage integration).
- **Icons**: Lucide React for consistent and lightweight SVG iconography.
- **PDF Rendering**: `react-pdf` for integrated, seamless document viewing.

---

## 2. Core Architecture

The architecture is broadly split into Presentation, Context (State Management), and Services (Data Access):

### A. Presentation Layer (UI/UX)
- **Routing & Views (`AppNew.tsx`)**: Manages the top-level routes separating public informational pages (`/`, `/about`, `/contact`, `/privacy`) from authenticated functional views (`/resources`, student and professor dashboards).
- **Premium Component System**: Employs a custom design language ("Professor's Study" theme). The `PremiumCard.tsx` serves as a core atomic block, ensuring uniform aesthetics, accessibility standards, and hover micro-animations across the platform.

### B. State Management
- **Portal Data Context (`PortalDataContext.tsx`)**: Provides centralized state management, orchestrating CRUD operations for resources (notes, videos, PYQs, practice sheets, doubts, and announcements) and distributing data to the dashboard components.

### C. Services & API Layer (`src/services/`)
- A modular service layer interfacing with Supabase to abstract database operations from components.
- Modules include: `notesService.ts`, `videosService.ts`, `pyqsService.ts`, `practiceSheetsService.ts`, `doubtsService.ts`, `announcementsService.ts`, and `storageService.ts`.

---

## 3. Notable System Modules

### Document Viewer System (`src/components/pdf/`)
A custom-built, in-app PDF rendering engine providing a distraction-free reading experience without requiring third-party plugins.
- **`PDFContext.tsx`**: Manages the complex state of the viewer (zoom levels, rotation, active page, full-screen toggles, theme adjustments like dark/sepia modes, and bookmarks).
- **`PDFToolbar.tsx`**: Exposes controls for pagination, zoom presets, integrated search functionality, download, and print capabilities.
- **`PDFViewer.tsx`**: Orchestrates the rendering pipeline using `react-pdf`.

### Utility Modules (`src/lib/`)
- **`supabase.ts`**: Configures the Supabase client connection.
- **`youtube.ts`**: Provides robust URL parsing and validation logic to safely embed and fetch thumbnails for video resources.
- **`pdfUrl.ts`**: Handles secure document fetching and download protocols.

---

## 4. Design & Aesthetic Philosophy
The system implements a rigid but luxurious aesthetic standard to create an engaging learning space.
- **Colors**: Dominated by Deep Maroons (`#4A0E1B`), Charcoals (`#22201F`), and warm Sands (`#D9C2A2`).
- **Typography & Accessibility**: Utilizes `dash-serif` and standard sans-serifs, ensuring high readability and WCAG compliance.
- **Interactions**: All components use smooth, subtle micro-animations (e.g., card lifts, hover borders) to provide instantaneous tactile feedback.

---

## 5. Security & Deployment (Vite)
- **Environment Management**: Secrets and API keys for Supabase are strictly loaded via Vite's environment configurations (`dotenv`).
- **Responsive & Static Deployment**: Optimized via Vite builder and deployed as a client-centric Single Page Application (SPA).

---

*This document reflects the current state of the architecture. For deeper insights into individual features, refer to the respective module implementations within the `src/` directory.*
