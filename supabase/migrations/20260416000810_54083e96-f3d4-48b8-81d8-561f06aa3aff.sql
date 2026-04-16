
CREATE TABLE public.closet_looks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  image_url text NOT NULL,
  outfit_description text NOT NULL DEFAULT '',
  occasion text NOT NULL DEFAULT '',
  outfit_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  tips text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.closet_looks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own looks" ON public.closet_looks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own looks" ON public.closet_looks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own looks" ON public.closet_looks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
