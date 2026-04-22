import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function SafetyTipsScreen() {
  return (
    <LegalPageScreen
      title="Safety Tips"
      description="Use these tips to stay safe while buying and selling on Velora Marketplace."
    >
      <LegalSectionMobile title="1. Verify Before Paying">
        <LegalText>
          Inspect items carefully and verify seller details before sending
          payment.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Be Careful With Advance Payments">
        <LegalText>
          Avoid risky transactions where you cannot verify the item or seller.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Watch for Red Flags">
        <LegalText>
          Be cautious of prices that are too good to be true, rushed deals,
          pressure, fake proof, or inconsistent listing details.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="4. Report Suspicious Activity">
        <LegalText>
          Use platform reporting tools if you suspect fraud, scams, or policy
          violations.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}