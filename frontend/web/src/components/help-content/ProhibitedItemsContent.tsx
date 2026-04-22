import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

type Props = {
  embedded?: boolean;
};

export default function ProhibitedItemsContent({ embedded = false}: Props) {
  return (
    <LegalPageLayout
    embedded={embedded}
      title="Prohibited Items Policy"
      description="The following categories are not allowed on Velora Marketplace."
    >
      <LegalSection title="1. Illegal Items">
        <ul className="list-disc pl-6">
          <li>stolen goods,</li>
          <li>illegal drugs or controlled substances,</li>
          <li>fraudulent documents or forged materials,</li>
          <li>items prohibited by applicable law.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Dangerous Items">
        <ul className="list-disc pl-6">
          <li>weapons where prohibited by law or platform policy,</li>
          <li>explosives, hazardous chemicals, or unsafe materials,</li>
          <li>items that pose unreasonable safety risks.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Fraudulent or Misleading Listings">
        <ul className="list-disc pl-6">
          <li>fake products,</li>
          <li>counterfeit goods,</li>
          <li>listings intended to deceive buyers,</li>
          <li>bait-and-switch offers.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Restricted Content">
        <p>
          Velora may also prohibit additional categories of items or services for
          trust, safety, legal, reputational, or operational reasons.
        </p>
      </LegalSection>

      <LegalSection title="5. Enforcement">
        <p>
          Listings found to violate this policy may be removed immediately, and user
          accounts may face restrictions, suspension, or permanent removal.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}