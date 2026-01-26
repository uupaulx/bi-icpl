-- User Report Preferences Table
-- Stores personal pinned status and view count per user per report

CREATE TABLE IF NOT EXISTS user_report_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only have one preference per report
  UNIQUE(user_id, report_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_report_preferences_user_id ON user_report_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_report_preferences_report_id ON user_report_preferences(report_id);

-- RLS Policies
ALTER TABLE user_report_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own preferences
CREATE POLICY "Users can read own preferences" ON user_report_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON user_report_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_report_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences" ON user_report_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all preferences" ON user_report_preferences
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_report_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_user_report_preferences_updated_at ON user_report_preferences;
CREATE TRIGGER trigger_update_user_report_preferences_updated_at
  BEFORE UPDATE ON user_report_preferences
  FOR EACH ROW EXECUTE FUNCTION update_user_report_preferences_updated_at();
