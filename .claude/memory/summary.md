# 📋 Project Summary

## Project Overview
- Name: ICPL × BI Report Portal
- Type: Enterprise Internal Tool (B2B)
- Tech Stack: Next.js 14, Tailwind CSS, shadcn/ui, Zustand, Supabase
- Language: Thai UI, English code

## Completed Features
- ✅ Microsoft SSO login page (Supabase Auth + Azure AD)
- ✅ OAuth callback route and middleware
- ✅ User Dashboard with report stats and quick access
- ✅ Collapsible sidebar menu (category → reports)
- ✅ Power BI Report Viewer with iframe embedding
- ✅ Admin Dashboard with overview stats
- ✅ Admin Report Management (CRUD)
- ✅ Admin Category Management (CRUD)
- ✅ Admin User Management (role, active status)
- ✅ Admin Access Management (3 views: by user, by report, matrix)
- ✅ Profile page
- ✅ Supabase integration (API layer)
- ✅ Mock data cleared - uses real database only

## Current State
Backend Ready - Requires Azure AD configuration in Supabase

## Key Files
- `src/app/page.tsx` - User Dashboard
- `src/app/login/page.tsx` - Login page (Supabase OAuth)
- `src/app/auth/callback/route.ts` - OAuth callback handler
- `src/app/reports/[id]/page.tsx` - Report viewer
- `src/app/admin/*` - Admin pages
- `src/stores/` - Zustand stores (async methods)
- `src/lib/api/` - Supabase API functions
- `src/lib/supabase/client.ts` - Supabase client
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/middleware.ts` - Session refresh + route protection
- `supabase/schema.sql` - Database schema + RLS + seed data
- `supabase/auth-trigger.sql` - User sync trigger

## Data Models
- Users (id, email, displayName, role, department, isActive)
- Categories (id, name, description, icon, sortOrder)
- Reports (id, name, description, embedUrl, categoryId, sortOrder, isActive)
- UserReportAccess (id, userId, reportId, grantedBy, grantedAt)
- ActivityLogs (id, userId, action, entityType, entityId, details)

## Important Notes
- Using Toh Framework
- Memory System is active
- Pattern E (Corporate/Enterprise) design
- App REQUIRES Supabase credentials to function
- Run schema.sql to create database + seed data
- Run auth-trigger.sql for OAuth user sync
- Configure Azure AD in Supabase Dashboard for Microsoft login

---
*Last updated: 2026-01-25*
