import { getT } from "@/i18n/server";

/** Required attribution wherever OpenStreetMap-derived records are listed (ODbL). */
export function OsmCredit() {
  const t = getT();
  return (
    <p className="text-sm text-slate-600">
      {t("facility.osm.text")}{" "}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
        OpenStreetMap contributors
      </a>
      {t("directory.stop")}
    </p>
  );
}
