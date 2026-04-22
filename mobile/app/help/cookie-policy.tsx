import LegalBulletList from "@/components/help/LegalBulletList";
import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function CookiePolicyScreen() {
  return (
    <LegalPageScreen
      title="Cookie Policy"
      description="This Cookie Policy explains how Velora may use cookies and similar technologies."
    >
      <LegalSectionMobile title="1. What Are Cookies">
        <LegalText>
          Cookies are small data files stored on your device that help websites
          remember information about your visit.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. How We Use Cookies">
        <LegalText>Velora may use cookies to:</LegalText>
        <LegalBulletList
          items={[
            "keep users signed in,",
            "improve platform performance,",
            "understand usage patterns,",
            "enhance security and fraud detection.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Managing Cookies">
        <LegalText>
          You may control cookie behavior through your browser settings, though
          some parts of the platform may not function properly if cookies are
          disabled.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}