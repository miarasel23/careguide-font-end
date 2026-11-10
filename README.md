# Secure Note-Taking Frontend Dashboard

> **Technical Interview Submission**  
> **Candidate / Author:** Md Rasel Mia  
> **Phone:** 01997709990  
> **Email:** eng.rasel1994@gmail.com  
> **Architecture:** Care Guide Interview  
> **UI Design:** AdminLTE 3 Dashboard (Tailwind CSS Monochrome Black & White)  
> **Framework:** React.js 18 + Vite  

---

## 1. Overview

This frontend provides a responsive single-page application (SPA) dashboard for the Secure Note-Taking platform, built with React 18, Vite, and Tailwind CSS. The design adheres strictly to the classic **AdminLTE 3** dashboard aesthetic using a clean **monochrome black & white** color palette.

---

## 2. Features & Component Architecture

```
interview-font-end/
├── index.html                   # HTML template with Plus Jakarta Sans & JetBrains Mono
├── vite.config.js               # Vite config with /api reverse proxy to port 8000
├── tailwind.config.js           # Tailwind CSS config (preflight: false to preserve AdminLTE typography)
├── postcss.config.js            # PostCSS with tailwindcss and autoprefixer
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application container, info cards & tab state
    ├── index.css                # AdminLTE 3 monochrome stylesheet with Tailwind directives
    ├── api.js                   # Axios/fetch service layer with JWT Bearer handling
    └── components/
        ├── Navbar.jsx           # Pushmenu hamburger toggle, active user pill & logout button
        ├── Sidebar.jsx          # AdminLTE collapsible sidebar with live search filter
        ├── AuthModal.jsx        # Login/Register modal with 1-click Demo Fill
        ├── MyNotesTab.jsx       # User notes CRUD with pagination
        ├── AllNotesTab.jsx      # Admin view: notes across all users
        ├── UsersTab.jsx         # Admin user management (Add, Edit, Delete, Paginate)
        ├── AggregationsTab.jsx  # Interactive viewer for Scenario 1 & Scenario 2
        ├── IndexInspectorTab.jsx# Live database index audit & ESR rule verification
        ├── CommunityPostsTab.jsx# Public community feed & post publishing
        └── UserGuideTab.jsx     # Comprehensive in-app guide, credentials & candidate details
```

---

## 3. How to Run

### Install Dependencies
```bash
npm install
```

### Development Mode (with Hot Module Replacement)
```bash
npm run dev -- --host 0.0.0.0 --port 3000
```
- Dashboard URL: `http://localhost:3000`
- API calls to `/api/*` are automatically proxied to the backend at `http://localhost:8000`.

### Production Build
```bash
npm run build
```
Generates production-optimized static assets into `dist/`. The FastAPI backend also directly serves this built folder at `http://localhost:8000/`.
