import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function AboutScreen() {
  return (
    <LegalPageScreen
      title="About Velora"
      description="Understanding how Velora works."
    >
      <LegalSectionMobile title="1. Be Honest">
        <LegalText>
          Buy, sell, and connect with confidence. Velora helps users list
          products and services while maintaining marketplace safety and trust.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Be Respectful">
        <LegalText>
          Our platform is a digitally integrated marketplace that helps users
          buy, sell, and rent seamlessly.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}