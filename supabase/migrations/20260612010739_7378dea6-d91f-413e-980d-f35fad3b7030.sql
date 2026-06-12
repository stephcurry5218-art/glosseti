
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_type TEXT NOT NULL,
  instagram TEXT,
  website TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_applications TO service_role;
GRANT SELECT ON public.partner_applications TO authenticated;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view applications" ON public.partner_applications
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.partner_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_session_id TEXT UNIQUE,
  tier TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_signups TO service_role;
GRANT SELECT ON public.partner_signups TO authenticated;
ALTER TABLE public.partner_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view signups" ON public.partner_signups
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.partner_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signup_id UUID REFERENCES public.partner_signups(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  logo_url TEXT,
  brand_color_primary TEXT,
  brand_color_secondary TEXT,
  website TEXT,
  instagram TEXT,
  catalog_url TEXT,
  preferred_slug TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_onboarding TO service_role;
GRANT SELECT ON public.partner_onboarding TO authenticated;
ALTER TABLE public.partner_onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view onboarding" ON public.partner_onboarding
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.partner_contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business TEXT,
  message TEXT,
  tier_interest TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_contact_requests TO service_role;
GRANT SELECT ON public.partner_contact_requests TO authenticated;
ALTER TABLE public.partner_contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view contact requests" ON public.partner_contact_requests
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Storage policies for partner-assets bucket
CREATE POLICY "Anyone can upload to partner-assets" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'partner-assets');
CREATE POLICY "Admins read partner-assets" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'partner-assets' AND public.is_admin(auth.uid()));
