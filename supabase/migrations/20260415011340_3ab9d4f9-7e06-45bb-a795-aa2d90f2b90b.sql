
CREATE TABLE public.closet_style_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  days INTEGER NOT NULL DEFAULT 7,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  daily_outfits JSONB NOT NULL DEFAULT '[]'::jsonb,
  gender TEXT NOT NULL DEFAULT 'female',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.closet_style_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own style plans"
  ON public.closet_style_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own style plans"
  ON public.closet_style_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own style plans"
  ON public.closet_style_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own style plans"
  ON public.closet_style_plans FOR DELETE
  USING (auth.uid() = user_id);
