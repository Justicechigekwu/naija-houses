import LegalBulletList from "@/components/help/LegalBulletList";
import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function TermsScreen() {
  return (
    <LegalPageScreen
      title="Terms & Conditions"
      description="These Terms & Conditions govern access to and use of Velora Marketplace."
    >
      <LegalSectionMobile title="1. Acceptance of Terms">
        <LegalText>
          By creating an account, accessing, or using Velora Marketplace, you
          agree to be bound by these Terms & Conditions, our Privacy Policy, User
          Agreement, and other marketplace rules published on the platform.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Eligibility">
        <LegalText>
          You must be legally capable of entering into a binding agreement in
          your jurisdiction to use Velora. By using the platform, you represent
          that the information you provide is accurate and current.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Marketplace Role">
        <LegalText>
          Velora provides a platform where users may post listings,
          communicate, and conduct transactions. Velora is not the seller,
          buyer, manufacturer, or owner of listed items unless explicitly stated
          otherwise.
        </LegalText>

        <LegalText>
          Velora is not responsible for the quality, legality, safety,
          accuracy, or existence of listings, nor for the ability of sellers to
          sell or buyers to pay.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="4. User Responsibilities">
        <LegalBulletList
          items={[
            "provide truthful and accurate information,",
            "post only legal and permitted listings,",
            "avoid fraud, impersonation, harassment, and misleading conduct,",
            "comply with all applicable laws and regulations.",
          ]}
        />
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}