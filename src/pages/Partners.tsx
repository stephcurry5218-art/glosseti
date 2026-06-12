import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PartnersLayout } from "@/components/partners/PartnersLayout";
import { useReveal } from "@/components/partners/useReveal";
import "@/components/partners/partners.css";

const BENEFITS = [
  { t: "No coding required", d: "We handle all the technical work end to end." },
  { t: "Live today, not in 6 months", d: "Your partner page is ready within 24 hours." },
  { t: "Your branding throughout", d: "Logo, palette and tone — entirely yours." },
  { t: "Customers shop your store", d: "Every product link routes directly to your inventory." },
  { t: "Monthly analytics report", d: "Clicks, conversions and revenue, delivered to your inbox." },
  { t: "We maintain everything", d: "Updates, improvements and uptime — all handled." },
];

const STEPS = [
  { n: "01", t: "We brand it as yours", d: "Your logo, your colors, your custom link." },
  { n: "02", t: "Your customers use it", d: "They get styled by AI, discover products, shop your store." },
  { n: "03", t: "You grow", d: "Every click tracked, every sale attributed to you." },
];

const TESTIMONIALS = [
  { name: "Amara L.", role: "Boutique Owner, Atelier Nine", q: "Glosseti turned my Instagram followers into actual buyers. Sales doubled in the first month." },
  { name: "Marcus D.", role: "Founder, Edge Menswear", q: "It feels like we built a whole AI styling platform — but we didn't. They did everything." },
  { name: "Sienna K.", role: "Stylist, House of Sienna", q: "My clients get to play stylist 24/7. It's the most useful tool I've added to my business in years." },
];

const FAQ = [
  { q: "Do I need technical experience?", a: "None at all. We handle everything technical." },
  { q: "How long does setup take?", a: "Your branded partner page is live within 24 hours." },
  { q: "Can my customers shop directly from my store?", a: "Yes. Every recommendation links directly to your products." },
  { q: "Is there a contract?", a: "No. Month to month, cancel anytime." },
  { q: "What makes this different from just having a website?", a: "You get AI powered styling technology that would cost $50,000+ to build — for a simple monthly fee." },
];

const BUSINESS_TYPES = ["Boutique", "Salon", "Retail Store", "Fashion Influencer", "Other"];

