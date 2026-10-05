/** Short, honest note on where the information comes from. */
export function DataSourcesNote() {
  return (
    <p className="max-w-2xl text-sm text-slate-700">
      Medicine information comes from the DGDA list of registered drug products. Hospital, clinic
      and pharmacy listings are community-mapped data from{" "}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-800 underline"
      >
        © OpenStreetMap contributors
      </a>{" "}
      and have not been verified. Prices and doctor profiles are not available yet.
    </p>
  );
}
