import type { AnchorHTMLAttributes, ReactNode } from "react";

/** Minimal stand-in for next/link in jsdom tests (no router is mounted). */
export default function LinkMock({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode }) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
