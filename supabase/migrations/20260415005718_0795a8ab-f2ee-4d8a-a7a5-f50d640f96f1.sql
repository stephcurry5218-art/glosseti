
-- Create storage bucket for face reference selfies
INSERT INTO storage.buckets (id, name, public) VALUES ('face-references', 'face-references', false);

-- Create table to track face reference photos per user
CREATE TABLE public.face_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.face_references ENABLE ROW LEVEL SECURITY;

-- Users can manage their own face references
CREATE POLICY "Users can view own face references" ON public.face_references FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own face references" ON public.face_references FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own face references" ON public.face_references FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage policies: users can manage their own face photos
CREATE POLICY "Users can upload face refs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'face-references' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own face refs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'face-references' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own face refs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'face-references' AND (storage.foldername(name))[1] = auth.uid()::text);
