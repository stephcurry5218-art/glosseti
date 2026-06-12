import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders } from "../_shared/cors.ts";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import {
  sendAdminSignupNotice,
  sendPartnerWelcome,
} from "../_shared/partnerEmails.ts";

const Schema = z.object({
  sessionId: z.string().min(8).max(200),
  environment: z.enum(["sandbox", "live"]),
  origin: z.string().url(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { sessionId, environment, origin } = parsed.data;

    const stripe = createStripeClient(environment as StripeEnv);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return json({ paid: false, status: session.status });
    }

    const tier = (session.metadata?.tier as string) || "starter";
    const email = session.customer_details?.email || (session.customer_email as string) || "";
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id || null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id || null;
    const amount = tier === "pro" ? 49900 : 29900;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Upsert signup row; trigger emails only on first insert.
    const existing = await supabase
      .from("partner_signups")
      .select("id, status")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    let signupId: string;
    if (existing.data) {
      signupId = existing.data.id;
    } else {
      const insert = await supabase
        .from("partner_signups")
        .insert({
          stripe_session_id: session.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          tier,
          email,
          status: "active",
        })
        .select("id")
        .single();
      if (insert.error) throw insert.error;
      signupId = insert.data.id;

      // Fire emails for the first verification only.
      await Promise.all([
        sendPartnerWelcome({
          to: email,
          tier: tier === "pro" ? "Pro Partner" : "Starter Partner",
          onboardingUrl: `${origin}/partners/onboarding?session_id=${encodeURIComponent(session.id)}`,
        }),
        sendAdminSignupNotice({ email, tier, amount }),
      ]);
    }

    return json({ paid: true, signupId, tier, email });
  } catch (err) {
    console.error("[verify-partner-session]", err);
    return json({ error: err instanceof Error ? err.message : "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
