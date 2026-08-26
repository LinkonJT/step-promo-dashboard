"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

export function DashboardCharts({ articles }: { articles: ArticleRow[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* 1. Need to Make — the bottleneck view */}
      <ChartBox title="Need to Make by Article (pcs)">
        <BarChart data={articles} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="article"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} />
          <Bar dataKey="needToMake" fill={TEAL} name="Need to Make" />
        </BarChart>
      </ChartBox>

      {/* 2. Balance vs Ready Stock vs Need to Make */}
      <ChartBox title="Balance vs Ready Stock vs Need to Make">
        <BarChart data={articles} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="article"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="balance" fill={TEAL} name="Balance" />
          <Bar dataKey="readyStock" fill={ORANGE} name="Ready Stock" />
          <Bar dataKey="needToMake" fill={PURPLE} name="Need to Make" />
        </BarChart>
      </ChartBox>

      {/* 3. Fabric share — horizontal, sorted, so the concentration is obvious */}
      <ChartBox title="Fabric Requirement by Article (+5%, yards)" wide>
        <BarChart
          data={[...articles].sort((a, b) => a.fabricRequired - b.fabricRequired)}
          layout="vertical"
          margin={{ left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="article"
            width={80}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(v) => `${Number(v).toLocaleString()} yd`} />
          <Bar dataKey="fabricRequired" fill={TEAL} name="Fabric (yd)">
            {articles.map((row) => (
              <Cell key={row.article} />
            ))}
          </Bar>
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
      <ResponsiveContainer width="100%" height={320}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}