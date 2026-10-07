import type { ReactNode, SVGProps } from "react";

/** Small outline icons (decorative; always aria-hidden). Stroke follows the text colour. */
function Icon({ children, className = "size-5", ...rest }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      {children}
    </svg>
  );
}

type P = { className?: string };

export const SearchIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);
export const PillIcon = (p: P) => (
  <Icon {...p}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 0 0-7-7l-10 10a4.95 4.95 0 0 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </Icon>
);
export const HospitalIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 21V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16" />
    <path d="M2 21h20M12 8v6M9 11h6M10 21v-4h4v4" />
  </Icon>
);
export const PharmacyIcon = (p: P) => (
  <Icon {...p}>
    <path d="M3 10h18l-1.5-5h-15L3 10Z" />
    <path d="M5 10v10h14V10M12 13v4M10 15h4" />
  </Icon>
);
export const DoctorIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="7" r="3.5" />
    <path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M12 15v3M10.5 16.5h3" />
  </Icon>
);
export const StethoscopeIcon = (p: P) => (
  <Icon {...p}>
    <path d="M6 3v6a4 4 0 0 0 8 0V3M4 3h4M12 3h4" />
    <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
    <circle cx="20" cy="11" r="2" />
  </Icon>
);
export const PinIcon = (p: P) => (
  <Icon {...p}>
    <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);
export const NavigateIcon = (p: P) => (
  <Icon {...p}>
    <path d="m3 11 18-8-8 18-2-8-8-2Z" />
  </Icon>
);
export const PhoneIcon = (p: P) => (
  <Icon {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Icon>
);
export const GlobeIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Icon>
);
export const ChevronIcon = (p: P) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);
export const SirenIcon = (p: P) => (
  <Icon {...p}>
    <path d="M7 18v-6a5 5 0 0 1 10 0v6M5 21h14M12 3v2M4.5 7l1.5 1M19.5 7 18 8" />
  </Icon>
);
export const MapIcon = (p: P) => (
  <Icon {...p}>
    <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14" />
  </Icon>
);
