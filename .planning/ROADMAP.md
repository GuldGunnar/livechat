# Roadmap: Visitor Tracker

## Overview

Build a self-hosted visitor tracking system from foundation to full notification suite. Start with tracking infrastructure, add dashboard with real-time display, then layer on browser and mobile notifications, project management, and configurable notification content.

## Domain Expertise

None (standard web stack patterns)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Database schema, project structure, API scaffolding
- [x] **Phase 2: Tracking Script Core** - Embeddable script with real-time detection
- [x] **Phase 3: Visitor Identification** - Cookie and IP-based visitor recognition
- [x] **Phase 4: Dashboard Foundation** - React dashboard with qrplan SSO auth
- [x] **Phase 5: Real-time Display** - Live visitor page tracking
- [x] **Phase 6: Browser Push** - Desktop push notifications via Push API
- [x] **Phase 7: Mobile Notifications** - ntfy.sh integration for mobile
- [x] **Phase 8: Project Management** - Multi-project support and configuration
- [x] **Phase 9: Notification Config** - Configurable notification content per project

## Phase Details

### Phase 1: Foundation
**Goal**: Set up project structure, database schema, and API scaffolding
**Depends on**: Nothing (first phase)
**Requirements**: None (foundation enables all requirements)
**Status**: Complete

### Phase 2: Tracking Script Core
**Goal**: Create embeddable JavaScript snippet that detects visitor arrivals
**Depends on**: Phase 1
**Requirements**: TRACK-01, TRACK-02
**Status**: Complete

### Phase 3: Visitor Identification
**Goal**: Implement visitor recognition via cookie with IP fallback
**Depends on**: Phase 2
**Requirements**: TRACK-03
**Status**: Complete

### Phase 4: Dashboard Foundation
**Goal**: Create React dashboard integrated with qrplan.se SSO
**Depends on**: Phase 1
**Requirements**: DASH-01
**Status**: Complete

### Phase 5: Real-time Display
**Goal**: Show live visitor activity with current page in dashboard
**Depends on**: Phase 3, Phase 4
**Requirements**: DASH-02
**Status**: Complete

### Phase 6: Browser Push
**Goal**: Implement browser push notifications for desktop
**Depends on**: Phase 5
**Requirements**: NOTIF-01
**Status**: Complete

### Phase 7: Mobile Notifications
**Goal**: Integrate ntfy.sh for mobile push notifications
**Depends on**: Phase 5
**Requirements**: NOTIF-02
**Status**: Complete

### Phase 8: Project Management
**Goal**: Multi-project support with project configuration
**Depends on**: Phase 4
**Requirements**: PROJ-01, PROJ-02
**Status**: Complete

### Phase 9: Notification Config
**Goal**: Configurable notification content per project
**Depends on**: Phase 6, Phase 7, Phase 8
**Requirements**: NOTIF-03
**Status**: Complete

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-01-15 |
| 2. Tracking Script Core | 1/1 | Complete | 2026-01-15 |
| 3. Visitor Identification | 1/1 | Complete | 2026-01-15 |
| 4. Dashboard Foundation | 1/1 | Complete | 2026-01-15 |
| 5. Real-time Display | 1/1 | Complete | 2026-01-15 |
| 6. Browser Push | 1/1 | Complete | 2026-01-15 |
| 7. Mobile Notifications | 1/1 | Complete | 2026-01-15 |
| 8. Project Management | 1/1 | Complete | 2026-01-15 |
| 9. Notification Config | 1/1 | Complete | 2026-01-15 |

**v1 Complete!**
