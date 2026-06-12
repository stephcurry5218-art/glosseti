
-- Remove duplicate avatar policies
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatars" ON storage.objects;

-- Restrict usage_tracking inserts to tier='free'
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can insert own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users insert own usage" ON public.usage_tracking;

CREATE POLICY "Users insert own free usage"
ON public.usage_tracking FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND tier = 'free');
