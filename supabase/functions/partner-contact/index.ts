import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders } from "../_shared/cors.ts";
import { sendAdminContactNotice } from "../_shared/partnerEmails.ts";

const Schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  business: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  tier_interest: z.string().trim().max(60).optional().or(z.literal("")),
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
    const { error } = await supabase.from("partner_contact_requests").insert({
      name: d.name,
      email: d.email,
      business: d.business || null,
      message: d.message || null,
      tier_interest: d.tier_interest || null,
    });
    if (error) throw error;
    await sendAdminContactNotice({
      name: d.name,
      email: d.email,
      business: d.business || undefined,
      message: d.message || undefined,
      tier: d.tier_interest || "White Label",
    });
    return json({ success: true });
  } catch (err) {
    console.error("[partner-contact]", err);
    return json({ error: err instanceof Error ? err.message : "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
