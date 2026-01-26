# 📋 Project Summary

## Project Overview
- Name: ICPL × BI Report Portal
- Type: Enterprise Internal Tool (B2B)
- Tech Stack: Next.js 14, Tailwind CSS, shadcn/ui, Zustand, Supabase
- Language: Thai UI, English code

## Completed Features
- ✅ Microsoft SSO login (Supabase Auth + Azure AD)
- ✅ OAuth callback route and middleware
- ✅ Collapsible sidebar with search and drag & drop
- ✅ Report list with pin/unpin and custom ordering
- ✅ Power BI Report Viewer with iframe embedding
- ✅ Admin Report Management (CRUD)
- ✅ Admin User + Access Management (combined page)
- ✅ Supabase integration (API layer)

## Current State
Backend Ready - Requires Azure AD configuration in Supabase

## Key Files
- `src/app/page.tsx` - Redirects to first report or login
- `src/app/login/page.tsx` - Login page (Supabase OAuth)
- `src/app/auth/callback/route.ts` - OAuth callback handler
- `src/app/reports/[id]/page.tsx` - Report viewer
- `src/app/admin/reports/page.tsx` - Admin report management
- `src/app/admin/users/page.tsx` - Admin user + access management
- `src/components/layout/sidebar.tsx` - Sidebar with search + drag & drop
- `src/stores/report-store.ts` - Report + preferences state
- `src/lib/api/preferences.ts` - Pin/sortOrder API
- `supabase/schema.sql` - Database schema + RLS
- `supabase/user_report_preferences.sql` - User preferences table

## Data Models
- Users (id, email, displayName, role, department, isActive)
- Reports (id, name, description, embedUrl, isActive)
- UserReportAccess (id, userId, reportId, grantedBy, grantedAt)
- UserReportPreferences (id, userId, reportId, isPinned, sortOrder)
- ActivityLogs (id, userId, action, entityType, entityId, details)

## Recent Changes (2026-01-26)
- Removed category system completely
- Added drag & drop report ordering (@dnd-kit)
- Added search box in sidebar
- Pin/unpin reports (personal per user)
- Custom sort order per user

## Important Notes
- Using Toh Framework
- Memory System is active
- Pattern E (Corporate/Enterprise) design
- App REQUIRES Supabase credentials to function
- Run user_report_preferences.sql if table doesn't exist

---
*Last updated: 2026-01-26*
