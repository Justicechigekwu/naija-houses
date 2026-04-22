import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

type Props = {
    embedded?: boolean;
}

export default function RefundPolicyContent({ embedded = false}: Props) {
  return (
    <LegalPageLayout
    embedded={embedded}
      title="Refund Policy"
      description="This Refund Policy explains how Velora handles refund expectations on the marketplace."
    >
      <LegalSection title="1. User-to-User Transactions">
        <p>
          Unless explicitly stated otherwise, Velora is a platform connecting buyers
          and sellers and is not automatically responsible for issuing refunds for user-to-user transactions.
        </p>
      </LegalSection>

      <LegalSection title="2. Platform Fees">
        <p>
          If Velora introduces paid platform features, any refund rules for such fees
          may be stated separately at the point of purchase.
        </p>
      </LegalSection>

      <LegalSection title="3. Disputes">
        <p>
          Users should review listing details carefully and communicate clearly before
          completing transactions. Velora may review reports or disputes where platform tools support that process.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}