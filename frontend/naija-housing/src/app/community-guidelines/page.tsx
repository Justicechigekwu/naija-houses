import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export default function CommunityGuidelinesPage() {
  return (
    <LegalPageLayout
      title="Community Guidelines"
      description="These guidelines help keep Velora safe, respectful, and trustworthy for everyone."
    >
      <LegalSection title="1. Be Honest">
        <p>
          Listings must be truthful. Do not misrepresent item condition, ownership,
          pricing, availability, or delivery terms.
        </p>
      </LegalSection>

      <LegalSection title="2. Be Respectful">
        <p>
          Harassment, hate, threats, abusive language, or discriminatory behavior
          are not allowed.
        </p>
      </LegalSection>

      <LegalSection title="3. No Fraud or Deception">
        <p>
          Do not attempt to scam, impersonate others, request unsafe payments, or
          trick users into sharing sensitive information.
        </p>
      </LegalSection>

      <LegalSection title="4. Only Post Allowed Content">
        <p>
          Users must not post prohibited, illegal, stolen, counterfeit, or unsafe items.
        </p>
      </LegalSection>

      <LegalSection title="5. Use Real Images and Accurate Details">
        <p>
          Images and descriptions must reflect the actual product or service being offered.
        </p>
      </LegalSection>

      <LegalSection title="6. Respect Moderation Decisions">
        <p>
          If content is removed or restricted, do not evade moderation by reposting
          the same violating content.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}