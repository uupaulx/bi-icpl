-- ===========================================
-- ICPL × BI Report - Auth User Sync Trigger
-- ===========================================
-- Run this script AFTER schema.sql
-- This creates a trigger to auto-sync auth.users to public.users
-- ===========================================

-- Create function to handle new user signup from OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role, is_active, avatar_url, last_login)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    'user',  -- Default role for new users
    true,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    last_login = NOW(),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    display_name = COALESCE(
      EXCLUDED.display_name,
      public.users.display_name
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- Optional: Create function to handle user updates
-- ===========================================

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_login on sign in
  UPDATE public.users
  SET last_login = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth user updates (sign in)
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_update();

-- ===========================================
-- Done! Auth trigger setup complete
-- ===========================================
-- New users from Microsoft OAuth will now be automatically
-- synced to the public.users table with default 'user' role.
-- Admins can then promote users to 'admin' role via the UI.
-- ===========================================
