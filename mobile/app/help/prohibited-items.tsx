import LegalBulletList from "@/components/help/LegalBulletList";
import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function ProhibitedItemsScreen() {
  return (
    <LegalPageScreen
      title="Prohibited Items Policy"
      description="The following categories are not allowed on Velora Marketplace."
    >
      <LegalSectionMobile title="1. Illegal Items">
        <LegalBulletList
          items={[
            "stolen goods,",
            "illegal drugs or controlled substances,",
            "fraudulent documents or forged materials,",
            "items prohibited by applicable law.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Dangerous Items">
        <LegalBulletList
          items={[
            "weapons where prohibited by law or platform policy,",
            "explosives, hazardous chemicals, or unsafe materials,",
            "items that pose unreasonable safety risks.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Fraudulent or Misleading Listings">
        <LegalBulletList
          items={[
            "fake products,",
            "counterfeit goods,",
            "listings intended to deceive buyers,",
            "bait-and-switch offers.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="4. Restricted Content">
        <LegalText>
          Velora may also prohibit additional categories of items or services
          for trust, safety, legal, reputational, or operational reasons.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="5. Enforcement">
        <LegalText>
          Listings found to violate this policy may be removed immediately, and
          user accounts may face restrictions, suspension, or permanent removal.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}