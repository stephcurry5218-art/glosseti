// Helpers to send partner-related notification emails via the Lovable Emails queue.
// Uses raw HTML enqueued directly (skips React Email templates to keep things simple).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ADMIN_EMAIL = "admin@glosseti.com";
const SITE_NAME = "Glosseti Partners";
const SENDER_DOMAIN = "notify.glosseti.com";
const FROM = `${SITE_NAME} <noreply@notify.glosseti.com>`;

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function enqueue(opts: {
  to: string;
  subject: string;
  html: string;
  label: string;
}) {
  const supabase = admin();
  const messageId = crypto.randomUUID();
  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: opts.label,
    recipient_email: opts.to,
    status: "pending",
  });
  const { error } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: opts.to,
      from: FROM,
      sender_domain: SENDER_DOMAIN,
      subject: opts.subject,
      html: opts.html,
      text: opts.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      purpose: "transactional",
      label: opts.label,
      queued_at: new Date().toISOString(),
    },
  });
  if (error) {
    console.error("[partner-email] enqueue failed", error);
  }
}

const wrap = (inner: string) => `<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#e8e2d4">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111;border:1px solid #1f1f1f;border-radius:14px;padding:36px">
<tr><td>
<div style="font-family:Georgia,serif;font-size:24px;letter-spacing:2px;color:#C9A84C;margin-bottom:24px">GLOSSETI</div>
${inner}
<hr style="border:none;border-top:1px solid #222;margin:32px 0"/>
<div style="font-size:11px;color:#666">Quanstein Labs — Glosseti Partner Program</div>
</td></tr></table>
</td></tr></table></body></html>`;

export async function sendApplicantConfirmation(opts: {
  to: string;
  contactName: string;
  businessName: string;
  pricingUrl: string;
}) {
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#fff;margin:0 0 16px">Thanks for applying, ${escape(opts.contactName)}.</h1>
    <p style="line-height:1.6;color:#cfcabb">We received your Glosseti Partner application for <strong style="color:#fff">${escape(opts.businessName)}</strong> and we're excited to connect.</p>
    <p style="line-height:1.6;color:#cfcabb">As a next step, here's your private pricing page — these rates are exclusive to invited partners:</p>
    <p style="margin:28px 0"><a href="${opts.pricingUrl}" style="display:inline-block;background:#C9A84C;color:#0a0a0a;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:8px;letter-spacing:0.5px">View Partner Pricing</a></p>
    <p style="line-height:1.6;color:#cfcabb">Once you sign up, your branded partner page goes live within 24 hours. Reply to this email if you have any questions in the meantime.</p>
    <p style="line-height:1.6;color:#cfcabb">— The Glosseti Partner Team</p>
  `);
  await enqueue({ to: opts.to, subject: "Welcome to the Glosseti Partner Network", html, label: "partner_application_received" });
}

export async function sendAdminApplicationNotice(opts: {
  applicantEmail: string;
  contactName: string;
  businessName: string;
  businessType: string;
  instagram?: string;
  website?: string;
  message?: string;
}) {
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;font-size:22px;color:#fff;margin:0 0 16px">New Partner Application</h1>
    <table cellpadding="6" style="font-size:14px;color:#cfcabb">
      <tr><td>Business:</td><td style="color:#fff">${escape(opts.businessName)}</td></tr>
      <tr><td>Contact:</td><td style="color:#fff">${escape(opts.contactName)}</td></tr>
      <tr><td>Email:</td><td style="color:#fff">${escape(opts.applicantEmail)}</td></tr>
      <tr><td>Type:</td><td style="color:#fff">${escape(opts.businessType)}</td></tr>
      <tr><td>Instagram:</td><td style="color:#fff">${escape(opts.instagram || "—")}</td></tr>
      <tr><td>Website:</td><td style="color:#fff">${escape(opts.website || "—")}</td></tr>
    </table>
    <p style="line-height:1.6;color:#cfcabb;margin-top:20px"><strong>Message:</strong><br/>${escape(opts.message || "—").replace(/\n/g, "<br/>")}</p>
  `);
  await enqueue({ to: ADMIN_EMAIL, subject: `New Partner Application — ${opts.businessName}`, html, label: "partner_application_admin" });
}

