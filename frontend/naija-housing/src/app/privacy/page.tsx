import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how Velora collects, uses, stores, and protects user information."
    >
      <LegalSection title="1. Information We Collect">
        <p>We may collect:</p>
        <ul className="list-disc pl-6">
          <li>account information such as name, email address, and profile details,</li>
          <li>listing information including descriptions, photos, pricing, and categories,</li>
          <li>communication data such as support messages and in-app chats,</li>
          <li>technical data such as device information, IP address, and browser details,</li>
          <li>transaction-related data where relevant.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Information">
        <p>We use information to:</p>
        <ul className="list-disc pl-6">
          <li>create and manage user accounts,</li>
          <li>display listings and enable marketplace activity,</li>
          <li>improve safety, moderation, and fraud prevention,</li>
          <li>respond to user requests and support needs,</li>
          <li>enforce platform rules and legal obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Sharing of Information">
        <p>
          We may share limited information with service providers, payment providers,
          legal authorities where required, or other parties necessary to operate and
          protect the platform.
        </p>
      </LegalSection>

      <LegalSection title="4. User Content Visibility">
        <p>
          Information you place in public listings, profile details, and marketplace
          posts may be visible to other users and should be shared carefully.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          Velora takes reasonable steps to protect user data, but no method of storage
          or internet transmission is completely secure.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We may retain information for as long as necessary to operate the platform,
          resolve disputes, enforce agreements, comply with legal obligations, and
          maintain platform integrity.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Choices">
        <p>
          You may be able to update profile information, manage listings, or request
          support regarding account-related concerns depending on platform features.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to This Policy">
        <p>
          We may revise this Privacy Policy from time to time. Continued use of the
          platform means you accept the updated version.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}