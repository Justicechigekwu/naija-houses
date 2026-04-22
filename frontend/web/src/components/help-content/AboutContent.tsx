import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

type Props = {
  embedded?: boolean;
};

export default function AboutContent({ embedded = false}: Props) {
  return (
    <LegalPageLayout
    embedded={embedded}
      title="About Velora"
      description="Understanding how Velora works."
    >
      <LegalSection title="1. Be Honest">
        <p>
          Buy, sell, and connect with confidence. Velora helps users list products and services while maintaining marketplace safety and trust.
        </p>
      </LegalSection>

      <LegalSection title="2. Be Respectful">
        <p>
          Our platform is a digitally integrated marketplace that helps users
                buy, sell, and rent seamlessly.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}