export async function sendPartnerWelcome(opts: {
  to: string;
  tier: string;
  onboardingUrl: string;
}) {
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#fff;margin:0 0 16px">Welcome to the Network.</h1>
    <p style="line-height:1.6;color:#cfcabb">Your payment for the <strong style="color:#C9A84C">${escape(opts.tier)}</strong> plan is confirmed. Here's what's next:</p>
    <ol style="line-height:1.8;color:#cfcabb;padding-left:20px">
      <li>Complete your onboarding form (logo, brand colors, products)</li>
      <li>We build your branded partner page</li>
      <li>You go live within 24 hours</li>
    </ol>
    <p style="margin:28px 0"><a href="${opts.onboardingUrl}" style="display:inline-block;background:#C9A84C;color:#0a0a0a;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:8px;letter-spacing:0.5px">Complete Onboarding</a></p>
    <p style="line-height:1.6;color:#cfcabb">Questions? Reply to this email or reach us at <a style="color:#C9A84C" href="mailto:admin@glosseti.com">admin@glosseti.com</a>.</p>
  `);
  await enqueue({ to: opts.to, subject: "Welcome to the Glosseti Partner Network", html, label: "partner_welcome" });
}

export async function sendAdminSignupNotice(opts: {
  email: string;
  tier: string;
  amount: number;
}) {
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;font-size:22px;color:#fff;margin:0 0 16px">New Partner Signup</h1>
    <table cellpadding="6" style="font-size:14px;color:#cfcabb">
      <tr><td>Email:</td><td style="color:#fff">${escape(opts.email)}</td></tr>
      <tr><td>Tier:</td><td style="color:#fff">${escape(opts.tier)}</td></tr>
      <tr><td>Amount:</td><td style="color:#fff">$${(opts.amount / 100).toFixed(2)}/mo</td></tr>
    </table>
  `);
  await enqueue({ to: ADMIN_EMAIL, subject: `New Partner Signup — ${opts.tier}`, html, label: "partner_signup_admin" });
}

export async function sendAdminContactNotice(opts: {
  name: string;
  email: string;
  business?: string;
  message?: string;
  tier?: string;
}) {
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;font-size:22px;color:#fff;margin:0 0 16px">White Label Inquiry</h1>
    <table cellpadding="6" style="font-size:14px;color:#cfcabb">
      <tr><td>Name:</td><td style="color:#fff">${escape(opts.name)}</td></tr>
      <tr><td>Email:</td><td style="color:#fff">${escape(opts.email)}</td></tr>
      <tr><td>Business:</td><td style="color:#fff">${escape(opts.business || "—")}</td></tr>
      <tr><td>Interest:</td><td style="color:#fff">${escape(opts.tier || "White Label")}</td></tr>
    </table>
    <p style="line-height:1.6;color:#cfcabb;margin-top:20px"><strong>Message:</strong><br/>${escape(opts.message || "—").replace(/\n/g, "<br/>")}</p>
  `);
  await enqueue({ to: ADMIN_EMAIL, subject: `Partner Contact — ${opts.name}`, html, label: "partner_contact_admin" });
}

export async function sendAdminOnboardingNotice(opts: {
  businessName: string;
  email?: string;
  preferredSlug?: string;
}) {
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;font-size:22px;color:#fff;margin:0 0 16px">Partner Onboarding Submitted</h1>
    <table cellpadding="6" style="font-size:14px;color:#cfcabb">
      <tr><td>Business:</td><td style="color:#fff">${escape(opts.businessName)}</td></tr>
      <tr><td>Email:</td><td style="color:#fff">${escape(opts.email || "—")}</td></tr>
      <tr><td>Preferred slug:</td><td style="color:#fff">${escape(opts.preferredSlug || "—")}</td></tr>
    </table>
    <p style="line-height:1.6;color:#cfcabb;margin-top:20px">Full details are in the partner_onboarding table.</p>
  `);
  await enqueue({ to: ADMIN_EMAIL, subject: `Onboarding Submitted — ${opts.businessName}`, html, label: "partner_onboarding_admin" });
}

function escape(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
