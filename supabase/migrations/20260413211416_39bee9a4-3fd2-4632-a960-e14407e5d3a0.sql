-- Allow admin to read all suggestions (using a security definer function)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _user_id
    AND email = 'admin@glosseti.com'
  );
$$;

-- Admin can read all suggestions
CREATE POLICY "Admin can view all suggestions" ON public.app_suggestions
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
