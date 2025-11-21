-- Fix the search path for the get_submission_average_score function
CREATE OR REPLACE FUNCTION public.get_submission_average_score(submission_uuid UUID)
RETURNS NUMERIC 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ROUND(AVG((innovation_score + quality_score + impact_score + platform_score)::NUMERIC / 4), 2)
  FROM public.scores
  WHERE submission_id = submission_uuid
$$;