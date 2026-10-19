import type { RetailRow } from "./retail-types";

const MONTH_TO_KEY: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Google Sheets counts dates as a serial number from 1899-12-30. If a pasted
// "Sep-26" gets auto-converted into a date, the API returns that serial
// instead of text — this turns it back into "Sep-26".
function serialToMonthLabel(serial: number): string {
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return `${MONTH_NAMES[d.getUTCMonth()]}-${String(d.getUTCFullYear()).slice(-2)}`;
}

// Month can arrive as text ("Sep-26") or as a date serial (46266).
function monthLabel(raw: unknown): string {
  if (typeof raw === "number") return serialToMonthLabel(raw);
  return String(raw ?? "").trim();
}

function text(raw: unknown): string {
  return String(raw ?? "").trim();
}

// 1342611 | "1,342,611" | "74.59%" | "(11,957)" → number
function num(raw: unknown): number {
  if (typeof raw === "number") return raw;
  const s = String(raw ?? "").trim();
  if (s === "" || s === "-") return 0;
  const neg = s.startsWith("(") && s.endsWith(")");
  const n = parseFloat(s.replace(/[(),%\s]/g, ""));
  if (Number.isNaN(n)) return 0;
  const val = s.includes("%") ? n / 100 : n;
  return neg ? -val : val;
}

function monthKey(month: string): string {
  // "Sep-26" → "2026-09". slice(0,3) also accepts "June-26" / "July-26".
  const [mon, yy] = month.split("-");
  const mm = MONTH_TO_KEY[(mon ?? "").slice(0, 3)] ?? "00";
  return `20${yy ?? "00"}-${mm}`;
}

export function parseRetailRows(raw: unknown[][]): RetailRow[] {
  const rows: RetailRow[] = [];

  for (const r of raw) {
    const month = monthLabel(r[0]);
    const outlet = text(r[1]);
    // Skip blank rows in the pre-filled formula buffer
    if (!month || !outlet) continue;

    rows.push({
      month,
      monthKey: monthKey(month),
      outlet,
      region: text(r[2]),
      regionGroup: text(r[3]) as RetailRow["regionGroup"],
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