export default function Partners() {
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    business_type: "Boutique",
    instagram: "",
    website: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name || !form.contact_name || !form.email) {
      toast({ title: "Please fill in the required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("partner-apply", {
        body: { ...form, origin: window.location.origin },
      });
      if (error) throw error;
      if ((data as { error?: unknown })?.error) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Something went wrong", description: "Please try again or email admin@glosseti.com.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PartnersLayout>
      <Helmet>
        <title>Glosseti for Partners — Your Brand. Our Technology. Zero Hassle.</title>
        <meta name="description" content="Give your customers an AI styling experience branded entirely as your own — live within 24 hours, no coding required." />
        <link rel="canonical" href="https://glosseti.com/partners" />
        <meta property="og:title" content="Glosseti for Partners" />
        <meta property="og:description" content="Branded AI styling for boutiques, salons, retailers and fashion creators." />
        <meta property="og:url" content="https://glosseti.com/partners" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
          <div className="inline-block text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-8">
            Glosseti Partner Program
          </div>
          <h1 className="display text-[44px] md:text-[68px] leading-[1.05] text-white">
            Your Brand. <span className="gold">Our Technology.</span><br />Zero Hassle.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-[#bdb6a6] max-w-2xl mx-auto leading-relaxed">
            Give your customers an AI styling experience branded entirely as your own — live today, no coding required.
          </p>
          <a href="#apply" className="btn-gold inline-block mt-10 px-10 py-4 text-sm uppercase">
            Apply to Become a Partner
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <Section title="How it works" eyebrow="The Process">
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <RevealCard key={s.n}>
              <div className="card card-hover p-8 h-full">
                <div className="gold text-sm tracking-[0.3em] mb-6">{s.n}</div>
                <h3 className="text-2xl text-white mb-3">{s.t}</h3>
                <p className="text-[#a9a395] leading-relaxed">{s.d}</p>
              </div>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* BENEFITS */}
      <Section title="Why partners choose us" eyebrow="Benefits">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <RevealCard key={b.t}>
              <div className="card card-hover p-7 h-full">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-5">
                  <span className="gold text-lg">✦</span>
                </div>
                <h3 className="text-lg text-white mb-2 font-medium" style={{ fontFamily: "'Jost', sans-serif" }}>{b.t}</h3>
                <p className="text-sm text-[#9c9686] leading-relaxed">{b.d}</p>
              </div>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* SOCIAL PROOF */}
      <Section title="What partners say" eyebrow="Trusted by">
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <RevealCard key={t.name}>
              <div className="card p-8 h-full flex flex-col">
                <div className="gold text-3xl leading-none mb-4">"</div>
                <p className="text-[#cfcabb] leading-relaxed mb-6 flex-1 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t.q}
                </p>
                <div>
                  <div className="text-white font-medium">{t.name}</div>
                  <div className="text-xs text-[#8a8474] mt-1 tracking-wide">{t.role}</div>
                </div>
              </div>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked" eyebrow="Questions">
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ.map((f, i) => (
            <details key={i} className="card group p-6 cursor-pointer">
              <summary className="flex items-center justify-between list-none">
                <span className="text-white text-lg pr-4" style={{ fontFamily: "'Playfair Display', serif" }}>{f.q}</span>
                <span className="gold text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#a9a395] mt-4 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* APPLY */}
      <section id="apply" className="py-24 px-6 hero-glow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] uppercase tracking-[0.35em] gold mb-4">Apply</div>
            <h2 className="display text-4xl md:text-5xl text-white mb-4">Ready to partner with Glosseti?</h2>
            <p className="text-[#a9a395]">Tell us about your business. We review every application personally.</p>
          </div>
          {submitted ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-6 gold text-3xl">✓</div>
              <h3 className="display text-3xl text-white mb-4">Application received</h3>
              <p className="text-[#a9a395] leading-relaxed mb-2">
                Thank you. We've sent a confirmation to your inbox with a link to your private partner pricing.
              </p>
              <p className="text-sm text-[#777]">Be sure to check your spam folder if you don't see it shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Business Name *</label>
                  <input className="field" required value={form.business_name} onChange={update("business_name")} />
                </div>
                <div>
                  <label className="label">Your Name *</label>
                  <input className="field" required value={form.contact_name} onChange={update("contact_name")} />
                </div>
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" className="field" required value={form.email} onChange={update("email")} />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Business Type *</label>
                  <select className="field" value={form.business_type} onChange={update("business_type")}>
                    {BUSINESS_TYPES.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Instagram Handle</label>
                  <input className="field" placeholder="@yourhandle" value={form.instagram} onChange={update("instagram")} />
                </div>
              </div>
              <div>
                <label className="label">Website URL</label>
                <input className="field" placeholder="https://" value={form.website} onChange={update("website")} />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="field min-h-[120px] resize-y" value={form.message} onChange={update("message")} placeholder="Tell us a little about your business and what you're hoping to achieve." />
              </div>
              <button type="submit" disabled={submitting} className="btn-gold w-full py-4 text-sm uppercase disabled:opacity-60">
                {submitting ? "Submitting…" : "Apply Now"}
              </button>
              <p className="text-xs text-[#666] text-center">By applying you agree to our terms. We'll only contact you about your application.</p>
            </form>
          )}
        </div>
      </section>
    </PartnersLayout>
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="reveal text-center mb-14">
          <div className="text-[10px] uppercase tracking-[0.35em] gold mb-4">{eyebrow}</div>
          <h2 className="display text-4xl md:text-5xl text-white">{title}</h2>
          <div className="gold-divider w-32 mx-auto mt-6" />
        </div>
        {children}
      </div>
    </section>
  );
}

function RevealCard({ children }: { children: React.ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className="reveal">{children}</div>;
}
