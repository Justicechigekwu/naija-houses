import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

type Props ={
    embedded?: boolean;
}

export default function UserAgreementContent({ embedded = false}: Props) {
  return (
    <LegalPageLayout
    embedded={embedded}
      title="User Agreement"
      description="This User Agreement explains the rules and responsibilities that apply to every Velora user."
    >
      <LegalSection title="1. Account Responsibility">
        <p>
          You are responsible for maintaining the confidentiality of your account,
          login details, and all activity that occurs under your account.
        </p>
      </LegalSection>

      <LegalSection title="2. Accurate Information">
        <p>
          You agree to provide accurate information when creating your account,
          posting listings, or communicating with other users.
        </p>
      </LegalSection>

      <LegalSection title="3. Lawful Use">
        <p>
          You agree not to use Velora for unlawful, deceptive, fraudulent, abusive,
          or harmful activities.
        </p>
      </LegalSection>

      <LegalSection title="4. Listings">
        <p>
          When posting a listing, you agree that the item or service is genuine,
          lawfully offered, accurately described, and available to be sold or provided.
        </p>
      </LegalSection>

      <LegalSection title="5. Communications">
        <p>
          You agree to interact respectfully with other users and not to threaten,
          harass, scam, or mislead anyone on the platform.
        </p>
      </LegalSection>

      <LegalSection title="6. Moderation">
        <p>
          Velora may take action on accounts or listings that violate policy, including
          warning users, limiting features, removing listings, or suspending accounts.
        </p>
      </LegalSection>

      <LegalSection title="7. Indemnity">
        <p>
          You agree to be responsible for claims, losses, or liabilities arising from
          your listings, content, transactions, or violations of platform rules.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}