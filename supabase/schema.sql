-- ===========================================
-- ICPL × BI Report Portal - Database Schema
-- ===========================================
-- Run this script in Supabase SQL Editor
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. ENUM TYPES
-- ===========================================

-- User role enum
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- ===========================================
-- 2. TABLES
-- ===========================================

-- Users table (synced from Azure AD via OAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  department TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login TIMESTAMPTZ
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'folder' NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User-Report Access (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_report_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  granted_by UUID NOT NULL REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, report_id)
);

-- Activity logs for auditing
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ===========================================
-- 3. INDEXES
-- ===========================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_category_id ON reports(category_id);
CREATE INDEX IF NOT EXISTS idx_reports_is_active ON reports(is_active);
CREATE INDEX IF NOT EXISTS idx_reports_sort_order ON reports(sort_order);

-- User-Report Access indexes
CREATE INDEX IF NOT EXISTS idx_user_report_access_user_id ON user_report_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_report_access_report_id ON user_report_access(report_id);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- ===========================================
-- 4. TRIGGERS
-- ===========================================

-- Auto-update updated_at on reports
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_report_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ===============================
-- Users Policies
-- ===============================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update users
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===============================
-- Categories Policies
-- ===============================

-- Everyone can read categories
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===============================
-- Reports Policies
-- ===============================

-- Admins can read all reports
CREATE POLICY "Admins can read all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can read reports they have access to
CREATE POLICY "Users can read accessible reports"
  ON reports FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM user_report_access
      WHERE user_id = auth.uid() AND report_id = reports.id
    )
  );

-- Only admins can insert reports
CREATE POLICY "Admins can insert reports"
  ON reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update reports
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===============================
-- User Report Access Policies
-- ===============================

-- Admins can read all access records
CREATE POLICY "Admins can read all access"
  ON user_report_access FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can read their own access records
CREATE POLICY "Users can read own access"
  ON user_report_access FOR SELECT
  USING (user_id = auth.uid());

-- Only admins can manage access
CREATE POLICY "Admins can insert access"
  ON user_report_access FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete access"
  ON user_report_access FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===============================
-- Activity Logs Policies
-- ===============================

-- Only admins can read activity logs
CREATE POLICY "Admins can read activity logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can insert activity logs
CREATE POLICY "Users can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- 6. SEED DATA (Thai mock data)
-- ===========================================

-- Insert default admin user (will be replaced by actual Azure AD user)
INSERT INTO users (id, email, display_name, role, department, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'somchai.p@company.co.th', 'สมชาย ใจดี', 'admin', 'IT', true),
  ('00000000-0000-0000-0000-000000000002', 'somying.r@company.co.th', 'สมหญิง รักเรียน', 'user', 'การเงิน', true),
  ('00000000-0000-0000-0000-000000000003', 'manee.s@company.co.th', 'มานี สุขสันต์', 'user', 'ขาย', true),
  ('00000000-0000-0000-0000-000000000004', 'mana.m@company.co.th', 'มานะ มั่งมี', 'user', 'HR', true),
  ('00000000-0000-0000-0000-000000000005', 'wichai.r@company.co.th', 'วิชัย รุ่งเรือง', 'user', 'การตลาด', true)
ON CONFLICT (email) DO NOTHING;

-- Insert categories
INSERT INTO categories (id, name, description, icon, sort_order)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'ฝ่ายขาย', 'รายงานสำหรับฝ่ายขายและการตลาด', 'trending-up', 1),
  ('10000000-0000-0000-0000-000000000002', 'การเงิน', 'รายงานทางการเงินและบัญชี', 'dollar-sign', 2),
  ('10000000-0000-0000-0000-000000000003', 'ทรัพยากรบุคคล', 'รายงานด้าน HR และพนักงาน', 'users', 3),
  ('10000000-0000-0000-0000-000000000004', 'การตลาด', 'รายงานการตลาดและแคมเปญ', 'megaphone', 4),
  ('10000000-0000-0000-0000-000000000005', 'บริหาร', 'รายงานสำหรับผู้บริหาร', 'briefcase', 5)
ON CONFLICT DO NOTHING;

-- Insert sample reports
INSERT INTO reports (id, name, description, embed_url, category_id, sort_order, created_by)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'ยอดขายรายเดือน', 'รายงานยอดขายรายเดือนแยกตามภูมิภาค', 'https://app.powerbi.com/reportEmbed?reportId=sample1', '10000000-0000-0000-0000-000000000001', 1, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', 'ยอดขายรายไตรมาส', 'รายงานยอดขายรายไตรมาสเปรียบเทียบปีก่อน', 'https://app.powerbi.com/reportEmbed?reportId=sample2', '10000000-0000-0000-0000-000000000001', 2, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000003', 'งบกำไรขาดทุน', 'รายงานงบกำไรขาดทุนประจำเดือน', 'https://app.powerbi.com/reportEmbed?reportId=sample3', '10000000-0000-0000-0000-000000000002', 1, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000004', 'งบดุล', 'รายงานงบดุลประจำเดือน', 'https://app.powerbi.com/reportEmbed?reportId=sample4', '10000000-0000-0000-0000-000000000002', 2, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000005', 'อัตราการลาออก', 'รายงานอัตราการลาออกของพนักงาน', 'https://app.powerbi.com/reportEmbed?reportId=sample5', '10000000-0000-0000-0000-000000000003', 1, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000006', 'ค่าใช้จ่ายสวัสดิการ', 'รายงานค่าใช้จ่ายสวัสดิการพนักงาน', 'https://app.powerbi.com/reportEmbed?reportId=sample6', '10000000-0000-0000-0000-000000000003', 2, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000007', 'ROI แคมเปญ', 'รายงาน ROI ของแคมเปญการตลาด', 'https://app.powerbi.com/reportEmbed?reportId=sample7', '10000000-0000-0000-0000-000000000004', 1, '00000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000008', 'Executive Dashboard', 'ภาพรวมธุรกิจสำหรับผู้บริหาร', 'https://app.powerbi.com/reportEmbed?reportId=sample8', '10000000-0000-0000-0000-000000000005', 1, '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Grant access to users based on department
INSERT INTO user_report_access (user_id, report_id, granted_by)
VALUES
  -- somying (การเงิน) -> can access financial reports
  ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001'),
  -- manee (ขาย) -> can access sales reports
  ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
  -- mana (HR) -> can access HR reports
  ('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001'),
  -- wichai (การตลาด) -> can access marketing reports
  ('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ===========================================
-- Done! Schema created successfully
-- ===========================================
