import type { RetailRow } from "./retail-types";

export type MonthlyPoint = {
  month: string;
  target: number;
  actual: number;
  netProfit: number;
  grossProfit: number;
  expenses: number;
  achievementPct: number;
  marginPct: number;
  lossOutlets: number;
};

export type OutletPoint = {
  outlet: string;
  regionGroup: string;
  target: number;
  actual: number;
  netProfit: number;
  achievementPct: number;
  marginPct: number;
  expenseRatio: number;
  lossMonths: number;
};

export type Kpis = {
  actual: number;
  netProfit: number;
  achievementPct: number;
  marginPct: number;
  target: number;
  grossProfit: number;
};

// --- Filter helpers ---
export function filterByGroup(rows: RetailRow[], group: string): RetailRow[] {
  if (group === "All") return rows;
  return rows.filter((r) => r.regionGroup === group);
}

// --- Headline KPIs across whatever rows are passed in ---
export function computeKpis(rows: RetailRow[]): Kpis {
  const target = sum(rows, "targetSale");
  const actual = sum(rows, "actualSale");
  const grossProfit = sum(rows, "grossProfit");
  const netProfit = sum(rows, "netProfit");
  return {
    target,
    actual,
    grossProfit,
    netProfit,
    // Ratios computed from summed totals — never averaged. Averaging
    // percentages across outlets is the mistake the Power BI card made.
    achievementPct: target ? actual / target : 0,
    marginPct: actual ? netProfit / actual : 0,
  };
}

// --- One point per month, in calendar order ---
export function monthlySeries(rows: RetailRow[], months: string[]): MonthlyPoint[] {
  return months.map((m) => {
    const mr = rows.filter((r) => r.month === m);
    const target = sum(mr, "targetSale");
    const actual = sum(mr, "actualSale");
    const netProfit = sum(mr, "netProfit");
    return {
      month: m,
      target,
      actual,
      netProfit,
      grossProfit: sum(mr, "grossProfit"),
      expenses: sum(mr, "totalExpenses"),
      achievementPct: target ? actual / target : 0,
      marginPct: actual ? netProfit / actual : 0,
      lossOutlets: mr.filter((r) => r.netProfit < 0).length,
    };
  });
}

// --- One point per outlet, aggregated across all months in `rows` ---
export function outletSeries(rows: RetailRow[]): OutletPoint[] {
  const names = [...new Set(rows.map((r) => r.outlet))];
  return names.map((name) => {
    const or = rows.filter((r) => r.outlet === name);
    const target = sum(or, "targetSale");
    const actual = sum(or, "actualSale");
    const netProfit = sum(or, "netProfit");
    const expenses = sum(or, "totalExpenses");
    return {
      outlet: name,
      regionGroup: or[0]?.regionGroup ?? "",
      target,
      actual,
      netProfit,
      achievementPct: target ? actual / target : 0,
      marginPct: actual ? netProfit / actual : 0,
      // GP is a flat 40%, so an outlet loses money exactly when
      // its expenses exceed 40% of sales. This ratio is the tell.
      expenseRatio: actual ? expenses / actual : 0,
      lossMonths: or.filter((r) => r.netProfit < 0).length,
    };
  });
}

function sum(rows: RetailRow[], key: keyof RetailRow): number {
  return rows.reduce((acc, r) => acc + (r[key] as number), 0);
}