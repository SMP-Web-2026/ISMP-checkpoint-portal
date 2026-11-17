# ISMP Checkpoint Portal: Handoff & Progress Guide
**Current Status as of November 17, 2026**
*To be read alongside `AGENTS.md` when continuing development in Codex, Antigravity, or any agent environment.*

---

## 1. Project Overview & Context

- **Goal:** Progressive Web App (PWA) for the college Student Mentor Program (SMP). Mentors (ISMPs) log periodic checkpoint meets with first-year mentees with selfie proof and attendance notes. SMPC Coordinators (admins) monitor compliance and review AI-detection flags on selfies.
- **Roles:**
  - `mentor`: Sees only their own assigned mentees and their own past meets. **Never sees other mentors, other mentees, or any AI detection scores/flags.**
  - `smpc_admin`: Read/review only across all 150 mentors. Inspects selfie proofs, views AI confidence scores, and marks flags as reviewed.
- **Brand Palette:**
  - Background: Warm, modern sunny cream (`#FDF6DE`). Never dark gloomy mustard or plain white/black.
  - Navbar & Headers: Official SMP Navy (`#132647`), matching `src/assets/smp-logo.png`.
  - Accents: Golden Yellow (`#FFC50C`) and Warm Earthy Brown (`#78350F`).
  - Cards: Crisp white surfaces (`#FFFFFF`) with warm sand borders (`#E8D8AF`).

---

## 2. Completed Milestones (Stages 0 & 1 Fully Complete)

### Stage 0: Foundation & Scaffolding
- React 19 + TypeScript + Vite + Tailwind CSS v4.
- React Router v7 client-side routing.
- Responsive layout containers:
  - Admin Views: `max-w-6xl` (spacious full-width desktop view for data tables).
  - Mentor Views: `max-w-4xl` (balanced, clean width preventing awkward text wrapping).
  - Login View: `max-w-md`.
- Strictly configured `.gitignore` preventing `/design/`, `/reference/`, or internal markdown from reaching remote git.

### Stage 1: Static Pages with Mock Data & LocalStorage Persistence
1. **Slice 1 (Login & Auth Context):**
   - Mock users in `src/mock/users.ts` (`mentor_tanmay` and `smpc_coordinator`).
   - `AuthContext.tsx` with `localStorage` session persistence (mentors stay logged in).
   - `ProtectedRoute.tsx` role guards ensuring mentors cannot access admin routes and vice-versa.
2. **Slice 2 (Mentor Dashboard):**
   - Dynamic checkpoint progress bar (`X of 6 meets completed`) and remaining meets counter.
   - Chronological meet history feed (`Meet #X` down to `Meet #1`).
   - Sanitized API (`src/api/mentor.ts`) that strictly strips `aiScore` and `status` from mentor views.
3. **Slice 3 (Mentee Setup Form):**
   - Mentors configure assigned mentees once.
   - Fields: **Roll Number** (`26BXXXX`: 26B + 4 digits), **Full Name**, and **Department**.
   - Capacity capped at 12 mentees per mentor (matching institute wing assignments).
   - Saved to `localStorage` under `ismp_mentees_{mentorId}` and dynamically loaded in meet logs and dashboard.
4. **Slice 4 (New Meet Log Multi-Step Wizard):**
   - 4-step wizard:
     1. Selfie upload with instant preview via browser `FileReader`.
     2. Attendance selection (chips showing Name, Roll No, Department).
     3. Session summary + individual mentee notes for attendees.
     4. Review & submit.
   - Submissions persist to `localStorage` and immediately increment the mentor's progress counter on the dashboard.
5. **Slice 5 (SMPC Admin Dashboard):**
   - KPI metrics: Total Mentors, Average Checkpoint Completion, AI Flags Pending Review.
   - Real-time search by name, email, or department.
   - Sortable columns: Mentor Name, Progress, AI Flag status.
6. **Slice 6 (SMPC Mentor Detail View):**
   - Complete meet history for any mentor.
   - Displays AI detection confidence score (e.g. `88% AI Score` / `⚠️ AI Flagged`).
   - Human review actions: `✓ Reviewed: Not AI` and `⚠️ Reviewed: Confirmed Flag`.
   - Fullscreen photo zoom lightbox modal on selfie click.

---

## 3. Architecture & Code Map

```text
src/
├── types/
│   └── index.ts          # Core data models: User, Mentee, MeetLog, CheckpointRequirement
├── mock/
│   ├── users.ts          # Mock demo accounts (Tanmay Sonkar, Arnav Oza)
│   ├── mentees.ts        # Mock mentees with 26BXXXX roll numbers & departments
│   ├── meets.ts          # Sample past meets with selfies and AI scores
│   └── mentorsList.ts    # 7 representative mentors for the admin roster
├── api/
│   ├── auth.ts           # Login / Logout simulated endpoints
│   ├── mentees.ts        # getMentees / saveMentees (reads/writes localStorage)
│   ├── meets.ts          # getAllMeets, createMeetLog, updateMeetLog, deleteMeetLog
│   ├── mentor.ts         # getDashboardData (enforces AI score privacy)
│   └── admin.ts          # getDashboardData, getMentorDetail, reviewFlag
├── context/
│   └── AuthContext.tsx   # Global login state + session restoration
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx    # Header with SMP logo, user badge, and Sign Out
│   │   └── Layout.tsx    # Responsive shell (max-w-4xl for mentor, max-w-6xl for admin)
│   └── ProtectedRoute.tsx # Route barrier enforcing role permissions
└── pages/
    ├── LoginPage.tsx
    ├── MentorDashboardPage.tsx
    ├── MenteeSetupPage.tsx
    ├── NewMeetLogPage.tsx
    ├── AdminDashboardPage.tsx
    └── MentorDetailPage.tsx
```

---

## 4. Key Decisions & Next Steps (For Codex Continuation)

### Immediate Architecture Recommendations for Meet Editing / Long Descriptions:
- **Comprehensive Meet Edit Modal / Slide-out Panel:**
  - Rather than navigating to a brand new page, open a clean **Full Meet Modal** when clicking "Edit Meet" or clicking the meet card.
  - Inside the modal, allow mentors to edit:
    1. Overall summary textarea.
    2. Attended mentees checkboxes (add/remove attendees).
    3. Per-mentee notes for attending mentees.
    4. Replace selfie photo if needed.
  - This avoids creating extra URL routes while giving the full, rich editing experience.
- **Handling Long Summaries on the Dashboard:**
  - In the dashboard cards, clamp descriptions to 3 lines (`line-clamp-3`).
  - If a description exceeds 3 lines, show a subtle `"Read full meet details..."` link that pops open the Full Meet Modal.

### Next Roadmap Phases (From `AGENTS.md`):
- **Stage 2:** Deploy preview on Vercel or Netlify for seniors/coordinators to test.
- **Stage 3:**
  - Real Node.js + Express backend (replacing `src/mock/` with real REST API routes).
  - Database setup (Supabase or MongoDB Atlas).
  - Cloudinary image upload (replacing local base64 strings with real Cloudinary CDN URLs).
  - AI Image Detection API integration (Hive Moderation / Reality Defender).
  - PWA Manifest (`manifest.json`) and service worker for home-screen installation and offline caching.
