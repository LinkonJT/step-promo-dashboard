"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  MonthlyPoint,
  OutletPoint,
  RegionMonthPoint,
} from "../lib/retail-calcs";

const TEAL = "#0d9488";
const ORANGE = "#ea580c";
const PURPLE = "#8b5cf6";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#f59e0b";

const AXIS_TICK = { fontSize: 11, fill: "#d1d5db" };
const AXIS_TICK_SM = { fontSize: 10, fill: "#d1d5db" };

const tooltipProps = {
  contentStyle: {
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
  },
  labelStyle: { color: "#111827", fontWeight: 600, marginBottom: "4px" },
  cursor: { fill: "rgba(255, 255, 255, 0.16)" },
};

const lakh = (v: number) => `${(v / 100000).toFixed(0)}L`;
const bdt = (v: number) => `৳${Number(v).toLocaleString()}`;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const pctAxis = (v: number) => `${(v * 100).toFixed(0)}%`;

/* ============================================================
   EXISTING CHARTS — unchanged except for subtitles
   ============================================================ */

export function MonthlyChart({
  data,
  mode,
}: {
  data: MonthlyPoint[];
  mode: "bdt" | "pct";
}) {
  return (
    <ChartBox
      title={
        mode === "bdt"
          ? "Target vs Actual Sales by Month"
          : "Target Achievement % by Month"
      }
      subtitle="How close monthly sales came to the target set"
      wide
    >
      {mode === "bdt" ? (
        <BarChart data={data} margin={{ bottom: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={AXIS_TICK} />
          <YAxis tickFormatter={lakh} tick={AXIS_TICK} />
          <Tooltip formatter={(v) => bdt(Number(v))} {...tooltipProps} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="target" fill={PURPLE} name="Target" />
          <Bar dataKey="actual" fill={TEAL} name="Actual" />
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ bottom: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={AXIS_TICK} />
          <YAxis tickFormatter={pctAxis} tick={AXIS_TICK} domain={[0, "auto"]} />
          <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
          <ReferenceLine y={1} stroke={GREEN} strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="achievementPct"
            stroke={TEAL}
            strokeWidth={2}
            name="Achievement %"
            dot={{ r: 3 }}
          />
        </LineChart>
      )}
    </ChartBox>
  );
}

export function MarginTrendChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <ChartBox
      title="Net Profit Margin % by Month"
      subtitle="How much of each taka in sales became profit"
    >
      <LineChart data={data} margin={{ bottom: 10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={AXIS_TICK} />
        <YAxis tickFormatter={pctAxis} tick={AXIS_TICK} />
        <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
        <Line
          type="monotone"
          dataKey="marginPct"
          stroke={ORANGE}
          strokeWidth={2}
          name="Net Margin %"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartBox>
  );
}

export function OutletProfitChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data].sort((a, b) => b.netProfit - a.netProfit);
  return (
    <ChartBox
      title="Net Profit by Outlet (YTD)"
      subtitle="Which outlets bring the most money after all costs"
      wide
      tall
    >
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={lakh} tick={AXIS_TICK} />
        <YAxis type="category" dataKey="outlet" width={150} tick={AXIS_TICK_SM} />
        <Tooltip formatter={(v) => bdt(Number(v))} {...tooltipProps} />
        <Bar dataKey="netProfit" name="Net Profit">
          {sorted.map((d) => (
            <Cell key={d.outlet} fill={d.netProfit < 0 ? RED : TEAL} />
          ))}
        </Bar>
      </BarChart>
    </ChartBox>
  );
}

