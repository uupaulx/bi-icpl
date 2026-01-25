# 🧠 Key Decisions

## Architecture Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-25 | Use Toh Framework | AI-Orchestration Driven Development |
| 2026-01-25 | Next.js 14 App Router | PRD recommendation + modern React |
| 2026-01-25 | Zustand for state | Simpler than Redux, persist support |
| 2026-01-25 | Mock auth first | Allow development without real OAuth |

## Design Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-25 | Pattern E (Corporate/Enterprise) | B2B internal tool with data tables |
| 2026-01-25 | ICPL Blue (#004F9F) primary | Following ICPL Corporate Identity |
| 2026-01-25 | Collapsible sidebar menu | PRD specifies category-based navigation |
| 2026-01-25 | Thai UI labels | Project language setting for Thai org |
| 2026-01-25 | Noto Sans Thai font | CI specifies Thai-friendly typography |
| 2026-01-25 | Site name "ICPL × BI Report" | CI branding requirement |

## Business Logic
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-25 | Admin sees all reports by role | Simpler than separate access records |
| 2026-01-25 | Default no access for new users | PRD requirement for security |
| 2026-01-25 | Soft delete for reports | Keep audit history per PRD |
| 2026-01-25 | Power BI Public Embed only | PRD specifies no paid embedding |

## Rejected Ideas
| Date | Idea | Why Rejected |
|------|------|--------------|
| 2026-01-25 | Redux for state | Overkill for this app size |
| 2026-01-25 | Server components only | Need client interactivity |

## Testing Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-25 | Playwright for E2E testing | Industry standard, good DX |
| 2026-01-25 | Chromium only for dev tests | Faster test runs |
| 2026-01-25 | Navigate via sidebar for auth-dependent tests | Ensures login state persists |

## Backend Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-25 | Supabase for backend | PRD specifies, good auth+DB combo |
| 2026-01-25 | Mock fallback for API | Dev works without Supabase setup |
| 2026-01-25 | Untyped Supabase client | Type inference issues with custom Database type |
| 2026-01-25 | RLS policies per role | Admin full access, users limited |
| 2026-01-25 | Activity logs for auditing | Track all admin actions |
| 2026-01-25 | UUID for all IDs | Supabase standard, secure |
| 2026-01-25 | Remove all mock fallbacks | App requires real Supabase |
| 2026-01-25 | Async store methods | API calls are async |

---
*Last updated: 2026-01-25*
