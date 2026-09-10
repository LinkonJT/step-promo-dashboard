"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint, OutletPoint } from "../lib/retail-calcs";

const TEAL = "#0d9488";
const ORANGE = "#ea580c";
const PURPLE = "#8b5cf6";
const RED = "#dc2626";
const GREEN = "#16a34a";

const tooltipProps = {
  contentStyle: {
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
  },
  labelStyle: { color: "#111827", fontWeight: 600, marginBottom: "4px" },
  cursor: { fill: "rgba(255, 255, 255, 0.16)" },
};

// BDT in lakh for axis readability: 13,389,051 → "134L"
const lakh = (v: number) => `${(v / 100000).toFixed(0)}L`;
const bdt = (v: number) => `৳${Number(v).toLocaleString()}`;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

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
      wide
    >
      {mode === "bdt" ? (
        <BarChart data={data} margin={{ bottom: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={lakh} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => bdt(Number(v))} {...tooltipProps} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="target" fill={PURPLE} name="Target" />
          <Bar dataKey="actual" fill={TEAL} name="Actual" />
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ bottom: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 11 }}
            domain={[0, "auto"]}
          />
          <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
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
    <ChartBox title="Net Profit Margin % by Month">
      <LineChart data={data} margin={{ bottom: 10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fontSize: 11 }}
        />
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

// Ranked outlets by net profit — colour flips red when negative.
export function OutletProfitChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data].sort((a, b) => b.netProfit - a.netProfit);
  return (
    <ChartBox title="Net Profit by Outlet (YTD)" wide tall>
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={lakh} tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="outlet"
          width={130}
          tick={{ fontSize: 10 }}
        />
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

// Ranked outlets by target achievement — green above 100%, red below the group line.
export function OutletAchievementChart({ data }: { data: OutletPoint[] }) {
  const sorted = [...data].sort((a, b) => b.achievementPct - a.achievementPct);
  return (
    <ChartBox title="Target Achievement % by Outlet (YTD)" wide tall>
      <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="outlet"
          width={130}
          tick={{ fontSize: 10 }}
        />
        <Tooltip formatter={(v) => pct(Number(v))} {...tooltipProps} />
        <Bar dataKey="achievementPct" name="Achievement %">
          {sorted.map((d) => (
            <Cell
              key={d.outlet}
              fill={d.achievementPct >= 1 ? GREEN : d.achievementPct >= 0.8 ? TEAL : ORANGE}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartBox>
  );
}

function ChartBox({
  title,
  children,
  wide,
  tall,
}: {
  title: string;
  children: React.ReactElement;
  wide?: boolean;
  tall?: boolean;
}) {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${wide ? "lg:col-span-2" : ""}`}>
      <h3 className="text-sm font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={tall ? 620 : 340}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}