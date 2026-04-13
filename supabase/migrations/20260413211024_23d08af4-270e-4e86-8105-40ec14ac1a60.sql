CREATE TABLE public.app_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit suggestions" ON public.app_suggestions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own suggestions" ON public.app_suggestions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);