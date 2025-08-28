export function parseAndCleanCSV(csv: string) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        let value = values[index];
        if (value && !isNaN(Number(value.replace(/[,$]/g, "")))) {
          row[header] = parseFloat(value.replace(/[,$]/g, ""));
        } else {
          row[header] = value || "";
        }
      });
      data.push(row);
    }
  }

  return data.filter(row =>
    Object.values(row).some(value => value && value.toString().trim() !== "")
  );
}
