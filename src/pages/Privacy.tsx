import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "1. Information We Collect",
    content: `When you use Glosseti, we may collect the following types of information:

• **Photos & Images**: Photos you upload are processed by our AI to generate personalized style recommendations. Images are processed in real-time and are not permanently stored on our servers after your session ends.

• **Account Information**: If you create an account, we collect your email address and display name.

• **Usage Data**: We collect anonymous usage analytics such as which features you use, session duration, and general interaction patterns to improve the app experience.

• **Device Information**: We may collect device type, operating system version, and app version for troubleshooting and compatibility purposes.

• **Purchase Information**: Subscription and in-app purchase records are managed by Apple and are subject to Apple's privacy practices.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to:

• Generate personalized AI-powered style recommendations
• Maintain and improve the Glosseti app and services
• Process your account registration and manage your subscription
• Respond to your support requests and feedback
• Send important service-related communications
• Analyze usage trends to enhance user experience

We do **not** sell, rent, or trade your personal information to third parties for marketing purposes.`,
  },
  {
    title: "3. Data Storage & Security",
    content: `• Uploaded photos are processed securely using encrypted connections (TLS/SSL) and are not retained after style generation is complete.
• Account data is stored securely using industry-standard encryption and access controls.
• We use Lovable Cloud infrastructure with enterprise-grade security measures to protect your data.
• We regularly review and update our security practices to safeguard your information.`,
  },
  {
    title: "4. Third-Party Services",
    content: `Glosseti may use the following third-party services:

• **AI Processing**: We use AI models to analyze photos and generate style recommendations. Photos are transmitted securely and are not stored by our AI providers beyond the processing session.
• **Analytics**: We may use anonymous analytics tools to understand app usage patterns. No personally identifiable information is shared with analytics providers.
• **Payment Processing**: All payments and subscriptions are processed through Apple's App Store. We do not directly handle or store your payment information.
• **Affiliate Links**: Shopping links within the app may direct you to third-party retailers. These retailers have their own privacy policies, which we encourage you to review.`,
  },
  {
    title: "5. Your Rights & Choices",
    content: `You have the following rights regarding your personal data:

• **Access & Portability**: You may request a copy of the personal data we hold about you.
• **Deletion**: You may request deletion of your account and all associated personal data by contacting us at support@glosseti.com.
• **Opt-Out**: You can opt out of analytics tracking through your device settings.
• **Correction**: You may update or correct your account information at any time within the app.
• **Withdraw Consent**: You may withdraw consent for data processing at any time, though this may limit your ability to use certain features.

For users in the European Economic Area (EEA), you have additional rights under GDPR, including the right to lodge a complaint with a supervisory authority.

For California residents, you have rights under the CCPA, including the right to know what personal information is collected and the right to request deletion.`,
  },
  {
    title: "6. Children's Privacy",
    content: `Glosseti is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal data from a child under 13, we will take steps to delete such information promptly. If you believe a child under 13 has provided us with personal information, please contact us at support@glosseti.com.`,
  },
  {
    title: "7. Data Retention",
    content: `• **Photos**: Deleted immediately after style generation is complete; not stored on our servers.
• **Account Data**: Retained for as long as your account is active. Upon account deletion request, all data is removed within 30 days.
• **Usage Analytics**: Anonymous analytics data may be retained for up to 24 months to improve our services.
• **Support Communications**: Retained for up to 12 months after resolution to ensure quality of service.`,
  },
  {
    title: "8. International Data Transfers",
    content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable data protection laws.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you through the app or via email. Your continued use of Glosseti after changes are posted constitutes your acceptance of the updated policy. We encourage you to review this policy periodically.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:

• **Email**: support@glosseti.com
• **Support Page**: https://glosseti.lovable.app/support

We aim to respond to all inquiries within 48 hours.`,
  },
];

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(18 20% 5%) 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button
          onClick={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate("/");
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <ArrowLeft size={18} style={{ color: "hsl(var(--foreground))" }} />
        </button>
        <h1
          className="text-lg font-semibold tracking-wide"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "hsl(var(--foreground))",
          }}
        >
          Privacy Policy
        </h1>
      </div>

      <div className="px-5 pb-12 space-y-6">
        {/* Intro */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="text-xl font-bold mb-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "hsl(var(--foreground))",
            }}
          >
            Glosseti
          </h2>
          <p
            className="text-xs mb-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            AI-Powered Style Studio
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "hsl(var(--foreground))", opacity: 0.85 }}
          >
            Your privacy is important to us. This Privacy Policy explains how
            Glosseti ("we", "our", or "us") collects, uses, stores, and
            protects your personal information when you use our mobile
            application and related services.
          </p>
          <p
            className="text-xs mt-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Effective Date: April 5, 2026 &nbsp;|&nbsp; Last Updated: April 5,
            2026
          </p>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} className="space-y-2">
            <h3
              className="text-sm font-semibold tracking-wide"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "hsl(var(--accent))",
              }}
            >
              {s.title}
            </h3>
            <div
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: "hsl(var(--foreground))", opacity: 0.8 }}
              dangerouslySetInnerHTML={{
                __html: s.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
