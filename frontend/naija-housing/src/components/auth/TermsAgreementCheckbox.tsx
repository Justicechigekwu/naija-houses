import Link from "next/link";

type TermsAgreementCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export default function TermsAgreementCheckbox({
  checked,
  onChange,
  error,
}: TermsAgreementCheckboxProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300"
        />
        <span>
          I agree to Velora’s{" "}
          <Link href="/terms" className="font-medium underline underline-offset-4">
            Terms & Conditions
          </Link>{" "}
          ,{" "}
          <Link href="/privacy" className="font-medium underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/user-agreement"
            className="font-medium underline underline-offset-4"
          >
            User Agreement
          </Link>
          .
        </span>
      </label>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}