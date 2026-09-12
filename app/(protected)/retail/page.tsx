"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { RetailData } from "../../lib/retail-types";
import {
  computeKpis,
  filterByGroup,
  monthlySeries,
  outletSeries,
  regionMonthlySeries,
} from "../../lib/retail-calcs";
import {
  MonthlyChart,
  MarginTrendChart,
  OutletProfitChart,
  OutletAchievementChart,
  RegionSalesChart,
  RegionMarginChart,
  OutletMarginChart,
  ExpenseRatioChart,
  LossMonthsChart,
} from "../../components/RetailCharts";

async function fetchRetail(): Promise<RetailData> {
  const res = await fetch("/api/retail");
  if (!res.ok) throw new Error("Failed to load retail data");
  return res.json();
}

const GROUPS = ["All", "Dhaka", "Outside Dhaka"] as const;

export default function RetailPage() {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("All");
  const [chartMode, setChartMode] = useState<"bdt" | "pct">("bdt");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["retail-dashboard"],
    queryFn: fetchRetail,
  });

  const loadedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  });

  if (isPending) {
    return (
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <p className="text-gray-400">Loading retail data…</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <p className="text-red-400">
          Couldn&apos;t load retail data: {error.message}
        </p>
      </main>
    );
  }

  // Filtered set — drives KPIs and every outlet-level chart.
  const rows = filterByGroup(data.rows, group);
  const kpis = computeKpis(rows);
  const monthly = monthlySeries(rows, data.months);
  const outlets = outletSeries(rows);

  // Unfiltered set — the two region-comparison charts always show both
  // regions, otherwise picking one would collapse the comparison.
  const regionMonthly = regionMonthlySeries(data.rows, data.months);

  const latestMonth = data.months[data.months.length - 1];

  const stats = [
    { label: "Actual Sales", value: `৳${kpis.actual.toLocaleString()}`, sub: "YTD" },
    { label: "Net Profit", value: `৳${kpis.netProfit.toLocaleString()}`, sub: "YTD" },
    {
      label: "Achievement",
      value: `${(kpis.achievementPct * 100).toFixed(1)}%`,
      sub: "actual / target",
    },
    {
      label: "Net Margin",
      value: `${(kpis.marginPct * 100).toFixed(1)}%`,
      sub: "profit / sales",
    },
  ];

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Retail Sales Dashboard</h1>
        <p className="text-sm text-gray-300 mt-1">
          Step Own Outlets · {data.months[0]} to {latestMonth} 2026
        </p>
        <p className="text-xs text-gray-400 mt-2">Page loaded: {loadedAt}</p>
      </div>

      {/* Region filter */}
      <div>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`px-4 py-1.5 rounded-md text-sm border transition ${
                group === g
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "border-gray-500 text-gray-300 hover:bg-white/5"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Filters the headline numbers and all outlet charts. The two
          Dhaka-vs-Outside comparison charts always show both.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-gray-200 rounded-lg p-4 text-center flex flex-col items-center justify-center"
          >
            <p className="text-sm text-gray-200">{s.label}</p>
            <p className="text-xl font-bold mt-1 break-all">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 1. Big picture — region comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RegionSalesChart data={regionMonthly} />
        <RegionMarginChart data={regionMonthly} />
      </div>

      {/* 2. Monthly performance */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setChartMode("bdt")}
          className={`px-3 py-1 rounded text-xs border transition ${
            chartMode === "bdt"
              ? "bg-teal-600 border-teal-600 text-white"
              : "border-gray-500 text-gray-300 hover:bg-white/5"
          }`}
        >
          BDT
        </button>
        <button
          onClick={() => setChartMode("pct")}
          className={`px-3 py-1 rounded text-xs border transition ${
            chartMode === "pct"
              ? "bg-teal-600 border-teal-600 text-white"
              : "border-gray-500 text-gray-300 hover:bg-white/5"
          }`}
        >
          Achievement %
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyChart data={monthly} mode={chartMode} />
        <MarginTrendChart data={monthly} />
      </div>

      {/* 3. Outlet rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OutletProfitChart data={outlets} />
        <OutletMarginChart data={outlets} />
        <OutletAchievementChart data={outlets} />
      </div>

      {/* 4. Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpenseRatioChart data={outlets} />
        <LossMonthsChart data={outlets} />
      </div>

      <p className="text-xs text-gray-500 text-center">
        Data reads live from Google Sheets · Gross Profit calculated at 40% of sales
      </p>
    </main>
  );
}