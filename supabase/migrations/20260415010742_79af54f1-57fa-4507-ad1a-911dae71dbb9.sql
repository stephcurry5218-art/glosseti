
-- Create closet_items table
CREATE TABLE public.closet_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  label TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  color TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.closet_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own closet items"
  ON public.closet_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own closet items"
  ON public.closet_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own closet items"
  ON public.closet_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own closet items"
  ON public.closet_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for closet item photos
INSERT INTO storage.buckets (id, name, public) VALUES ('closet-items', 'closet-items', false);

CREATE POLICY "Users can view own closet photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'closet-items' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload closet photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'closet-items' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete closet photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'closet-items' AND auth.uid()::text = (storage.foldername(name))[1]);
