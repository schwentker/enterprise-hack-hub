-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sponsor TEXT,
  prize_amount NUMERIC,
  recommended_track TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prizes table
CREATE TABLE public.prizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prize_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_templates table
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_type TEXT NOT NULL UNIQUE,
  webhook_url TEXT,
  settings JSONB,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges
CREATE POLICY "Public read access to challenges"
  ON public.challenges
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage challenges"
  ON public.challenges
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for prizes
CREATE POLICY "Public read access to prizes"
  ON public.prizes
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage prizes"
  ON public.prizes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for notification_templates
CREATE POLICY "Admins can view notification templates"
  ON public.notification_templates
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage notification templates"
  ON public.notification_templates
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for integrations
CREATE POLICY "Admins can view integrations"
  ON public.integrations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage integrations"
  ON public.integrations
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add new columns to event_settings
ALTER TABLE public.event_settings
  ADD COLUMN event_start_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN event_end_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN registration_deadline TIMESTAMP WITH TIME ZONE,
  ADD COLUMN submission_deadline TIMESTAMP WITH TIME ZONE,
  ADD COLUMN auto_advance_phases BOOLEAN DEFAULT false;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();

CREATE TRIGGER update_prizes_updated_at
  BEFORE UPDATE ON public.prizes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();

-- Insert default notification templates
INSERT INTO public.notification_templates (template_type, subject, body) VALUES
  ('registration_confirmation', 'Welcome to {{event_name}}!', 'Hi {{name}},\n\nThank you for registering for {{event_name}}! We''re excited to have you join us.\n\nEvent Details:\n- Track: {{track}}\n- Registration #: {{registration_number}}\n\nNext steps:\n1. Join our community channels\n2. Start forming your team\n3. Review the challenges\n\nSee you at the event!\n\nBest regards,\nThe {{event_name}} Team'),
  ('team_formation_reminder', 'Don''t forget to form your team!', 'Hi {{name}},\n\nJust a friendly reminder to form your team for {{event_name}}!\n\nWe have {{days_left}} days until team formation closes.\n\nNeed help finding teammates? Check out our matching platform!\n\nBest regards,\nThe {{event_name}} Team'),
  ('submission_reminder', 'Submission deadline approaching!', 'Hi {{team_name}},\n\nThe submission deadline for {{event_name}} is approaching!\n\nDeadline: {{deadline}}\n\nMake sure to submit:\n- Project demo link\n- GitHub repository\n- Video presentation (optional)\n- Slides (optional)\n\nGood luck!\n\nBest regards,\nThe {{event_name}} Team'),
  ('winner_announcement', 'Congratulations - You won!', 'Hi {{team_name}},\n\nCongratulations! Your project "{{project_name}}" has won {{award_type}} at {{event_name}}!\n\nPrize: {{prize_amount}}\n\nWe''ll be in touch soon with details on claiming your prize.\n\nThank you for participating!\n\nBest regards,\nThe {{event_name}} Team');

-- Insert default prize structure
INSERT INTO public.prizes (prize_type, amount, description) VALUES
  ('Grand Prize', 10000, 'Overall best project across all tracks'),
  ('Track Winner - Promptathon', 5000, 'Best project in Promptathon track'),
  ('Track Winner - Buildathon', 5000, 'Best project in Buildathon track'),
  ('Track Winner - Vibeathon', 5000, 'Best project in Vibeathon track'),
  ('Best Innovation', 2500, 'Most innovative solution'),
  ('Best UX', 2500, 'Best user experience design'),
  ('People''s Choice', 1000, 'Community favorite project');