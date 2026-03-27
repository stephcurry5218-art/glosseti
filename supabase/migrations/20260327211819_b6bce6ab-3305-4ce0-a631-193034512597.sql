
-- Create the style-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('style-images', 'style-images', false)
ON CONFLICT (id) DO NOTHING;

-- Users can only view their own generated images
CREATE POLICY "Users can view own style images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'style-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can upload to their own folder
CREATE POLICY "Users can upload own style images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'style-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can update their own images
CREATE POLICY "Users can update own style images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'style-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can delete their own images
CREATE POLICY "Users can delete own style images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'style-images' AND (storage.foldername(name))[1] = auth.uid()::text);
