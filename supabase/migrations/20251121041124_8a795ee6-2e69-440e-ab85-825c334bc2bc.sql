-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  role TEXT NOT NULL,
  track TEXT NOT NULL,
  challenges TEXT[] NOT NULL,
  team_status TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  how_heard TEXT NOT NULL,
  agreed_to_code_of_conduct BOOLEAN NOT NULL DEFAULT false,
  registration_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read registrations (for count)
CREATE POLICY "Allow public read access"
ON public.registrations
FOR SELECT
USING (true);

-- Allow anyone to insert registrations
CREATE POLICY "Allow public insert"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at);
CREATE INDEX idx_registrations_email ON public.registrations(email);

-- Function to generate registration numbers
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(registration_number), 0) + 1 INTO next_number FROM public.registrations;
  RETURN next_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign registration numbers
CREATE OR REPLACE FUNCTION set_registration_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.registration_number = generate_registration_number();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_registration
BEFORE INSERT ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION set_registration_number();

-- Enable realtime for registration count updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;