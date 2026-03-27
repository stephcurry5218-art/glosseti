
CREATE TABLE public.style_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  style_category TEXT NOT NULL,
  style_name TEXT,
  celebrity_inspiration TEXT,
  gender TEXT NOT NULL DEFAULT 'female',
  generation_mode TEXT NOT NULL DEFAULT 'on-me',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.style_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own style history"
  ON public.style_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own style history"
  ON public.style_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_style_history_user ON public.style_history(user_id, created_at DESC);