export function OutletAchievementChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data].sort((a, b) => b.achievementPct - a.achievementPct);
  return (
    <ChartBox
      title="Target Achievement % by Outlet (YTD)"
      subtitle="Which outlets hit their sales target, best to worst"
      wide
      tall
    >
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={pctAxis} tick={AXIS_TICK} />
        <YAxis type="category" dataKey="outlet" width={150} tick={AXIS_TICK_SM} />
        <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
        <ReferenceLine x={1} stroke={GREEN} strokeDasharray="4 4" />
        <Bar dataKey="achievementPct" name="Achievement %">
          {sorted.map((d) => (
            <Cell
              key={d.outlet}
              fill={
                d.achievementPct >= 1
                  ? GREEN
                  : d.achievementPct >= 0.8
                    ? TEAL
                    : ORANGE
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartBox>
  );
}

/* ============================================================
   NEW — region comparison (filter-independent)
   ============================================================ */

export function RegionSalesChart({ data }: { data: RegionMonthPoint[] }) {
  return (
    <ChartBox
      title="Dhaka vs Outside Dhaka — Sales by Month"
      subtitle="Which region carries the business, month to month"
      wide
      note="Always shows both regions, regardless of the filter above"
    >
      <BarChart data={data} margin={{ bottom: 10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={AXIS_TICK} />
        <YAxis tickFormatter={lakh} tick={AXIS_TICK} />
        <Tooltip formatter={(v) => bdt(Number(v))} {...tooltipProps} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="dhaka" fill={TEAL} name="Dhaka" />
        <Bar dataKey="outside" fill={ORANGE} name="Outside Dhaka" />
      </BarChart>
    </ChartBox>
  );
}

export function RegionMarginChart({ data }: { data: RegionMonthPoint[] }) {
  return (
    <ChartBox
      title="Dhaka vs Outside Dhaka — Net Margin %"
      subtitle="Where each taka of sales turns into the most profit"
      wide
      note="Always shows both regions, regardless of the filter above"
    >
      <LineChart data={data} margin={{ bottom: 10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={AXIS_TICK} />
        <YAxis tickFormatter={pctAxis} tick={AXIS_TICK} />
        <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="dhakaMargin"
          stroke={TEAL}
          strokeWidth={2}
          name="Dhaka"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="outsideMargin"
          stroke={ORANGE}
          strokeWidth={2}
          name="Outside Dhaka"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartBox>
  );
}

/* ============================================================
   NEW — outlet margin, expense ratio, consistency
   ============================================================ */

export function OutletMarginChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data].sort((a, b) => b.marginPct - a.marginPct);
  return (
    <ChartBox
      title="Net Margin % by Outlet (YTD)"
      subtitle="Which outlets are best run — not just the biggest"
      wide
      tall
      note="Hover to see sales volume — a high margin on tiny sales is not the same as a high margin on big sales"
    >
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={pctAxis} tick={AXIS_TICK} />
        <YAxis type="category" dataKey="outlet" width={150} tick={AXIS_TICK_SM} />
        <Tooltip
          {...tooltipProps}
          formatter={(v, _name, item) => [
            `${pct(Number(v))}  ·  sales ${bdt(item.payload.actual)}`,
            "Net Margin",
          ]}
        />
        <Bar dataKey="marginPct" name="Net Margin %">
          {sorted.map((d) => (
            <Cell key={d.outlet} fill={d.marginPct < 0 ? RED : PURPLE} />
          ))}
        </Bar>
      </BarChart>
    </ChartBox>
  );
}

export function ExpenseRatioChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data].sort((a, b) => b.expenseRatio - a.expenseRatio);
  return (
    <ChartBox
      title="Expenses as % of Sales (YTD)"
      subtitle="Who's close to the 40% line where profit turns to loss"
      wide
      tall
      note="Gross profit is a flat 40% of sales, so any outlet above the dashed line is losing money"
    >
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={pctAxis} tick={AXIS_TICK} />
        <YAxis type="category" dataKey="outlet" width={150} tick={AXIS_TICK_SM} />
        <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
        <ReferenceLine x={0.4} stroke={RED} strokeDasharray="4 4" />
        <Bar dataKey="expenseRatio" name="Expense Ratio">
          {sorted.map((d) => (
            <Cell
              key={d.outlet}
              fill={
                d.expenseRatio >= 0.4
                  ? RED
                  : d.expenseRatio >= 0.35
                    ? AMBER
                    : TEAL
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartBox>
  );
}

export function LossMonthsChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data]
    .filter((d) => d.lossMonths > 0)
    .sort((a, b) => b.lossMonths - a.lossMonths);

  if (sorted.length === 0) {
    return (
      <ChartBox
        title="Loss-Making Months by Outlet"
        subtitle="Who's steadily weak versus one-off lucky"
        wide
      >
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-gray-400">
            No outlet posted a loss in this selection.
          </p>
        </div>
      </ChartBox>
    );
  }

  return (
    <ChartBox
      title="Loss-Making Months by Outlet"
      subtitle="Who's steadily weak versus one-off lucky"
      wide
      note="Only outlets with at least one loss month are shown"
    >
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
        <YAxis type="category" dataKey="outlet" width={150} tick={AXIS_TICK_SM} />
        <Tooltip
          {...tooltipProps}
          formatter={(v) => [`${v} month${Number(v) === 1 ? "" : "s"}`, "Loss"]}
        />
        <Bar dataKey="lossMonths" name="Loss Months">
          {sorted.map((d) => (
            <Cell
              key={d.outlet}
              fill={d.lossMonths >= 4 ? RED : d.lossMonths >= 2 ? AMBER : TEAL}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartBox>
  );
}

/* ============================================================
   Shared container
   ============================================================ */

function ChartBox({
  title,
  subtitle,
  note,
  children,
  wide,
  tall,
}: {
  title: string;
  subtitle?: string;
  note?: string;
  children: React.ReactElement;
  wide?: boolean;
  tall?: boolean;
}) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 ${wide ? "lg:col-span-2" : ""}`}
    >
      <h3 className="text-sm font-semibold text-center">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-center text-xs text-gray-400">{subtitle}</p>
      )}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={tall ? 620 : 340}>
          {children}
        </ResponsiveContainer>
      </div>
      {note && (
        <p className="mt-3 text-center text-[11px] italic text-gray-500">{note}</p>
      )}
    </div>
  );
}