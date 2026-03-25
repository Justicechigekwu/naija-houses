// import LegalPageLayout from "@/components/legal/LegalPageLayout";
// import LegalSection from "@/components/legal/LegalSection";

// export default function AppealPolicyPage() {
//   return (
//     <LegalPageLayout
//       title="Appeal Policy"
//       description="This policy explains how users may appeal listing removals or moderation actions where appeal is available."
//     >
//       <LegalSection title="1. When Appeals Are Allowed">
//         <p>
//           Users may appeal certain listing removals or moderation actions if the
//           platform provides an appeal option in the relevant notification or listing status.
//         </p>
//       </LegalSection>

//       <LegalSection title="2. What to Include in an Appeal">
//         <p>Appeals should clearly explain:</p>
//         <ul className="list-disc pl-6">
//           <li>why the user believes the decision was incorrect,</li>
//           <li>what changes were made if the issue was corrected,</li>
//           <li>any supporting explanation relevant to the review.</li>
//         </ul>
//       </LegalSection>

//       <LegalSection title="3. Review Process">
//         <p>
//           Appeals may be reviewed manually by Velora administrators. A decision may
//           result in approval, rejection, or a request for correction if supported by the platform workflow.
//         </p>
//       </LegalSection>

//       <LegalSection title="4. Time Limits">
//         <p>
//           Velora may set deadlines for submitting appeals. Listings that are not
//           appealed within the allowed period may be permanently removed.
//         </p>
//       </LegalSection>

//       <LegalSection title="5. Final Decisions">
//         <p>
//           Velora reserves the right to make final moderation decisions in line with
//           platform safety, trust, and legal requirements.
//         </p>
//       </LegalSection>
//     </LegalPageLayout>
//   );
// }


import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export default function AppealPolicyPage() {
  return (
    <LegalPageLayout
      title="Appeal Policy"
      description="This policy explains how users may appeal listing removals or moderation actions where appeal is available."
    >
      <LegalSection title="1. When Appeals Are Allowed">
        <p>
          Users may appeal certain listing removals or moderation actions if the
          platform provides an appeal option in the relevant notification or listing status.
        </p>
      </LegalSection>

      <LegalSection title="2. What to Include in an Appeal">
        <p>Appeals should clearly explain:</p>
        <ul className="list-disc pl-6">
          <li>why the user believes the decision was incorrect,</li>
          <li>what changes were made if the issue was corrected,</li>
          <li>any supporting explanation relevant to the review.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Review Process">
        <p>
          Appeals may be reviewed manually by Velora administrators. A decision may
          result in approval, rejection, or a request for correction if supported by the platform workflow.
        </p>
      </LegalSection>

      <LegalSection title="4. Time Limits">
        <p>
          Velora may set deadlines for submitting appeals. Listings that are not
          appealed within the allowed period may be permanently removed.
        </p>
      </LegalSection>

      <LegalSection title="5. Final Decisions">
        <p>
          Velora reserves the right to make final moderation decisions in line with
          platform safety, trust, and legal requirements.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}