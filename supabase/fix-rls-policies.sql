-- ===========================================
-- FIX RLS POLICIES - Use email instead of ID
-- ===========================================
-- Run this script in Supabase SQL Editor
-- This fixes the issue where users.id doesn't match auth.uid()
-- ===========================================

-- Drop ALL existing policies that we'll recreate
-- Users
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Categories
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

-- Reports
DROP POLICY IF EXISTS "Admins can read all reports" ON reports;
DROP POLICY IF EXISTS "Admins can insert reports" ON reports;
DROP POLICY IF EXISTS "Admins can update reports" ON reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON reports;

-- User Report Access
DROP POLICY IF EXISTS "Admins can read all access" ON user_report_access;
DROP POLICY IF EXISTS "Admins can insert access" ON user_report_access;
DROP POLICY IF EXISTS "Admins can update access" ON user_report_access;
DROP POLICY IF EXISTS "Admins can delete access" ON user_report_access;

-- Activity Logs
DROP POLICY IF EXISTS "Admins can read activity logs" ON activity_logs;

-- ===========================================
-- Create helper function to check if user is admin
-- ===========================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE email = auth.jwt()->>'email'
    AND role = 'admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- Recreate policies using email-based admin check
-- ===========================================

-- ===============================
-- Users Policies
-- ===============================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (email = auth.jwt()->>'email');

-- Admins can read all users (using email check)
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (email = auth.jwt()->>'email');

-- Admins can update all users (using email check)
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (is_admin());

-- Users can insert themselves (for first-time OAuth login)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (email = auth.jwt()->>'email');

-- Admins can insert any user
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (is_admin());

-- ===============================
-- Categories Policies
-- ===============================

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin());

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ===============================
-- Reports Policies
-- ===============================

-- Admins can read all reports
CREATE POLICY "Admins can read all reports"
  ON reports FOR SELECT
  USING (is_admin());

-- Only admins can insert reports
CREATE POLICY "Admins can insert reports"
  ON reports FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update reports
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (is_admin());

-- Only admins can delete reports (if needed)
CREATE POLICY "Admins can delete reports"
  ON reports FOR DELETE
  USING (is_admin());

-- ===============================
-- User Report Access Policies
-- ===============================

-- Admins can read all access records
CREATE POLICY "Admins can read all access"
  ON user_report_access FOR SELECT
  USING (is_admin());

-- Only admins can manage access
CREATE POLICY "Admins can insert access"
  ON user_report_access FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update access"
  ON user_report_access FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete access"
  ON user_report_access FOR DELETE
  USING (is_admin());

-- ===============================
-- Activity Logs Policies
-- ===============================

-- Only admins can read activity logs
CREATE POLICY "Admins can read activity logs"
  ON activity_logs FOR SELECT
  USING (is_admin());

-- ===========================================
-- Verify the fix
-- ===========================================
-- Run this to check if your user is now recognized as admin:
-- SELECT is_admin();

-- ===========================================
-- Done! RLS policies fixed
-- ===========================================
