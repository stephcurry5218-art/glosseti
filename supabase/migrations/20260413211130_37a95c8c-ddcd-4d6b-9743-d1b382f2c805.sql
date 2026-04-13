ALTER TABLE public.app_suggestions ALTER COLUMN user_id DROP NOT NULL;

CREATE POLICY "Anonymous can submit suggestions" ON public.app_suggestions
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);