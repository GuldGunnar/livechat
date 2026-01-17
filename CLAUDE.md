# CLAUDE.md - Visitor Tracker (livechat)

This file provides guidance to Claude Code when working with this project.

## Project Overview

Visitor Tracker is a **self-hosted visitor tracking and notification system** for NAHE's websites. When someone visits a tracked page, the operator receives instant push notifications via browser, mobile (ntfy.sh), and dashboard sounds.

**Core Value:** Know instantly when someone visits your site and which page they're on.

## Parent Conventions (MANDATORY)

This project follows all conventions from the parent [../CLAUDE.md](../CLAUDE.md):
- **UI Text**: Swedish (default), English translation
- **Icons**: Lucide icons only, no emojis
- **Footer**: NAHE Consulting footer on all pages
- **PHP Encoding**: UTF-8, `JSON_UNESCAPED_UNICODE`, `SET NAMES utf8mb4`
- **Code Comments**: English

## Environment

| Field | Value |
|-------|-------|
| **Location** | C:\inetpub\livechat |
| **Database** | MySQL `livechat` |
| **Runtime** | PHP 8+ |
| **Config** | C:\api_keys\livechat_config.php |

## Project Structure

```
livechat/
├── api/                    # REST API endpoints
│   ├── index.php           # API router
│   ├── track/              # Tracking endpoint (from widget)
│   ├── visitors/           # Visitor management + statistics
│   ├── projects/           # Project management
│   └── events/             # SSE real-time events
├── includes/               # Shared PHP utilities
│   ├── db.php              # Database connection
│   ├── cors.php            # CORS handling
│   ├── response.php        # JSON response helpers
│   ├── visitor.php         # Visitor identification
│   ├── user_agent_parser.php # OS/browser detection
│   └── notifications.php   # ntfy.sh integration
├── dashboard/              # Built React dashboard
├── dashboard-src/          # Dashboard source code (React + TypeScript)
│   └── src/
│       ├── components/
│       │   ├── Header.tsx          # Navigation with mobile menu
│       │   ├── MobileNav.tsx       # Slide-out mobile navigation
│       │   ├── VisitorCard.tsx     # Clickable visitor card
│       │   ├── VisitorDetailModal.tsx
│       │   ├── ProjectSettingsModal.tsx
│       │   ├── DateRangePicker.tsx
│       │   ├── charts/             # BarChart, PieChart, LineChart
│       │   └── ui/                 # Modal, etc.
│       └── pages/
│           ├── Dashboard.tsx
│           ├── Projects.tsx
│           ├── Statistics.tsx      # New statistics page
│           └── Settings.tsx
├── widget/                 # Embeddable tracking script
├── sql/                    # Database migrations
├── logs/                   # Application logs
├── index.php               # Landing page
└── .planning/              # GSD planning files
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API health check |
| POST | `/api/track` | Record visitor activity |
| GET | `/api/visitors` | List active visitors |
| GET | `/api/visitors/{id}` | Get visitor details |
| PUT | `/api/visitors/{id}` | Update visitor (alias) |
| GET | `/api/visitors/statistics` | Aggregated statistics with date filter |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/{id}` | Get project details |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |

## Database Schema

**projects** - Sites being tracked
- id, name, domain, enabled
- notification_browser, notification_ntfy, notification_sound, ntfy_topic

**visitors** - Identified users (via cookie/token)
- id, visitor_token, ip_address, user_agent
- os, browser, screen_width, screen_height (device detection)
- alias, first_seen, last_seen

**visits** - Page view tracking
- id, project_id, visitor_id
- page_url, page_title
- entered_at, exited_at, is_active, last_heartbeat

## Development Workflow

This project uses GSD (Get Shit Done) for planning. See `.planning/` for:
- `PROJECT.md` - Project definition
- `REQUIREMENTS.md` - Feature requirements
- `ROADMAP.md` - Phase breakdown
- `STATE.md` - Current progress

### Commands

```bash
# Run database schema
mysql -u root < sql/schema.sql

# Test API
curl http://localhost/livechat/api/
```

## Key Files

| File | Purpose |
|------|---------|
| `api/index.php` | API router |
| `api/track/index.php` | Tracking endpoint |
| `includes/db.php` | Database connection |
| `sql/schema.sql` | Database schema |
| `web.config` | IIS URL rewriting |

## Phase Status

**v1 Complete!** All 9 phases finished.
**v2 Complete!** Dashboard improvements.

See `.planning/ROADMAP.md` for full roadmap.

### v1 - Core Features
- [x] Phase 1: Foundation
- [x] Phase 2: Tracking Script Core
- [x] Phase 3: Visitor Identification
- [x] Phase 4: Dashboard Foundation
- [x] Phase 5: Real-time Display
- [x] Phase 6: Browser Push
- [x] Phase 7: Mobile Notifications
- [x] Phase 8: Project Management
- [x] Phase 9: Notification Config

### v2 - Dashboard Improvements (January 2026)
- [x] Mobile navigation (hamburger menu)
- [x] Clickable visitor cards with detail modal
- [x] Project settings modal with embed code
- [x] Device detection (OS, browser, screen resolution)
- [x] Statistics page with charts and date filtering

## Deployment

**IIS Site:** livechat on port 8088
**API URL:** http://192.168.0.213:8088/api/

### Embed Tracker
```html
<script src="http://192.168.0.213:8088/widget/tracker.js"
        data-domain="your-domain.com"></script>
```
