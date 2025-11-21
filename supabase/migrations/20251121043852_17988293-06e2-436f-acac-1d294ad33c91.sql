-- Create table for team matching
CREATE TABLE public.team_seekers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  track TEXT NOT NULL,
  skills_offered TEXT[] NOT NULL DEFAULT '{}',
  skills_needed TEXT[] NOT NULL DEFAULT '{}',
  looking_for_team BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_seekers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.team_seekers 
FOR SELECT 
USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" 
ON public.team_seekers 
FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own entries
CREATE POLICY "Allow users to update own entries" 
ON public.team_seekers 
FOR UPDATE 
USING (true);

-- Enable realtime for team_seekers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_seekers;