/**
 * Compact on-disk format for the large seed files (medicines, facilities,
 * pharmacies). See docs/DATA-PIPELINE.md ("Seed file format") and D40.
 *
 * Values shared by every record (timestamps, source id, status) are stored once
 * in a header, and fields derivable from the record id are omitted. `expand*`
 * rebuilds exactly the objects the build scripts produce (same values, same key
 * order). Plain JavaScript (no imports) so the app, the data scripts and the
 * tests share one implementation.
 */

export const MEDICINES_FORMAT = "medicines/v1";
export const DIRECTORY_FORMAT = "directory/v1";

/** Medicine row columns, in order. `registeredName` is optional (omitted when equal to brandName). */
export const MEDICINE_COLUMNS = [
  "recordId",
  "slug",
  "brandName",
  "genericId",
  "manufacturerId",
  "strength",
  "dosageForm",
  "dosageFormLabel",
  "registeredName",
];

/** DGDA record ids are "{DAR number}--{brand slug}", so the DAR number is the part before "--". */
const darNumberOf = (recordId) => recordId.split("--")[0];

const omit = (object, keys) => Object.fromEntries(Object.entries(object).filter(([k]) => !keys.includes(k)));

// ------------------------------------------------------------------ medicines

export function compactMedicines(medicines, { idPrefix }) {
  const first = medicines[0];
  const darNumberExceptions = {};
  const records = medicines.map((m) => {
    const { recordId, darNumber } = m.provenance;
    if (darNumber !== darNumberOf(recordId)) darNumberExceptions[recordId] = darNumber ?? null;
    const row = [recordId, m.slug, m.brandName, m.genericId, m.manufacturerId, m.strength, m.dosageForm, m.dosageFormLabel];
    if (m.registeredName !== undefined) row.push(m.registeredName);
    return row;
  });
  return {
    format: MEDICINES_FORMAT,
    idPrefix,
    updatedAt: first?.updatedAt ?? null,
    provenance: first ? omit(first.provenance, ["recordId", "darNumber"]) : {},
    darNumberExceptions,
    columns: MEDICINE_COLUMNS,
    records,
  };
}

export function expandMedicines(data) {
  assertFormat(data, MEDICINES_FORMAT);
  const { sourceId, ...sharedProvenance } = data.provenance;
  return data.records.map(
    ([recordId, slug, brandName, genericId, manufacturerId, strength, dosageForm, dosageFormLabel, registeredName]) => {
      const darNumber = Object.hasOwn(data.darNumberExceptions, recordId)
        ? data.darNumberExceptions[recordId]
        : darNumberOf(recordId);
      const medicine = {
        id: `${data.idPrefix}${recordId}`,
        slug,
        brandName,
        genericId,
        manufacturerId,
        strength,
        dosageForm,
        dosageFormLabel,
        updatedAt: data.updatedAt,
        provenance: { sourceId, recordId, ...(darNumber === null ? {} : { darNumber }), ...sharedProvenance },
      };
      if (registeredName !== undefined) medicine.registeredName = registeredName;
      return medicine;
    },
  );
}

// ------------------------------------------- directory (facilities, pharmacies)

/** OSM record id "node/123" → entity id "{idPrefix}node_123". */
const directoryId = (idPrefix, recordId) => `${idPrefix}${recordId.replace("/", "_")}`;

export function compactDirectory(items, { idPrefix, recordUrlPrefix }) {
  const first = items[0];
  return {
    format: DIRECTORY_FORMAT,
    idPrefix,
    recordUrlPrefix,
    updatedAt: first?.updatedAt ?? null,
    provenance: first ? omit(first.provenance, ["recordId", "recordUrl"]) : {},
    records: items.map((item) => ({ recordId: item.provenance.recordId, ...omit(item, ["id", "updatedAt", "provenance"]) })),
  };
}

export function expandDirectory(data) {
  assertFormat(data, DIRECTORY_FORMAT);
  const { sourceId, ...sharedProvenance } = data.provenance;
  return data.records.map(({ recordId, google, ...fields }) => ({
    id: directoryId(data.idPrefix, recordId),
    ...fields,
    updatedAt: data.updatedAt,
    provenance: { sourceId, recordId, recordUrl: `${data.recordUrlPrefix}${recordId}`, ...sharedProvenance },
    ...(google === undefined ? {} : { google }),
  }));
}

// ---------------------------------------------------------------------- shared

/** Expands any seed file's parsed JSON: compact files are expanded, plain arrays are returned unchanged. */
export function expandSeed(data) {
  if (Array.isArray(data)) return data;
  if (data?.format === MEDICINES_FORMAT) return expandMedicines(data);
  if (data?.format === DIRECTORY_FORMAT) return expandDirectory(data);
  throw new Error(`Unknown seed format: ${JSON.stringify(data?.format)}`);
}

/** Serialises a compact file: one header field per line, then one record per line (small, diffable). */
export function formatCompactSeed(data) {
  const { records, ...header } = data;
  const headerLines = Object.entries(header).map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
  const body = records.length ? `[\n${records.map((r) => `  ${JSON.stringify(r)}`).join(",\n")}\n]` : "[]";
  return `{\n${headerLines.join(",\n")},\n  "records": ${body}\n}\n`;
}

function assertFormat(data, format) {
  if (data?.format !== format) throw new Error(`Expected seed format "${format}", got ${JSON.stringify(data?.format)}`);
}
