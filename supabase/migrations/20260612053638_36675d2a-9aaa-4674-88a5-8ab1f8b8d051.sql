
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.partner_applications;
CREATE POLICY "Anyone can submit applications"
ON public.partner_applications FOR INSERT TO anon, authenticated
WITH CHECK (
  length(business_name) BETWEEN 1 AND 200
  AND length(contact_name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(business_type) BETWEEN 1 AND 100
  AND (instagram IS NULL OR length(instagram) <= 200)
  AND (website IS NULL OR length(website) <= 500)
  AND (message IS NULL OR length(message) <= 5000)
);

DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.partner_contact_requests;
CREATE POLICY "Anyone can submit contact requests"
ON public.partner_contact_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (business IS NULL OR length(business) <= 200)
  AND (message IS NULL OR length(message) <= 5000)
  AND (tier_interest IS NULL OR length(tier_interest) <= 50)
);
