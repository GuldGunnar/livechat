# Roadmap: Visitor Tracker

## Overview

Build a self-hosted visitor tracking system from foundation to full notification suite. Start with tracking infrastructure, add dashboard with real-time display, then layer on browser and mobile notifications, project management, and configurable notification content.

## Domain Expertise

None (standard web stack patterns)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Database schema, project structure, API scaffolding
- [ ] **Phase 2: Tracking Script Core** - Embeddable script with real-time detection
- [ ] **Phase 3: Visitor Identification** - Cookie and IP-based visitor recognition
- [ ] **Phase 4: Dashboard Foundation** - React dashboard with qrplan SSO auth
- [ ] **Phase 5: Real-time Display** - Live visitor page tracking
- [ ] **Phase 6: Browser Push** - Desktop push notifications via Push API
- [ ] **Phase 7: Mobile Notifications** - ntfy.sh integration for mobile
- [ ] **Phase 8: Project Management** - Multi-project support and configuration
- [ ] **Phase 9: Notification Config** - Configurable notification content per project

## Phase Details

### Phase 1: Foundation
**Goal**: Set up project structure, database schema, and API scaffolding
**Depends on**: Nothing (first phase)
**Requirements**: None (foundation enables all requirements)
**Research**: Unlikely (standard NAHE stack patterns)
**Plans**: TBD

### Phase 2: Tracking Script Core
**Goal**: Create embeddable JavaScript snippet that detects visitor arrivals
**Depends on**: Phase 1
**Requirements**: TRACK-01, TRACK-02
**Research**: Unlikely (standard JS patterns)
**Plans**: TBD

### Phase 3: Visitor Identification
**Goal**: Implement visitor recognition via cookie with IP fallback
**Depends on**: Phase 2
**Requirements**: TRACK-03
**Research**: Unlikely (standard cookie/localStorage patterns)
**Plans**: TBD

### Phase 4: Dashboard Foundation
**Goal**: Create React dashboard integrated with qrplan.se SSO
**Depends on**: Phase 1
**Requirements**: DASH-01
**Research**: Likely (qrplan SSO integration)
**Research topics**: qrplan.se auth flow, session handling, API integration patterns
**Plans**: TBD

### Phase 5: Real-time Display
**Goal**: Show live visitor activity with current page in dashboard
**Depends on**: Phase 3, Phase 4
**Requirements**: DASH-02
**Research**: Likely (real-time architecture decision)
**Research topics**: WebSocket vs SSE vs polling for this use case, PHP real-time patterns
**Plans**: TBD

### Phase 6: Browser Push
**Goal**: Implement browser push notifications for desktop
**Depends on**: Phase 5
**Requirements**: NOTIF-01
**Research**: Likely (Browser Push API)
**Research topics**: Push API, service workers, VAPID keys, notification permissions
**Plans**: TBD

### Phase 7: Mobile Notifications
**Goal**: Integrate ntfy.sh for mobile push notifications
**Depends on**: Phase 5
**Requirements**: NOTIF-02
**Research**: Likely (external service)
**Research topics**: ntfy.sh API, topic management, priority levels
**Plans**: TBD

### Phase 8: Project Management
**Goal**: Multi-project support with project configuration
**Depends on**: Phase 4
**Requirements**: PROJ-01, PROJ-02
**Research**: Unlikely (standard CRUD patterns)
**Plans**: TBD

### Phase 9: Notification Config
**Goal**: Configurable notification content per project
**Depends on**: Phase 6, Phase 7, Phase 8
**Requirements**: NOTIF-03
**Research**: Unlikely (internal configuration patterns)
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/? | Not started | - |
| 2. Tracking Script Core | 0/? | Not started | - |
| 3. Visitor Identification | 0/? | Not started | - |
| 4. Dashboard Foundation | 0/? | Not started | - |
| 5. Real-time Display | 0/? | Not started | - |
| 6. Browser Push | 0/? | Not started | - |
| 7. Mobile Notifications | 0/? | Not started | - |
| 8. Project Management | 0/? | Not started | - |
| 9. Notification Config | 0/? | Not started | - |
