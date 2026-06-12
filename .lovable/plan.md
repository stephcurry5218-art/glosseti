# Glosseti Partners — Web-Only B2B System

Two new routes added to the existing React app, fully isolated from the iOS / IAP flow. Stripe (Lovable's built-in seamless Stripe) handles all payments. Dark + gold premium aesthetic, mobile responsive.

## Routes

- `/partners` — Public landing page (no pricing, apply form)
- `/partners/pricing` — Private pricing page (3 tiers + Stripe checkout) — unlinked, direct URL only, `noindex` meta
- `/partners/onboarding?session_id=...` — Post-payment onboarding form
- `/partners/success` — Stripe success redirect (forwards to onboarding)

All pages use a dedicated `PartnersLayout` (Glosseti logo top-left, Quanstein Labs footer), independent of the main app shell. `robots.txt` updated to disallow `/partners/pricing` and `/partners/onboarding`.

## Page 1 — `/partners` (Public)

Sections exactly as specified:
1. Hero — "Your Brand. Our Technology. Zero Hassle." + CTA scroll-to-apply
2. How It Works — 3 cards
3. Benefits — 6-card grid
4. Social Proof — 3 placeholder testimonials
5. FAQ — 5 Q&As (Accordion)
6. Apply Form — fields per spec, submits to `partner-apply` edge function
7. Footer — Quanstein Labs

Form validation via zod. On success: inline success state + email automation triggered server-side.

## Page 2 — `/partners/pricing` (Private)

Sections:
1. Hero — "Welcome to the Glosseti Partner Network" + invite-only note
2. Pricing — 3 cards:
   - Starter $299/mo → Stripe checkout
   - Pro $499/mo (MOST POPULAR badge) → Stripe checkout
   - White Label $2,999 setup + $199/mo → opens contact modal (no checkout)
3. "What happens after you sign up" — 3 steps
4. Footer

Checkout flow:
- Click "Get Started" → `create-partner-checkout` edge function creates Stripe Checkout Session (mode=subscription) with success_url=`/partners/onboarding?session_id={CHECKOUT_SESSION_ID}` and cancel_url back to pricing.
- White Label CTA opens a contact form modal that emails admin.

## Onboarding Form — `/partners/onboarding`

Verifies `session_id` via `verify-partner-session` edge function (calls Stripe to confirm `payment_status=paid`). Then renders form:
- Business name, logo upload (Supabase Storage `partner-assets` bucket), brand colors (2 hex inputs), website, Instagram, product catalog URL or file upload, preferred partner slug, notes.
- Submits to `partner-onboarding` edge function — stores in DB + emails admin & partner welcome.

## Backend

### Stripe
Use Lovable's seamless Stripe integration (`enable_stripe_payments`). Two recurring products created via `batch_create_product` after enable:
- `partner_starter_monthly` — $299/mo
- `partner_pro_monthly` — $499/mo

### Database tables (new migration)
- `partner_applications` — id, business_name, contact_name, email, business_type, instagram, website, message, created_at
- `partner_signups` — id, stripe_customer_id, stripe_subscription_id, tier, email, status, created_at
- `partner_onboarding` — id, signup_id, business_name, logo_url, brand_color_primary, brand_color_secondary, website, instagram, catalog_url, preferred_slug, notes, created_at
- `partner_contact_requests` (for White Label) — id, name, email, business, message, created_at

All `public` schema tables: GRANT to `service_role` only (no anon/authenticated reads — these are admin-only); edge functions write with service role. RLS enabled with admin-only read policies via existing `is_admin()` function.

Storage bucket: `partner-assets` (public read for logos).

### Edge Functions
- `partner-apply` — validates input, inserts into `partner_applications`, sends 2 emails (admin notification + applicant confirmation with private pricing link)
- `create-partner-checkout` — creates Stripe subscription Checkout Session
- `verify-partner-session` — retrieves Stripe session, confirms paid, returns signup record (creates `partner_signups` row if first call)
- `partner-onboarding` — stores onboarding details + sends welcome/admin emails
- `partner-contact` — White Label contact form handler

### Emails
Use existing Lovable Emails infrastructure (`send-transactional-email`). New React Email templates in `_shared/transactional-email-templates/`:
- `partner-application-received.tsx` (to applicant)
- `partner-application-admin.tsx` (to admin)
- `partner-welcome.tsx` (to new paid partner)
- `partner-signup-admin.tsx` (to admin)
- `partner-contact-admin.tsx` (White Label inquiry)

Admin email: `admin@glosseti.com`. Registry updated.

## Design tokens

Partners pages use scoped CSS (`.partners-theme`) with `--partners-bg: #0a0a0a`, `--partners-gold: #C9A84C`, serif display headings (e.g. Playfair Display) + clean sans body, framer-motion scroll-reveals on sections.

## Out of scope (explicit)
- No iOS / IAP code touched.
- No links from existing site to `/partners` or `/partners/pricing`.
- White Label is contact-only (no Stripe).

## Build order
1. `enable_stripe_payments` (requires user confirmation in dialog) → create 2 recurring products.
2. Migration: tables + storage bucket + grants/RLS.
3. Edge functions + email templates + registry + deploy.
4. Frontend routes, layout, sections, forms.
5. `robots.txt` disallow rules + `noindex` meta on private pages.

Confirm to proceed and I'll start with enabling Stripe.
