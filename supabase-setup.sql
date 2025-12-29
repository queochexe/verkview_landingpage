-- VerkView Waitlist Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow INSERT from anyone (for waitlist signup)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow SELECT only for authenticated users (for admin access)
CREATE POLICY "Allow authenticated read" ON waitlist
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Optional: Create a view for counting signups (public access)
CREATE OR REPLACE VIEW waitlist_count AS
  SELECT COUNT(*) as total FROM waitlist;

-- Grant access to the view
GRANT SELECT ON waitlist_count TO anon;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Waitlist table created successfully!';
  RAISE NOTICE 'You can now use the Supabase ANON key in your Vercel environment variables.';
END $$;
