"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ArticleRow } from "../lib/dashboard-data";

const TEAL = "#0d9488";
const ORANGE = "#ea580c";
const PURPLE = "#8b5cf6";

// Shared tooltip styling — dark label, subtle border, no washed-out grey title.
const tooltipProps = {
  contentStyle: {
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
  },
  labelStyle: {
    color: "#111827",
    fontWeight: 600,
    marginBottom: "4px",
  },
  cursor: { fill: "rgba(255, 255, 255, 0.16)" },
};

export function DashboardCharts({ articles }: { articles: ArticleRow[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <ChartBox title="Need to Make by Article (pcs)">
        <BarChart data={articles} margin={{ bottom: 70, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="article"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} {...tooltipProps} />
          <Bar dataKey="needToMake" fill={TEAL} name="Need to Make" />
        </BarChart>
      </ChartBox>

      <ChartBox title="Balance vs Ready Stock vs Need to Make">
        <BarChart data={articles} margin={{ bottom: 90, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="article"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} {...tooltipProps} />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: 12, paddingTop: 20 }}
          />
          <Bar dataKey="balance" fill={TEAL} name="Balance" />
          <Bar dataKey="readyStock" fill={ORANGE} name="Ready Stock" />
          <Bar dataKey="needToMake" fill={PURPLE} name="Need to Make" />
        </BarChart>
      </ChartBox>

      <ChartBox title="Fabric Requirement by Article (+5%, yards)" wide>
        <BarChart
          data={[...articles].sort((a, b) => a.fabricRequired - b.fabricRequired)}
          layout="vertical"
          margin={{ left: 20, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="article"
            width={85}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v) => `${Number(v).toLocaleString()} yd`}
            {...tooltipProps}
          />
          <Bar dataKey="fabricRequired" fill={TEAL} name="Fabric (yd)" />
        </BarChart>
      </ChartBox>
    </div>
  );
}

function ChartBox({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactElement;
  wide?: boolean;
}) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="text-sm font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={380}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}