import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="This Cookie Policy explains how Velora may use cookies and similar technologies."
    >
      <LegalSection title="1. What Are Cookies">
        <p>
          Cookies are small data files stored on your device that help websites remember
          information about your visit.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Cookies">
        <p>Velora may use cookies to:</p>
        <ul className="list-disc pl-6">
          <li>keep users signed in,</li>
          <li>improve platform performance,</li>
          <li>understand usage patterns,</li>
          <li>enhance security and fraud detection.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Managing Cookies">
        <p>
          You may control cookie behavior through your browser settings, though some
          parts of the platform may not function properly if cookies are disabled.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}