import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders } from "../_shared/cors.ts";
import {
  sendAdminApplicationNotice,
  sendApplicantConfirmation,
} from "../_shared/partnerEmails.ts";

const Schema = z.object({
  business_name: z.string().trim().min(1).max(200),
  contact_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  business_type: z.string().trim().min(1).max(60),
  instagram: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  origin: z.string().url().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: parsed.error.flatten().fieldErrors }, 400);
    }
    const d = parsed.data;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.from("partner_applications").insert({
      business_name: d.business_name,
      contact_name: d.contact_name,
      email: d.email,
      business_type: d.business_type,
      instagram: d.instagram || null,
      website: d.website || null,
      message: d.message || null,
    });
    if (error) throw error;

    const origin = d.origin || "https://glosseti.com";
    const pricingUrl = `${origin}/partners/pricing`;

    await Promise.all([
      sendApplicantConfirmation({
        to: d.email,
        contactName: d.contact_name,
        businessName: d.business_name,
        pricingUrl,
      }),
      sendAdminApplicationNotice({
        applicantEmail: d.email,
        contactName: d.contact_name,
        businessName: d.business_name,
        businessType: d.business_type,
        instagram: d.instagram || undefined,
        website: d.website || undefined,
        message: d.message || undefined,
      }),
    ]);

    return json({ success: true, pricingUrl });
  } catch (err) {
    console.error("[partner-apply]", err);
    return json({ error: err instanceof Error ? err.message : "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
