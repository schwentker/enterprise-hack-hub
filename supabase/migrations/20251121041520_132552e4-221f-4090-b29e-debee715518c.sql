-- Make registration_number have a default value so it's optional on insert
ALTER TABLE public.registrations 
ALTER COLUMN registration_number SET DEFAULT generate_registration_number();