import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { PartnersLayout } from "@/components/partners/PartnersLayout";
import "@/components/partners/partners.css";

export default function PartnersOnboarding() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState<{ signupId?: string; tier?: string; email?: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);

  const [form, setForm] = useState({
    business_name: "",
    logo_url: "",
    brand_color_primary: "#C9A84C",
    brand_color_secondary: "#0a0a0a",
    website: "",
    instagram: "",
    catalog_url: "",
    preferred_slug: "",
    notes: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke("verify-partner-session", {
          body: {
            sessionId,
            environment: getStripeEnvironment(),
            origin: window.location.origin,
          },
        });
        if (cancelled) return;
        if (error) throw error;
        const r = data as { paid?: boolean; signupId?: string; tier?: string; email?: string };
        if (r?.paid) {
          setVerified({ signupId: r.signupId, tier: r.tier, email: r.email });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Couldn't verify payment", description: "Please contact admin@glosseti.com.", variant: "destructive" });
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId]);

  const uploadFile = async (file: File, prefix: string): Promise<string | null> => {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("partner-assets").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) {
      console.error(error);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    return path;
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const path = await uploadFile(file, "logos");
    setUploadingLogo(false);
    if (path) setForm((f) => ({ ...f, logo_url: path }));
  };

  const handleCatalog = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatalog(true);
    const path = await uploadFile(file, "catalogs");
    setUploadingCatalog(false);
    if (path) setForm((f) => ({ ...f, catalog_url: path }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name) {
      toast({ title: "Business name is required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("partner-onboarding", {
        body: { ...form, signup_id: verified?.signupId },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Submission failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PartnersLayout>
      <Helmet>
        <title>Partner Onboarding — Glosseti</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="px-6 pt-16 pb-24 hero-glow">
        <div className="max-w-2xl mx-auto">
          {verifying ? (
            <div className="card p-12 text-center">
              <div className="w-12 h-12 mx-auto border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-[#a9a395]">Confirming your payment…</p>
            </div>
          ) : sessionId && !verified ? (
            <div className="card p-12 text-center">
              <h2 className="display text-3xl text-white mb-4">We couldn't verify your payment</h2>
              <p className="text-[#a9a395]">If you just completed checkout, please refresh this page in a moment. Otherwise email <a className="gold underline" href="mailto:admin@glosseti.com">admin@glosseti.com</a>.</p>
            </div>
          ) : submitted ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-6 gold text-3xl">✓</div>
              <h2 className="display text-3xl text-white mb-4">You're all set</h2>
              <p className="text-[#a9a395] leading-relaxed">
                We've received your onboarding details. Your branded partner page will be live within 24 hours, and we'll email you the moment it's ready.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="text-[10px] uppercase tracking-[0.35em] gold mb-4">Onboarding</div>
                <h1 className="display text-4xl md:text-5xl text-white">Let's build your partner page</h1>
                {verified?.tier && (
                  <p className="mt-4 text-sm text-[#a9a395]">
                    Plan confirmed: <span className="gold uppercase tracking-wider">{verified.tier}</span>
                  </p>
                )}
              </div>
              <form onSubmit={submit} className="card p-8 md:p-10 space-y-5">
                <div>
                  <label className="label">Business Name *</label>
                  <input className="field" required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Logo Upload</label>
                  <input type="file" accept="image/*" className="field" onChange={handleLogo} disabled={uploadingLogo} />
                  {uploadingLogo && <p className="text-xs text-[#888] mt-2">Uploading…</p>}
                  {form.logo_url && !uploadingLogo && <p className="text-xs gold mt-2">✓ Uploaded</p>}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="label">Primary Brand Color</label>
                    <div className="flex gap-2">
                      <input type="color" className="h-11 w-14 rounded-md border border-[#1f1f1f] bg-[#0e0e0e]" value={form.brand_color_primary} onChange={(e) => setForm({ ...form, brand_color_primary: e.target.value })} />
                      <input className="field" value={form.brand_color_primary} onChange={(e) => setForm({ ...form, brand_color_primary: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Secondary Brand Color</label>
                    <div className="flex gap-2">
                      <input type="color" className="h-11 w-14 rounded-md border border-[#1f1f1f] bg-[#0e0e0e]" value={form.brand_color_secondary} onChange={(e) => setForm({ ...form, brand_color_secondary: e.target.value })} />
                      <input className="field" value={form.brand_color_secondary} onChange={(e) => setForm({ ...form, brand_color_secondary: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">Website URL</label>
                  <input className="field" placeholder="https://" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div>
                  <label className="label">Instagram Handle</label>
                  <input className="field" placeholder="@yourhandle" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
                </div>
                <div>
                  <label className="label">Product Catalog URL</label>
                  <input className="field" placeholder="https://your-store.com/products" value={form.catalog_url} onChange={(e) => setForm({ ...form, catalog_url: e.target.value })} />
                  <p className="text-[11px] text-[#666] mt-2">…or upload a catalog file (CSV, PDF, XLSX)</p>
                  <input type="file" className="field mt-2" onChange={handleCatalog} disabled={uploadingCatalog} />
                  {uploadingCatalog && <p className="text-xs text-[#888] mt-2">Uploading…</p>}
                </div>
                <div>
                  <label className="label">Preferred Partner Link</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#666] whitespace-nowrap">glosseti.com/shop/</span>
                    <input className="field" placeholder="your-brand-name" value={form.preferred_slug} onChange={(e) => setForm({ ...form, preferred_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
                  </div>
                </div>
                <div>
                  <label className="label">Anything else?</label>
                  <textarea className="field min-h-[100px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <button type="submit" disabled={submitting} className="btn-gold w-full py-4 text-sm uppercase disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit Onboarding"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </PartnersLayout>
  );
}
