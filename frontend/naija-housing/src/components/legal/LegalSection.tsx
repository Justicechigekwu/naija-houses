import { ReactNode } from "react";

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export default function LegalSection({
  title,
  children,
}: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  );
}