/** Required attribution wherever OpenStreetMap-derived records are listed (ODbL). */
export function OsmCredit() {
  return (
    <p className="text-sm text-slate-600">
      Listings are community-mapped and not verified; call ahead before visiting. Map data ©{" "}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
        OpenStreetMap contributors
      </a>
      .
    </p>
  );
}
