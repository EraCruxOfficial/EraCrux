import Papa from "papaparse";

// Define a row type for parsed CSV data
type CSVRow = Record<string, string | null | undefined>;

function looksNumeric(value: string): boolean {
  const cleaned = value.replace(/[^0-9.-]/g, ""); // keep digits, dot, minus
  return cleaned !== "" && !isNaN(Number(cleaned));
}

export function parseAndCleanCSV(csv: string) {
  const parsed = Papa.parse<CSVRow>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const rows: CSVRow[] = parsed.data;
  const headers = parsed.meta.fields || [];

  // Step 1: detect which columns are numeric
  const numericColumns = new Set<string>();

  headers.forEach(header => {
    let total = 0;
    let numericCount = 0;

    rows.forEach(row => {
      const rawValue = row[header]?.toString().trim() || "";
      if (rawValue) {
        total++;
        if (looksNumeric(rawValue)) numericCount++;
      }
    });

    if (total > 0 && numericCount / total >= 0.7) {
      numericColumns.add(header);
    }
  });

  // Step 2: clean data
  const cleanedData = rows.map(row => {
    const cleaned: Record<string, string | number | null> = {};

    headers.forEach(header => {
      const safeHeader = header
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");

      const rawValue = row[header]?.toString().trim() || "";

      if (numericColumns.has(header)) {
        const numericPart = rawValue.replace(/[^0-9.-]/g, "");
        cleaned[safeHeader] =
          numericPart && !isNaN(Number(numericPart))
            ? parseFloat(numericPart)
            : null;
      } else {
        cleaned[safeHeader] = rawValue;
      }
    });

    return cleaned;
  });

  return cleanedData;
}
