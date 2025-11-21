-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  track TEXT NOT NULL,
  challenge TEXT,
  status TEXT NOT NULL DEFAULT 'forming',
  max_members INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  role TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(registration_id)
);

-- Create team_notes table for admin notes
CREATE TABLE public.team_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Public read access to teams"
  ON public.teams
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage teams"
  ON public.teams
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for team_members
CREATE POLICY "Public read access to team members"
  ON public.team_members
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage team members"
  ON public.team_members
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for team_notes
CREATE POLICY "Admins can view team notes"
  ON public.team_notes
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage team notes"
  ON public.team_notes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create function to update teams updated_at
CREATE OR REPLACE FUNCTION public.update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();