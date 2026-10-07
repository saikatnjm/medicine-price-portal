import { FactChips, type Fact } from "@/components/ui/fact-chips";
import { ClockIcon } from "@/components/ui/icons";
import { BedIcon, LayersIcon } from "@/components/ui/icons-entity";
import { getT } from "@/i18n/server";

interface QuickFactsProps {
  beds?: number;
  openingHours?: string;
  /** Number of departments or specialties listed; links to the #departments section. */
  departments?: number;
}

/** Short icon + label + value chips; only values that exist are shown, and nothing renders when none do. */
export function QuickFacts({ beds, openingHours, departments }: QuickFactsProps) {
  const t = getT();
  const facts: Fact[] = [];
  if (openingHours) {
    facts.push({ key: "hours", icon: <ClockIcon className="size-4" />, label: t("facility.contact.openingHours"), value: openingHours });
  }
  if (beds) {
    facts.push({ key: "beds", icon: <BedIcon className="size-4" />, label: t("facility.contact.beds"), value: beds.toLocaleString("en-US") });
  }
  if (departments && departments > 0) {
    facts.push({
      key: "departments",
      icon: <LayersIcon className="size-4" />,
      label: t("facility.facts.departments"),
      value: departments.toLocaleString("en-US"),
      href: "#departments",
    });
  }
  return <FactChips facts={facts} label={t("facility.facts.label")} />;
}
