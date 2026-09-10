export type RetailRow = {
  month: string;          // "Jan-26"
  monthKey: string;       // "2026-01" — for correct sorting
  outlet: string;
  region: string;
  regionGroup: "Dhaka" | "Outside Dhaka";
  targetSale: number;
  actualSale: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  achievementPct: number; // 0.913 = 91.3%
  netMarginPct: number;
};

export type RetailData = {
  rows: RetailRow[];
  months: string[];       // ordered, deduped
  outlets: string[];
  updatedAt: string;
};