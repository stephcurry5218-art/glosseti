import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment, hasStripeConfigured } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { PartnersLayout } from "@/components/partners/PartnersLayout";
import "@/components/partners/partners.css";

type TierKey = "starter" | "pro" | "whitelabel";

const TIERS: Array<{
  key: TierKey;
  name: string;
  price: string;
  cadence: string;
  priceId?: "partner_starter_monthly" | "partner_pro_monthly";
  features: string[];
  cta: string;
  popular?: boolean;
}> = [
  {
    key: "starter",
    name: "Starter Partner",
    price: "$299",
    cadence: "/ month",
    priceId: "partner_starter_monthly",
    features: [
      "Branded partner link",
      "Your products featured in AI recommendations",
      "Direct shop integration",
      "Monthly performance report",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    key: "pro",
    name: "Pro Partner",
    price: "$499",
    cadence: "/ month",
    priceId: "partner_pro_monthly",
    popular: true,
    features: [
      "Everything in Starter",
      "Influencer style integration",
      "Priority placement in app",
      "Analytics dashboard",
      "Dedicated account manager",
    ],
    cta: "Get Started",
  },
  {
    key: "whitelabel",
    name: "White Label",
    price: "$2,999",
    cadence: "setup + $199 / month",
    features: [
      "Fully branded experience",
      "Custom domain",
      "Your logo throughout entire app",
      "Premium support",
      "Custom onboarding session",
    ],
    cta: "Contact Us",
  },
];

const POST_STEPS = [
  { n: "01", t: "Complete payment", d: "Takes about 2 minutes." },
  { n: "02", t: "Fill out onboarding", d: "Send us your branding and products." },
  { n: "03", t: "You're live in 24 hours", d: "We build, you launch." },
];

export default function PartnersPricing() {
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const stripeConfigured = hasStripeConfigured();

  const openCheckout = async (priceId: "partner_starter_monthly" | "partner_pro_monthly", key: TierKey) => {
    if (!stripeConfigured) {
      toast({ title: "Payments unavailable", description: "Please contact admin@glosseti.com to get set up.", variant: "destructive" });
      return;
    }
    setLoadingTier(key);
    try {
      const { data, error } = await supabase.functions.invoke("create-partner-checkout", {
        body: {
          priceId,
          origin: window.location.origin,
          environment: getStripeEnvironment(),
        },
      });
      if (error) throw error;
      const { clientSecret } = data as { clientSecret?: string };
      if (!clientSecret) throw new Error("Failed to start checkout");
      setCheckoutSecret(clientSecret);
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn't open checkout", description: "Please try again or email admin@glosseti.com.", variant: "destructive" });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <PartnersLayout>
      <Helmet>
        <title>Partner Pricing — Glosseti</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://glosseti.com/partners/pricing" />
      </Helmet>

      {/* HERO */}
      <section className="hero-glow">
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-block text-[10px] uppercase tracking-[0.35em] gold border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-7">
            Invitation Only
          </div>
          <h1 className="display text-[40px] md:text-[58px] leading-[1.05] text-white">
            Welcome to the Glosseti Partner Network
          </h1>
          <p className="mt-6 text-lg text-[#bdb6a6] max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your business.
          </p>
          <p className="mt-3 text-xs text-[#888] italic">
            You were invited to this page — these rates are exclusive to our partners.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.key}
              className={`card card-hover relative p-10 flex flex-col ${t.popular ? "border-[#C9A84C]/50 shadow-[0_30px_80px_-30px_rgba(201,168,76,0.35)]" : ""}`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-popular">Most Popular</span>
                </div>
              )}
              <h3 className="display text-2xl text-white mb-1">{t.name}</h3>
              <div className="mt-6 mb-2">
                <span className="text-5xl text-white display">{t.price}</span>
                <span className="text-sm text-[#888] ml-2">{t.cadence}</span>
              </div>
              <div className="gold-divider my-7" />
              <ul className="space-y-3 mb-10 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#cfcabb]">
                    <span className="gold mt-0.5">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {t.key === "whitelabel" ? (
                <button onClick={() => setContactOpen(true)} className="btn-ghost py-3.5 text-sm uppercase tracking-wider">
                  {t.cta}
                </button>
              ) : (
                <button
                  onClick={() => t.priceId && openCheckout(t.priceId, t.key)}
                  disabled={loadingTier === t.key}
                  className="btn-gold py-3.5 text-sm uppercase disabled:opacity-60"
                >
                  {loadingTier === t.key ? "Loading…" : t.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* POST SIGNUP STEPS */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] uppercase tracking-[0.35em] gold mb-4">After You Sign Up</div>
            <h2 className="display text-4xl text-white">What happens next</h2>
            <div className="gold-divider w-32 mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {POST_STEPS.map((s) => (
              <div key={s.n} className="card p-8 text-center">
                <div className="gold text-sm tracking-[0.3em] mb-4">{s.n}</div>
                <h3 className="text-xl text-white mb-2 display">{s.t}</h3>
                <p className="text-sm text-[#a9a395]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      {checkoutSecret && (
        <Modal onClose={() => setCheckoutSecret(null)}>
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{ fetchClientSecret: async () => checkoutSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Modal>
      )}

      {/* CONTACT MODAL */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </PartnersLayout>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C] hover:text-black transition-colors z-10"
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", business: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("partner-contact", {
        body: { ...form, tier_interest: "White Label" },
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn't send", description: "Please email admin@glosseti.com directly.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 partners-theme">
      <div className="card p-8 md:p-10 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#999] hover:text-white" aria-label="Close">✕</button>
        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center gold text-2xl mb-5">✓</div>
            <h3 className="display text-2xl text-white mb-3">Message sent</h3>
            <p className="text-[#a9a395]">We'll be in touch within one business day.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h3 className="display text-2xl text-white mb-1">White Label inquiry</h3>
            <p className="text-sm text-[#a9a395] mb-4">Tell us about your business and we'll set up a call.</p>
            <div>
              <label className="label">Name</label>
              <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Business</label>
              <input className="field" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="field min-h-[100px] resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button disabled={busy} className="btn-gold w-full py-3.5 text-sm uppercase disabled:opacity-60">
              {busy ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
