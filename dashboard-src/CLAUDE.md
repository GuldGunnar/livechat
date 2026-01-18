# CLAUDE.md - Visitor Tracker Dashboard

Real-time visitor tracking dashboard for monitoring website visitors.

## Project Overview

| Field | Value |
|-------|-------|
| **Type** | React SPA (TypeScript) |
| **Build** | Vite |
| **Deploy to** | `qrplan.eu/dashboard/` |
| **API** | `qrplan.eu/api/visitors/` |

## Quick Commands

```bash
# Development
cd C:\inetpub\livechat-new\dashboard-src
npm run dev

# Build & Deploy
npm run build
# Output goes to ../dashboard-dist/
# Copy to C:\inetpub\qrplan.eu\dashboard\
```

## Architecture

```
dashboard-src/
├── src/
│   ├── api/
│   │   └── client.ts         # API client for /api/visitors/*
│   ├── components/
│   │   ├── Header.tsx        # Navigation header
│   │   ├── MobileNav.tsx     # Mobile slide-out menu
│   │   ├── VisitorCard.tsx   # Visitor display card
│   │   ├── VisitorDetailModal.tsx  # Visitor details + alias editing
│   │   ├── ProjectSettingsModal.tsx # Project settings + notifications
│   │   ├── DateRangePicker.tsx     # Date range selector
│   │   ├── charts/           # Chart components (Bar, Line, Pie)
│   │   └── ui/
│   │       └── Modal.tsx     # Reusable modal component
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication state
│   ├── hooks/
│   │   └── useNotifications.ts # Browser & sound notifications
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main visitor view
│   │   ├── Projects.tsx      # Project management
│   │   ├── Statistics.tsx    # Analytics & charts
│   │   ├── Settings.tsx      # User settings
│   │   └── Documentation.tsx # User guide
│   └── App.tsx               # Routes & layout
└── vite.config.ts            # Build config (base: /dashboard)
```

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/visitors` | GET | List active visitors |
| `/api/visitors/{id}` | PUT | Update visitor (alias) |
| `/api/visitors/projects` | GET | List projects |
| `/api/visitors/projects` | POST | Create project |
| `/api/visitors/projects/{id}` | PUT | Update project |
| `/api/visitors/projects/{id}` | DELETE | Delete project |
| `/api/visitors/statistics` | GET | Get aggregated stats |
| `/api/visitors/events` | GET | SSE real-time events |

## Features

### Dashboard
- Real-time visitor list (5s polling)
- Visitor cards with OS, browser, current page
- Click card to view details and set alias
- Grouped by project

### Notifications
- **Browser notifications**: Shows popup when new visitor arrives
- **Sound notifications**: Plays beep tone
- **ntfy notifications**: Server-side push to ntfy.sh
- Configured per-project in Project Settings

### Projects
- Create/edit/delete tracking projects
- Enable/disable tracking
- Configure notifications (browser, sound, ntfy)
- Copy embed code for website integration

### Statistics
- Date range picker
- Visits per day (bar chart)
- OS distribution (pie chart)
- Browser distribution (pie chart)
- Device type distribution (pie chart)

### Documentation
- Tabbed user guide
- Integration instructions
- API documentation

## Parent Conventions (MANDATORY)

This project follows all conventions from the parent [CLAUDE.md](../../qrplan.eu/CLAUDE.md):
- **Language**: Swedish UI text (no translation system - hardcoded)
- **Icons**: Lucide icons only, no emojis
- **Footer**: NAHE Consulting footer on all pages
- **Code Comments**: English

## Key Implementation Details

### Notification System
- `useNotifications` hook tracks previous visitor IDs
- Compares current vs previous to detect new arrivals
- Skips notifications on first page load
- Checks project settings for enabled notification types
- Uses Web Audio API for sound (no audio files needed)

### API Client
- Base URL: `/api`
- All project endpoints use `/visitors/projects` prefix
- Returns typed responses via generics

### Authentication
- Uses qrplan.eu SSO session
- Redirects to `/login.php` if not authenticated
- Session checked via `/api/auth/me`
