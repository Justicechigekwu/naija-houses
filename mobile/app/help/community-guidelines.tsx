import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function CommunityGuidelinesScreen() {
  return (
    <LegalPageScreen
      title="Community Guidelines"
      description="These guidelines help keep Velora safe, respectful, and trustworthy for everyone."
    >
      <LegalSectionMobile title="1. Be Honest">
        <LegalText>
          Listings must be truthful. Do not misrepresent item condition,
          ownership, pricing, availability, or delivery terms.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Be Respectful">
        <LegalText>
          Harassment, hate, threats, abusive language, or discriminatory
          behavior are not allowed.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="3. No Fraud or Deception">
        <LegalText>
          Do not attempt to scam, impersonate others, request unsafe payments,
          or trick users into sharing sensitive information.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="4. Only Post Allowed Content">
        <LegalText>
          Users must not post prohibited, illegal, stolen, counterfeit, or
          unsafe items.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="5. Use Real Images and Accurate Details">
        <LegalText>
          Images and descriptions must reflect the actual product or service
          being offered.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="6. Respect Moderation Decisions">
        <LegalText>
          If content is removed or restricted, do not evade moderation by
          reposting the same violating content.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}