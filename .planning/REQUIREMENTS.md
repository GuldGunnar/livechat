# Requirements: Visitor Tracker

**Defined:** 2026-01-15
**Core Value:** Know instantly when someone visits your site and which page they're on.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Tracking Script

- [ ] **TRACK-01**: Embeddable JavaScript snippet that can be placed on any website
- [ ] **TRACK-02**: Real-time detection when a visitor lands on a tracked page
- [ ] **TRACK-03**: Visitor identification via localStorage/cookie with IP fallback

### Notifications

- [ ] **NOTIF-01**: Browser push notifications when visitor arrives (desktop)
- [ ] **NOTIF-02**: ntfy.sh integration for mobile push notifications
- [ ] **NOTIF-03**: Configurable notification content per project (select which fields to include)

### Dashboard

- [ ] **DASH-01**: Dashboard at qrplan.se/visitors using qrplan SSO authentication
- [ ] **DASH-02**: Real-time display of which page the visitor is currently on

### Project Management

- [ ] **PROJ-01**: Multi-project support (manage multiple sites from one dashboard)
- [ ] **PROJ-02**: Basic project configuration (name, domain, enabled/disabled)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Notifications

- **NOTIF-04**: Audio notification sound in dashboard when open

### Dashboard

- **DASH-03**: Visitor log/history (past visits)
- **DASH-04**: Assign aliases to recognized visitors
- **DASH-05**: Filter/search in visitor list

### Project Management

- **PROJ-03**: Advanced URL pattern matching (wildcards, regex)
- **PROJ-04**: Per-project notification settings granularity

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Chat functionality | This is awareness only, not interaction |
| Public SaaS | Only for NAHE's own sites, not external customers |
| Scroll/click tracking | Only page navigation, not detailed interactions |
| Mouse position tracking | Out of scope - too complex, not needed |
| Session recording/replay | Out of scope |
| Mobile app | Web dashboard + ntfy.sh is sufficient |

## Traceability

Which phases cover which requirements. Updated by create-roadmap.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | - | Pending |
| TRACK-02 | - | Pending |
| TRACK-03 | - | Pending |
| NOTIF-01 | - | Pending |
| NOTIF-02 | - | Pending |
| NOTIF-03 | - | Pending |
| DASH-01 | - | Pending |
| DASH-02 | - | Pending |
| PROJ-01 | - | Pending |
| PROJ-02 | - | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 10 ⚠️

---
*Requirements defined: 2026-01-15*
*Last updated: 2026-01-15 after initial definition*
