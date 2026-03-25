import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="These Terms & Conditions govern access to and use of Velora Marketplace."
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By creating an account, accessing, or using Velora Marketplace, you agree
          to be bound by these Terms & Conditions, our Privacy Policy, User Agreement,
          and other marketplace rules published on the platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be legally capable of entering into a binding agreement in your
          jurisdiction to use Velora. By using the platform, you represent that the
          information you provide is accurate and current.
        </p>
      </LegalSection>

      <LegalSection title="3. Marketplace Role">
        <p>
          Velora provides a platform where users may post listings, communicate, and
          conduct transactions. Velora is not the seller, buyer, manufacturer, or
          owner of listed items unless explicitly stated otherwise.
        </p>
        <p>
          Velora is not responsible for the quality, legality, safety, accuracy, or
          existence of listings, nor for the ability of sellers to sell or buyers to pay.
        </p>
      </LegalSection>

      <LegalSection title="4. User Responsibilities">
        <p>Users agree to:</p>
        <ul className="list-disc pl-6">
          <li>provide truthful and accurate information,</li>
          <li>post only legal and permitted listings,</li>
          <li>avoid fraud, impersonation, harassment, and misleading conduct,</li>
          <li>comply with all applicable laws and regulations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Listings and Content">
        <p>
          Users are solely responsible for the content they upload, including titles,
          images, descriptions, prices, and category selections.
        </p>
        <p>
          Velora may review, restrict, suspend, or remove listings that violate our
          policies or that pose trust, safety, or legal concerns.
        </p>
      </LegalSection>

      <LegalSection title="6. Prohibited Conduct">
        <p>
          Users may not use Velora to post illegal items, stolen goods, deceptive
          listings, fake offers, or any content that violates our Prohibited Items
          Policy or Community Guidelines.
        </p>
      </LegalSection>

      <LegalSection title="7. Payments and Transactions">
        <p>
          Velora may provide tools that support marketplace transactions, but users
          remain responsible for verifying the legitimacy of any transaction before
          sending payment or transferring goods.
        </p>
        <p>
          Unless explicitly stated, Velora does not guarantee refunds, delivery, item
          condition, or transaction outcomes between users.
        </p>
      </LegalSection>

      <LegalSection title="8. Suspension, Removal, and Termination">
        <p>
          Velora may suspend accounts, remove listings, restrict features, or terminate
          platform access where there is suspected abuse, fraud, policy violation,
          security risk, or legal necessity.
        </p>
      </LegalSection>

      <LegalSection title="9. Appeals">
        <p>
          Users may appeal certain moderation decisions where the platform provides
          that option. Appeals may be reviewed manually and may be approved or rejected
          at Velora’s discretion in line with platform rules.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimer of Warranties">
        <p>
          Velora is provided on an “as is” and “as available” basis without warranties
          of any kind, whether express or implied.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Velora shall not be liable for indirect,
          incidental, special, consequential, or punitive damages, or for losses arising
          from user transactions, listing removals, fraud, payment disputes, or service interruptions.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to These Terms">
        <p>
          Velora may update these Terms & Conditions from time to time. Continued use
          of the platform after updates means you accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          For legal or policy questions, contact Velora support through the contact
          channel provided on the platform.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}