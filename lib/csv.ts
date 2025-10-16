import Papa from "papaparse";

// Define a row type for parsed CSV data
type CSVRow = Record<string, string | null | undefined>;

function looksNumeric(value: string): boolean {
  const cleaned = value.replace(/[^0-9.-]/g, ""); 
  return cleaned !== "" && !isNaN(Number(cleaned));
}

export function parseAndCleanCSV(csv: string) {
  const parsed = Papa.parse<CSVRow>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (header: string) => header?.trim(),
  });

  let headers = parsed.meta.fields || [];

  const cleanedHeaders = headers
    .map((header, idx) => {
      const trimmed = header?.trim() || "";
      if (!trimmed) return `Column_${idx + 1}`;
      return trimmed.replace(/\s+/g, "_").replace(/[^\w]/g, "");
    })
    .filter((h) => h && h !== ""); 

  const rows: CSVRow[] = parsed.data;

  // Step 1: detect which columns are numeric
  const numericColumns = new Set<string>();

  cleanedHeaders.forEach((header, i) => {
    const originalHeader = headers[i];
    let total = 0;
    let numericCount = 0;

    rows.forEach((row) => {
      const rawValue = row[originalHeader]?.toString().trim() || "";
      if (rawValue) {
        total++;
        if (looksNumeric(rawValue)) numericCount++;
      }
    });

    if (total > 0 && numericCount / total >= 0.7) {
      numericColumns.add(header);
    }
  });

  const cleanedData = rows.map((row) => {
    const cleaned: Record<string, string | number | null> = {};

    cleanedHeaders.forEach((header, i) => {
      const originalHeader = headers[i];
      const rawValue = row[originalHeader]?.toString().trim() || "";

      if (numericColumns.has(header)) {
        const numericPart = rawValue.replace(/[^0-9.-]/g, "");
        cleaned[header] =
          numericPart && !isNaN(Number(numericPart))
            ? parseFloat(numericPart)
            : null;
      } else {
        cleaned[header] = rawValue;
      }
    });

    return cleaned;
  });

  return cleanedData;
}
