import LegalBulletList from "@/components/help/LegalBulletList";
import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalText } from "@/components/help/LegalText";

export default function AppealPolicyScreen() {
  return (
    <LegalPageScreen
      title="Appeal Policy"
      description="This policy explains how users may appeal listing removals or moderation actions where appeal is available."
    >
      <LegalSectionMobile title="1. When Appeals Are Allowed">
        <LegalText>
          Users may appeal certain listing removals or moderation actions if the
          platform provides an appeal option in the relevant notification or
          listing status.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. What to Include in an Appeal">
        <LegalText>Appeals should clearly explain:</LegalText>
        <LegalBulletList
          items={[
            "why the user believes the decision was incorrect,",
            "what changes were made if the issue was corrected,",
            "any supporting explanation relevant to the review.",
          ]}
        />
      </LegalSectionMobile>

      <LegalSectionMobile title="3. Review Process">
        <LegalText>
          Appeals may be reviewed manually by Velora administrators. A decision
          may result in approval, rejection, or a request for correction if
          supported by the platform workflow.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="4. Time Limits">
        <LegalText>
          Velora may set deadlines for submitting appeals. Listings that are not
          appealed within the allowed period may be permanently removed.
        </LegalText>
      </LegalSectionMobile>

      <LegalSectionMobile title="5. Final Decisions">
        <LegalText>
          Velora reserves the right to make final moderation decisions in line
          with platform safety, trust, and legal requirements.
        </LegalText>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}