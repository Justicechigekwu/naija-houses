import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export default function SafetyTipsPage() {
  return (
    <LegalPageLayout
      title="Safety Tips"
      description="Use these tips to stay safe while buying and selling on Velora Marketplace."
    >
      <LegalSection title="1. Verify Before Paying">
        <p>
          Inspect items carefully and verify seller details before sending payment.
        </p>
      </LegalSection>

      <LegalSection title="2. Be Careful With Advance Payments">
        <p>
          Avoid risky transactions where you cannot verify the item or seller.
        </p>
      </LegalSection>

      <LegalSection title="3. Watch for Red Flags">
        <p>
          Be cautious of prices that are too good to be true, rushed deals, pressure,
          fake proof, or inconsistent listing details.
        </p>
      </LegalSection>

      <LegalSection title="4. Report Suspicious Activity">
        <p>
          Use platform reporting tools if you suspect fraud, scams, or policy violations.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}