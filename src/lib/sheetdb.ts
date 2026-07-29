const SHEETDB_URL = "https://sheetdb.io/api/v1/nbt04ikelg5pv";

export async function saveToSheetDB(data: Record<string, string>): Promise<void> {
  const payload = { data };

  const response = await fetch(SHEETDB_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SheetDB error (${response.status}): ${body}`);
  }

  const result = await response.json();
  console.log("✔ Données enregistrées dans SheetDB:", result);
}
