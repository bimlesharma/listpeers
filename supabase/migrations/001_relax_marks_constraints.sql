-- Migration to relax marks constraints for IPU data compatibility
-- Run this in Supabase SQL Editor if subjects are not being inserted

-- Remove old constraints
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_internal_marks_check;
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_external_marks_check;
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_credits_check;

-- Add more flexible constraints (0-100 for marks, 1-10 for credits)
ALTER TABLE subjects ADD CONSTRAINT subjects_internal_marks_check
  CHECK (internal_marks >= 0 AND internal_marks <= 100);
ALTER TABLE subjects ADD CONSTRAINT subjects_external_marks_check
  CHECK (external_marks >= 0 AND external_marks <= 100);
ALTER TABLE subjects ADD CONSTRAINT subjects_credits_check
  CHECK (credits >= 1 AND credits <= 10);

-- Verify the changes
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'subjects'::regclass;
