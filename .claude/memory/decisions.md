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

## UI/UX Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-01-26 | Remove category system | Simplify navigation, user requested |
| 2026-01-26 | Personal pin + sort order | Each user customizes their own sidebar |
| 2026-01-26 | Drag & drop over viewCount | viewCount sorting not useful in practice |
| 2026-01-26 | @dnd-kit for drag & drop | Modern, accessible, React-friendly |
| 2026-01-26 | Separate pinned/unpinned zones | Clear visual separation for users |

## Rejected Ideas
| Date | Idea | Why Rejected |
|------|------|--------------|
| 2026-01-25 | Redux for state | Overkill for this app size |
| 2026-01-25 | Server components only | Need client interactivity |
| 2026-01-26 | ViewCount-based sorting | User found it not useful |
| 2026-01-26 | Up/Down buttons for reorder | Drag & drop more intuitive |

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

| 2026-02-22 | ICP Design System Option B | Keep stack (Next 14, React 18, Tailwind v3), adopt design tokens only |
| 2026-02-22 | Public Sans as primary font | ICP CI spec, Noto Sans Thai as fallback |
| 2026-02-22 | Use CSS variables for semantic colors | hsl(var(--success)) instead of hardcoded hex |
| 2026-02-22 | bg-background over bg-white | Theme consistency, use design tokens everywhere |
| 2026-02-22 | Scope transitions to interactive elements | Global * transition caused performance issues |
| 2026-02-22 | Admin same access text as User | Admin requires explicit access like regular users |

---
*Last updated: 2026-02-22*
