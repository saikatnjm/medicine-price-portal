import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  children: ReactNode;
  description?: ReactNode;
}

/** h2 + optional supporting text, used for page sections. */
export function SectionHeading({ id, children, description }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-xl font-semibold text-slate-900">
        {children}
      </h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
    </div>
  );
}
