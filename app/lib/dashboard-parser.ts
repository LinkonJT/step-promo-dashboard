import type { ArticleRow, HeadlineNumbers } from "./dashboard-data";

// Turns "83,550" into 83550. Handles commas and blank cells.
function toNumber(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, "").trim();
  const value = Number(cleaned);
  return Number.isNaN(value) ? 0 : value;
}

/**
 * The headline block (Dashboard!B6:P8) comes back as two rows: labels, then
 * values — but merged cells in the sheet mean each real column is followed
 * by an empty padding cell. So "Balance to Ship" sits at index 0, its value
 * also at index 0 in the row below; "Ready Stock in BD" at index 2, and so on.
 *
 * Two columns — "Days — 8 hr" and "Days — with OT" — are deliberately
 * skipped. They're capacity estimates, not measured output, and were
 * excluded from the dashboard for that reason (see build log).
 */
export function parseHeadline(headlineRaw: string[][]): HeadlineNumbers {
  const [, values] = headlineRaw;

  return {
    balanceToShip: toNumber(values?.[0]),
    readyStock: toNumber(values?.[2]),
    needToMake: toNumber(values?.[4]),
    fabricRequired: toNumber(values?.[6]),
    // index 8 = Days 8hr, index 10 = Days with OT — intentionally unused
    shippableNow: toNumber(values?.[12]),
    surplusStock: toNumber(values?.[14]),
  };
}

/**
 * The article block (Dashboard!B20:J30) is a normal, ungapped table:
 * Article, Balance, Ready Stock, Surplus, Need to Make, Fabric +5% (yd),
 * then three more columns (Days 8hr, Days OT, Rate/day) we don't use.
 * The last row is "TOTAL" — excluded here; the headline numbers are the
 * total, so this array should only ever contain the 9 real articles.
 */
export function parseArticles(articlesRaw: string[][]): ArticleRow[] {
  const [, ...rows] = articlesRaw; // drop header row

  return rows
    .filter((row) => row[0] && row[0] !== "TOTAL")
    .map((row) => ({
      article: row[0],
      balance: toNumber(row[1]),
      readyStock: toNumber(row[2]),
      surplus: toNumber(row[3]),
      needToMake: toNumber(row[4]),
      fabricRequired: toNumber(row[5]),
    }));
}