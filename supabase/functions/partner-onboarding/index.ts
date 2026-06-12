import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders } from "../_shared/cors.ts";
import { sendAdminOnboardingNotice } from "../_shared/partnerEmails.ts";

const Schema = z.object({
  signup_id: z.string().uuid().optional(),
  business_name: z.string().trim().min(1).max(200),
  logo_url: z.string().trim().max(500).optional().or(z.literal("")),
  brand_color_primary: z.string().trim().max(20).optional().or(z.literal("")),
  brand_color_secondary: z.string().trim().max(20).optional().or(z.literal("")),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  instagram: z.string().trim().max(120).optional().or(z.literal("")),
  catalog_url: z.string().trim().max(500).optional().or(z.literal("")),
  preferred_slug: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const d = parsed.data;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let email: string | undefined;
    if (d.signup_id) {
      const { data } = await supabase
        .from("partner_signups")
        .select("email")
        .eq("id", d.signup_id)
        .maybeSingle();
      email = data?.email || undefined;
    }

    const { error } = await supabase.from("partner_onboarding").insert({
      signup_id: d.signup_id || null,
      business_name: d.business_name,
      logo_url: d.logo_url || null,
      brand_color_primary: d.brand_color_primary || null,
      brand_color_secondary: d.brand_color_secondary || null,
      website: d.website || null,
      instagram: d.instagram || null,
      catalog_url: d.catalog_url || null,
      preferred_slug: d.preferred_slug || null,
      notes: d.notes || null,
    });
    if (error) throw error;

    await sendAdminOnboardingNotice({
      businessName: d.business_name,
      email,
      preferredSlug: d.preferred_slug || undefined,
    });

    return json({ success: true });
  } catch (err) {
    console.error("[partner-onboarding]", err);
    return json({ error: err instanceof Error ? err.message : "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
