import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function UserAgreementScreen() {
  return (
    <LegalPageScreen
      title="User Agreement"
      description="This User Agreement explains the rules and responsibilities that apply to every Velora user."
    >
      <LegalSectionMobile title="1. Account Responsibility">
        <LegalText>
          You are responsible for maintaining the confidentiality of your
          account, login details, and all activity that occurs under your
          account.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Accurate Information">
        <LegalText>
          You agree to provide accurate information when creating your account,
          posting listings, or communicating with other users.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Lawful Use">
        <LegalText>
          You agree not to use Velora for unlawful, deceptive, fraudulent,
          abusive, or harmful activities.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="4. Listings">
        <LegalText>
          When posting a listing, you agree that the item or service is genuine,
          lawfully offered, accurately described, and available to be sold or
          provided.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="5. Communications">
        <LegalText>
          You agree to interact respectfully with other users and not to
          threaten, harass, scam, or mislead anyone on the platform.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="6. Moderation">
        <LegalText>
          Velora may take action on accounts or listings that violate policy,
          including warning users, limiting features, removing listings, or
          suspending accounts.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="7. Indemnity">
        <LegalText>
          You agree to be responsible for claims, losses, or liabilities arising
          from your listings, content, transactions, or violations of platform
          rules.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}