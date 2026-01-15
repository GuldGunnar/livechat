# Visitor Tracker

## What This Is

A self-hosted visitor tracking and notification system for NAHE's websites. When someone visits a tracked page, the operator receives instant push notifications via browser, mobile (ntfy.sh), and dashboard sounds. Provides real-time awareness of visitor activity without requiring interaction.

## Core Value

**Know instantly when someone visits your site and which page they're on.** Everything else is secondary.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Embeddable tracking script that can be placed on any website
- [ ] Real-time visitor detection when someone lands on a tracked page
- [ ] Browser push notifications for desktop
- [ ] ntfy.sh integration for mobile notifications
- [ ] Audio notification in dashboard when open
- [ ] Project/site configuration (track whole domain or specific URL patterns)
- [ ] Configurable notification content per project (which fields to include)
- [ ] Visitor identification via cookie + IP fallback
- [ ] Ability to assign aliases to recognized visitors
- [ ] Real-time display of which page visitor is currently on
- [ ] Visitor log/history
- [ ] Dashboard at qrplan.se/visitors (React app with qrplan auth)
- [ ] Multi-project support (track multiple sites from one dashboard)

### Out of Scope

- Chat functionality - this is awareness only, not interaction
- Public SaaS - only for NAHE's own sites, not external customers
- Detailed interaction tracking (scrolling, clicks, mouse position) - just page navigation
- Mobile app - web dashboard + ntfy.sh is sufficient
- Session recording/replay - out of scope

## Context

**Inspiration:** Tawk.to-style widget bubble concept, but notifications-only, no chat.

**Use case:** Operator wants passive awareness of visitor activity. When notified, no action is required - it's information/statistics, not a call to action.

**Integration:** Dashboard hosted as part of qrplan.se ecosystem, uses existing auth. Widget/script is standalone and can be embedded on any domain.

**Existing patterns:** Similar architecture to Swedtrac WC dual-portal (staff dashboard + public/customer view). Follows NAHE's standard React + PHP stack.

**ntfy.sh:** Already in use for Claude Code notifications - proven pattern for mobile push.

## Constraints

- **Tech stack**: React 19 + TypeScript + Vite + Tailwind (frontend), PHP 8+ (backend), MySQL 8.0 - matches existing NAHE projects
- **Hosting**: IIS on DELL1 server, served from `dist/` folder
- **Auth**: Uses qrplan.se SSO for dashboard access
- **Conventions**: Swedish UI text, English code comments, Lucide icons only, NAHE footer
- **Encoding**: UTF-8 with `JSON_UNESCAPED_UNICODE` in all PHP
- **Location**: C:\inetpub\livechat (backend/widget), qrplan.se/visitors (dashboard)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Notifications only, no chat | User wants awareness, not interaction | - Pending |
| ntfy.sh for mobile | Already proven pattern in Claude Code hooks | - Pending |
| Cookie + IP for visitor ID | Balance between persistence and simplicity | - Pending |
| Dashboard in qrplan.se | Leverage existing auth, single admin interface | - Pending |
| Standalone widget script | Must work on any domain without dependencies | - Pending |

---
*Last updated: 2026-01-15 after initialization*
