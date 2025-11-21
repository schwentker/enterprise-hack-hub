-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  demo_link TEXT,
  repo_link TEXT,
  video_link TEXT,
  slides_link TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create judge_assignments table
CREATE TABLE public.judge_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(submission_id, judge_id)
);

-- Create scores table
CREATE TABLE public.scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL,
  innovation_score INTEGER NOT NULL CHECK (innovation_score >= 1 AND innovation_score <= 10),
  quality_score INTEGER NOT NULL CHECK (quality_score >= 1 AND quality_score <= 10),
  impact_score INTEGER NOT NULL CHECK (impact_score >= 1 AND impact_score <= 10),
  platform_score INTEGER NOT NULL CHECK (platform_score >= 1 AND platform_score <= 10),
  comments TEXT,
  scored_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(submission_id, judge_id)
);

-- Create awards table
CREATE TABLE public.awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  award_type TEXT NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
CREATE POLICY "Public read access to submissions"
  ON public.submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage submissions"
  ON public.submissions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for judge_assignments
CREATE POLICY "Judges can view their assignments"
  ON public.judge_assignments
  FOR SELECT
  USING (has_role(auth.uid(), 'judge') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage judge assignments"
  ON public.judge_assignments
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for scores
CREATE POLICY "Public read access to scores"
  ON public.scores
  FOR SELECT
  USING (true);

CREATE POLICY "Judges can insert their own scores"
  ON public.scores
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'judge') AND judge_id = auth.uid());

CREATE POLICY "Judges can update their own scores"
  ON public.scores
  FOR UPDATE
  USING (has_role(auth.uid(), 'judge') AND judge_id = auth.uid());

CREATE POLICY "Admins can manage all scores"
  ON public.scores
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for awards
CREATE POLICY "Public read access to awards"
  ON public.awards
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage awards"
  ON public.awards
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();

-- Create function to calculate average score
CREATE OR REPLACE FUNCTION public.get_submission_average_score(submission_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG((innovation_score + quality_score + impact_score + platform_score)::NUMERIC / 4), 2)
  FROM public.scores
  WHERE submission_id = submission_uuid
$$ LANGUAGE SQL STABLE;