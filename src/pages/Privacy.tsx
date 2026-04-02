import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(18 20% 5%) 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate("/")} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--foreground))" }} />
        </button>
        <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>Privacy Policy</h1>
      </div>

      <div className="px-5 pb-12 space-y-6">
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Last updated: April 2, 2026</p>

        {[
          {
            title: "Introduction",
            body: "Glosseti (\u201Cwe\u201D, \u201Cour\u201D, or \u201Cus\u201D) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the Glosseti mobile application."
          },
          {
            title: "Information We Collect",
            body: "We may collect the following types of information:\n\n• Photos you upload for style analysis (processed in real-time and not permanently stored on our servers)\n• Account information (email address, display name) if you create an account\n• Style preferences and saved looks\n• Usage data and analytics to improve the app experience\n• Device information (device type, operating system version)"
          },
          {
            title: "How We Use Your Information",
            body: "We use the information we collect to:\n\n• Provide personalized style recommendations\n• Process and analyze your uploaded photos for AI styling\n• Improve and optimize our services\n• Communicate with you about your account or support requests\n• Ensure the security and integrity of our platform"
          },
          {
            title: "Photo Processing & Storage",
            body: "Photos you upload are processed by our AI styling engine to generate personalized recommendations. Photos are processed securely and are not permanently stored on our servers after your style results are generated. We do not share, sell, or distribute your photos to any third parties."
          },
          {
            title: "Data Sharing",
            body: "We do not sell your personal information. We may share limited data with:\n\n• Service providers who help us operate the app (e.g., cloud hosting, AI processing)\n• Analytics providers to help us understand app usage\n• Law enforcement if required by law\n\nAll third-party providers are bound by confidentiality agreements."
          },
          {
            title: "Data Security",
            body: "We implement industry-standard security measures to protect your personal information, including encryption in transit and at rest. However, no method of electronic transmission or storage is 100% secure."
          },
          {
            title: "Your Rights",
            body: "You have the right to:\n\n• Access the personal data we hold about you\n• Request deletion of your account and associated data\n• Opt out of analytics tracking\n• Update or correct your personal information\n\nTo exercise these rights, contact us at support@glosseti.com."
          },
          {
            title: "Children's Privacy",
            body: "Glosseti is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us immediately."
          },
          {
            title: "Changes to This Policy",
            body: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy within the app and updating the 'Last updated' date."
          },
          {
            title: "Contact Us",
            body: "If you have any questions about this Privacy Policy, please contact us at:\n\n• Email: support@glosseti.com\n• Support page: https://glosseti.lovable.app/support"
          },
        ].map((section, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>{section.title}</h2>
            <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
