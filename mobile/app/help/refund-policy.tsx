import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function RefundPolicyScreen() {
  return (
    <LegalPageScreen
      title="Refund Policy"
      description="This Refund Policy explains how Velora handles refund expectations on the marketplace."
    >
      <LegalSectionMobile title="1. User-to-User Transactions">
        <LegalText>
          Unless explicitly stated otherwise, Velora is a platform connecting
          buyers and sellers and is not automatically responsible for issuing
          refunds for user-to-user transactions.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Platform Fees">
        <LegalText>
          If Velora introduces paid platform features, any refund rules for such
          fees may be stated separately at the point of purchase.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Disputes">
        <LegalText>
          Users should review listing details carefully and communicate clearly
          before completing transactions. Velora may review reports or disputes
          where platform tools support that process.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}