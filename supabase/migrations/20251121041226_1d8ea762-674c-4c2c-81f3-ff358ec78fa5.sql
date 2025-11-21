-- Fix security warnings by setting search_path for functions

CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(registration_number), 0) + 1 INTO next_number FROM public.registrations;
  RETURN next_number;
END;
$$;

CREATE OR REPLACE FUNCTION set_registration_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.registration_number = generate_registration_number();
  RETURN NEW;
END;
$$;