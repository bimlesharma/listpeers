-- Migration to add INSERT policy for consent_log table
-- Run this in Supabase SQL Editor

-- Allow users to insert their own consent logs
CREATE POLICY "Users can insert own consent logs" ON consent_log
  FOR INSERT WITH CHECK (auth.uid() = student_id);
