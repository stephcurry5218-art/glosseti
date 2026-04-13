import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "hsl(var(--background))",
      overflowY: "auto", WebkitOverflowScrolling: "touch",
    }}>
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Jost', sans-serif" }}>Terms of Use</h1>
      </div>

      <div className="px-5 pb-20 max-w-lg mx-auto" style={{ fontFamily: "'Jost', sans-serif", color: "hsl(var(--foreground))" }}>
        <p className="text-xs mb-6" style={{ color: "hsl(var(--glamora-gray))" }}>Last updated: April 13, 2026</p>

        <Section title="1. Acceptance of Terms">
          By downloading, installing, or using Glosseti ("the App"), you agree to be bound by these Terms of Use. If you do not agree, do not use the App.
        </Section>

        <Section title="2. Description of Service">
          Glosseti is an AI-powered style studio that generates personalized outfit recommendations and style guides based on user-uploaded photos. The service includes free and premium subscription tiers.
        </Section>

        <Section title="3. Eligibility">
          You must be at least 13 years old to use Glosseti. If you are under 18, you must have parental or guardian consent.
        </Section>

        <Section title="4. User Accounts">
          You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to update it as necessary. You may delete your account at any time from the Profile screen.
        </Section>

        <Section title="5. Subscriptions & Payments">
          Glosseti offers auto-renewable subscriptions (Weekly and Monthly Premium) through Apple's In-App Purchase system. Payment is charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. You can manage or cancel subscriptions in your device's Settings → Apple ID → Subscriptions. No refunds are provided for partial subscription periods.
        </Section>

        <Section title="6. User Content">
          By uploading photos, you grant Glosseti a limited, non-exclusive license to process your images solely for the purpose of generating style recommendations. Photos are processed in-memory and are not stored on our servers after generation is complete. You retain all rights to your photos.
        </Section>

        <Section title="7. Prohibited Use">
          You agree not to: (a) use the App for any unlawful purpose; (b) upload content that is offensive, harmful, or infringes on others' rights; (c) attempt to reverse-engineer, decompile, or disassemble the App; (d) use automated systems to access the App; (e) circumvent any access restrictions or usage limits.
        </Section>

        <Section title="8. Intellectual Property">
          All content, features, and functionality of Glosseti — including AI-generated style guides, designs, logos, and text — are owned by Glosseti and protected by intellectual property laws. Generated style images are provided for your personal, non-commercial use.
        </Section>

        <Section title="9. Disclaimer of Warranties">
          The App is provided "as is" without warranties of any kind. We do not guarantee that AI-generated recommendations will be suitable for every individual or occasion. Style suggestions are for inspiration and guidance only.
        </Section>

        <Section title="10. Limitation of Liability">
          To the maximum extent permitted by law, Glosseti shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App.
        </Section>

        <Section title="11. Privacy">
          Your use of the App is also governed by our <a href="/privacy" style={{ color: "hsl(var(--glamora-gold))", textDecoration: "underline" }}>Privacy Policy</a>, which describes how we collect, use, and protect your information.
        </Section>

        <Section title="12. Termination">
          We reserve the right to suspend or terminate your access to the App at any time for violation of these Terms, without prior notice.
        </Section>

        <Section title="13. Changes to Terms">
          We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms.
        </Section>

        <Section title="14. Contact">
          For questions about these Terms, contact us at <a href="mailto:support@glosseti.com" style={{ color: "hsl(var(--glamora-gold))", textDecoration: "underline" }}>support@glosseti.com</a>.
        </Section>

        <div className="text-center mt-10">
          <p className="text-xs" style={{ color: "hsl(var(--glamora-gray-light))" }}>
            © {new Date().getFullYear()} Glosseti. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-sm font-semibold mb-2" style={{ color: "hsl(var(--glamora-gold))" }}>{title}</h2>
    <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--glamora-gray))", lineHeight: 1.7 }}>{children}</p>
  </div>
);

export default Terms;
