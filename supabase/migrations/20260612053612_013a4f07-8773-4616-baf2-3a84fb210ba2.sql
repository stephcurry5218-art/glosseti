
-- 1. partner-assets storage: replace open upload with admin-only
DROP POLICY IF EXISTS "Anyone can upload to partner-assets" ON storage.objects;
CREATE POLICY "Admins upload partner-assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'partner-assets' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update partner-assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'partner-assets' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'partner-assets' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete partner-assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'partner-assets' AND public.is_admin(auth.uid()));

-- 2. avatars: prevent broad listing (direct public URLs still work because bucket is public)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;

-- 3. partner_applications: allow public submissions
CREATE POLICY "Anyone can submit applications"
ON public.partner_applications FOR INSERT TO anon, authenticated
WITH CHECK (true);
GRANT INSERT ON public.partner_applications TO anon, authenticated;

-- 4. partner_contact_requests: allow public submissions
CREATE POLICY "Anyone can submit contact requests"
ON public.partner_contact_requests FOR INSERT TO anon, authenticated
WITH CHECK (true);
GRANT INSERT ON public.partner_contact_requests TO anon, authenticated;

-- 5. closet_looks: add UPDATE policy
CREATE POLICY "Users can update own looks"
ON public.closet_looks FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Harden functions: set search_path and revoke public execute on internal queue functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
