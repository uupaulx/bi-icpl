-- ===========================================
-- Remove Category Constraint Migration
-- ===========================================
-- Run this in Supabase SQL Editor
-- This removes the NOT NULL constraint on category_id
-- to allow reports without categories
-- ===========================================

-- Step 1: Drop the foreign key constraint
ALTER TABLE reports
DROP CONSTRAINT IF EXISTS reports_category_id_fkey;

-- Step 2: Make category_id nullable
ALTER TABLE reports
ALTER COLUMN category_id DROP NOT NULL;

-- Step 3: (Optional) Add back foreign key without ON DELETE RESTRICT
-- This allows category_id to be NULL but still validates existing values
ALTER TABLE reports
ADD CONSTRAINT reports_category_id_fkey
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Step 4: Drop the category index (optional - if you don't use categories)
-- DROP INDEX IF EXISTS idx_reports_category_id;

-- ===========================================
-- Done! Now reports can be created without categories
-- ===========================================
