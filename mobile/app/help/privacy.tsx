import LegalBulletList from "@/components/help/LegalBulletList";
import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function PrivacyScreen() {
  return (
    <LegalPageScreen
      title="Privacy Policy"
      description="This Privacy Policy explains how Velora collects, uses, stores, and protects user information."
    >
      <LegalSectionMobile title="1. Information We Collect">
        <LegalText>We may collect:</LegalText>
        <LegalBulletList
          items={[
            "account information such as name, email address, and profile details,",
            "listing information including descriptions, photos, pricing, and categories,",
            "communication data such as support messages and in-app chats,",
            "technical data such as device information, IP address, and browser details,",
            "transaction-related data where relevant.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="2. How We Use Information">
        <LegalText>We use information to:</LegalText>
        <LegalBulletList
          items={[
            "create and manage user accounts,",
            "display listings and enable marketplace activity,",
            "improve safety, moderation, and fraud prevention,",
            "respond to user requests and support needs,",
            "enforce platform rules and legal obligations.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Sharing of Information">
        <LegalText>
          We may share limited information with service providers, payment
          providers, legal authorities where required, or other parties
          necessary to operate and protect the platform.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="4. User Content Visibility">
        <LegalText>
          Information you place in public listings, profile details, and
          marketplace posts may be visible to other users and should be shared
          carefully.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="5. Data Security">
        <LegalText>
          Velora takes reasonable steps to protect user data, but no method of
          storage or internet transmission is completely secure.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="6. Data Retention">
        <LegalText>
          We may retain information for as long as necessary to operate the
          platform, resolve disputes, enforce agreements, comply with legal
          obligations, and maintain platform integrity.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="7. Your Choices">
        <LegalText>
          You may be able to update profile information, manage listings, or
          request support regarding account-related concerns depending on
          platform features.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="8. Changes to This Policy">
        <LegalText>
          We may revise this Privacy Policy from time to time. Continued use of
          the platform means you accept the updated version.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}