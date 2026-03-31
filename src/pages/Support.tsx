import { useState } from "react";
import { ArrowLeft, Mail, MessageCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const faqs = [
  { q: "How does Glosseti work?", a: "Upload a photo of yourself, choose a style direction, and our AI analyzes your features to generate a complete, personalized style guide — from head to toe, with three price points for every piece." },
  { q: "Is my photo stored or shared?", a: "Your privacy is our priority. Photos are processed securely and are not stored on our servers after your style is generated. We never share your images with third parties." },
  { q: "What styles can I choose from?", a: "Glosseti offers a wide range of styles including casual, business, streetwear, evening, minimalist, and more — each tailored to your body type and features." },
  { q: "How do I cancel my subscription?", a: "You can manage or cancel your subscription anytime through your device's App Store settings (Settings → Apple ID → Subscriptions on iOS)." },
  { q: "The app isn't loading or crashes", a: "Try closing and reopening the app. If the issue persists, ensure you have the latest version installed and a stable internet connection. Contact us if the problem continues." },
  { q: "Can I get a refund?", a: "Refunds are handled through Apple's App Store policies. You can request a refund through Apple's support page or your purchase history." },
];

const Support = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to an edge function or email service
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(18 20% 5%) 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate("/")} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Jost', sans-serif" }}>Support</h1>
      </div>

      <div className="px-5 pb-20 max-w-lg mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "hsla(var(--glamora-gold) / 0.15)" }}>
            <MessageCircle size={28} style={{ color: "hsl(var(--glamora-gold))" }} />
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            How can we help?
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--glamora-gray))", lineHeight: 1.6 }}>
            Browse our FAQ or send us a message below.
          </p>
        </div>

        {/* Quick Contact */}
        <a
          href="mailto:support@glosseti.com"
          className="flex items-center gap-3 p-4 rounded-2xl mb-6 transition-all hover:scale-[1.01]"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsla(var(--glamora-rose) / 0.12)" }}>
            <Mail size={18} style={{ color: "hsl(var(--glamora-rose-dark))" }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">Email Us</div>
            <div className="text-xs" style={{ color: "hsl(var(--glamora-gray))" }}>support@glosseti.com</div>
          </div>
          <ExternalLink size={16} style={{ color: "hsl(var(--glamora-gray-light))" }} />
        </a>

        {/* FAQ */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(var(--glamora-gold))", letterSpacing: 3 }}>
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="text-left rounded-2xl p-4 transition-all"
                style={{ background: "hsl(var(--card))", border: openFaq === i ? "1px solid hsl(var(--glamora-gold) / 0.3)" : "1px solid hsl(var(--border))" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} style={{ color: "hsl(var(--glamora-gold))" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--glamora-gray-light))" }} />}
                </div>
                {openFaq === i && (
                  <p className="text-xs mt-3 leading-relaxed" style={{ color: "hsl(var(--glamora-gray))" }}>
                    {faq.a}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(var(--glamora-gold))", letterSpacing: 3 }}>
            Send a Message
          </h3>
          {sent ? (
            <div className="text-center p-8 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <div className="text-2xl mb-2">✓</div>
              <p className="text-sm font-medium text-foreground">Message sent!</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--glamora-gray))" }}>We'll get back to you within 24–48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <textarea
                required
                rows={4}
                placeholder="How can we help?"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-rose-dark)))",
                  color: "white",
                }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-10" style={{ color: "hsl(var(--glamora-gray-light))" }}>
          © {new Date().getFullYear()} Glosseti. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Support;
