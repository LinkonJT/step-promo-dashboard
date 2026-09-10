import type { RetailRow } from "./retail-types";

const MONTH_TO_KEY: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

// "1,342,611" | "74.59%" | "(11,957)" → number
function num(raw: string | undefined): number {
  if (!raw) return 0;
  const s = String(raw).trim();
  if (s === "" || s === "-") return 0;
  const neg = s.startsWith("(") && s.endsWith(")");
  const cleaned = s.replace(/[(),%\s]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n)) return 0;
  const val = s.includes("%") ? n / 100 : n;
  return neg ? -val : val;
}

function monthKey(month: string): string {
  // "Jan-26" → "2026-01"
  const [mon, yy] = month.split("-");
  const mm = MONTH_TO_KEY[mon] ?? "00";
  return `20${yy}-${mm}`;
}

export function parseRetailRows(raw: string[][]): RetailRow[] {
  const rows: RetailRow[] = [];

  for (const r of raw) {
    const month = (r[0] ?? "").trim();
    const outlet = (r[1] ?? "").trim();
    // Skip blank rows in the pre-filled formula buffer
    if (!month || !outlet) continue;

    rows.push({
      month,
      monthKey: monthKey(month),
      outlet,
      region: (r[2] ?? "").trim(),
      regionGroup: (r[3] ?? "").trim() as RetailRow["regionGroup"],
      targetSale: num(r[4]),
      actualSale: num(r[5]),
      achievementPct: num(r[6]),
      grossProfit: num(r[7]),
      totalExpenses: num(r[8]),
      netProfit: num(r[9]),
      netMarginPct: num(r[10]),
    });
  }

  return rows;
}