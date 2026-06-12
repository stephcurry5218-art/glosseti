import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders } from "../_shared/cors.ts";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const Schema = z.object({
  priceId: z.enum(["partner_starter_monthly", "partner_pro_monthly"]),
  email: z.string().trim().email().max(255).optional(),
  origin: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: parsed.error.flatten().fieldErrors }, 400);
    }
    const { priceId, email, origin, environment } = parsed.data;

    const stripe = createStripeClient(environment as StripeEnv);
    const prices = await stripe.prices.list({ lookup_keys: [priceId], limit: 1 });
    if (!prices.data.length) throw new Error("Price not found");
    const price = prices.data[0];

    const tier = priceId === "partner_starter_monthly" ? "starter" : "pro";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: `${origin}/partners/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [{ price: price.id, quantity: 1 }],
      ...(email && { customer_email: email }),
      subscription_data: { metadata: { tier, source: "partners_pricing" } },
      metadata: { tier, source: "partners_pricing" },
    });

    return json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("[create-partner-checkout]", err);
    return json({ error: err instanceof Error ? err.message : "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
