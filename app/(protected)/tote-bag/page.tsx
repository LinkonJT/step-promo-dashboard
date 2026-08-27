// import { DashboardCharts } from "../../components/DashboardCharts";
// import { articles, headline } from "../../lib/dashboard-data";

// const stats = [
//   { label: "Balance to Ship", value: headline.balanceToShip, unit: "pcs" },
//   { label: "Ready Stock in BD", value: headline.readyStock, unit: "pcs" },
//   { label: "Need to Make", value: headline.needToMake, unit: "pcs" },
//   { label: "Fabric Req. (+5%)", value: headline.fabricRequired, unit: "yards" },
//   { label: "Allocated to PO's", value: headline.shippableNow, unit: "pcs" },
//   { label: "Surplus Stock", value: headline.surplusStock, unit: "pcs" },
// ];

// export default function ToteBagPage() {

// const loadedAt = new Date().toLocaleString("en-GB", {
//     dateStyle: "medium",
//     timeStyle: "short",
//     timeZone: "Asia/Dhaka",
//   });

//   return (
//     <main className="px-6 py-10 max-w-6xl mx-auto flex flex-col gap-10">
//       <div>
//         <h1 className="text-2xl font-bold">Tote Bag Production</h1>
//         <p className="text-sm text-gray-300 mt-1">
//           PO# IDBD02 / FO-315688A / FO-315701A
//         </p>
//            <p className="text-xs text-gray-300 mt-2">Table Updated Till: 26 Aug 2026</p>
//         <p className="text-xs text-gray-400 mt-2">Page loaded: {loadedAt}</p>
//       </div>

//       {/* Headline numbers */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="border border-gray-200 rounded-lg p-3 text-center aspect-square md:aspect-auto flex flex-col items-center justify-center"
//           >
//             <p className="text-sm text-gray-200">{stat.label}</p>
//             <p className="text-xl font-bold mt-1">
//               {stat.value.toLocaleString()}
//             </p>
//             <p className="text-xs text-gray-400">{stat.unit}</p>
//           </div>
//         ))}
//       </div>

//       {/* Per-article table */}
//       <div className="overflow-x-auto w-full max-w-full">
//         <table className="w-full text-sm border-collapse">
//           <thead>
//             <tr className="border-b border-gray-300 text-left">
//               <th className="py-2 pr-4">Article</th>
//               <th className="py-2 pr-4 text-right">Balance</th>
//               <th className="py-2 pr-4 text-right">Ready Stock</th>
//               <th className="py-2 pr-4 text-right">Surplus</th>
//               <th className="py-2 pr-4 text-right">Need to Make</th>
//               <th className="py-2 text-right">Fabric +5% (yd)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {articles.map((row) => (
//               <tr key={row.article} className="border-b border-gray-100">
//                 <td className="py-2 pr-4 font-medium">{row.article}</td>
//                 <td className="py-2 pr-4 text-right">{row.balance.toLocaleString()}</td>
//                 <td className="py-2 pr-4 text-right">{row.readyStock.toLocaleString()}</td>
//                 <td className="py-2 pr-4 text-right">{row.surplus.toLocaleString()}</td>
//                 <td className="py-2 pr-4 text-right">{row.needToMake.toLocaleString()}</td>
//                 <td className="py-2 text-right">
//                   {row.fabricRequired.toLocaleString(undefined, {
//                     maximumFractionDigits: 1,
//                   })}
//                 </td>
//               </tr>
//             ))}
//             <tr className="border-t-2 border-gray-400 font-semibold">
//               <td className="py-2 pr-4">TOTAL</td>
//               <td className="py-2 pr-4 text-right">{headline.balanceToShip.toLocaleString()}</td>
//               <td className="py-2 pr-4 text-right">{headline.readyStock.toLocaleString()}</td>
//               <td className="py-2 pr-4 text-right">{headline.surplusStock.toLocaleString()}</td>
//               <td className="py-2 pr-4 text-right">{headline.needToMake.toLocaleString()}</td>
//               <td className="py-2 text-right">{headline.fabricRequired.toLocaleString()}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <DashboardCharts articles={articles} />
//     </main>
//   );
// }

"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardCharts } from "../../components/DashboardCharts";
import { parseArticles, parseHeadline } from "../../lib/dashboard-parser";

type RawDashboardResponse = {
  headlineRaw: string[][];
  articlesRaw: string[][];
};

async function fetchDashboard(): Promise<RawDashboardResponse> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}

export default function ToteBagPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["tote-bag-dashboard"],
    queryFn: fetchDashboard,
  });

  const loadedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  });

  if (isPending) {
    return (
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <p className="text-gray-400">Loading production data…</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <p className="text-red-400">
          Couldn&apos;t load dashboard data: {error.message}
        </p>
      </main>
    );
  }

  const headline = parseHeadline(data.headlineRaw);
  const articles = parseArticles(data.articlesRaw);

  const stats = [
    { label: "Balance to Ship", value: headline.balanceToShip, unit: "pcs" },
    { label: "Ready Stock in BD", value: headline.readyStock, unit: "pcs" },
    { label: "Need to Make", value: headline.needToMake, unit: "pcs" },
    { label: "Fabric Req. (+5%)", value: headline.fabricRequired, unit: "yards" },
    { label: "Shippable Now", value: headline.shippableNow, unit: "pcs" },
    { label: "Surplus Stock", value: headline.surplusStock, unit: "pcs" },
  ];

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">Tote Bag Production</h1>
        <p className="text-sm text-gray-300 mt-1">
          PO# IDBD02 / FO-315688A / FO-315701A
        </p>
         <p className="text-sm text-gray-300 mt-1">
          Updated Till: 26 Aug 2026
        </p>
        <p className="text-xs text-gray-400 mt-2">Page loaded: {loadedAt}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-gray-200 rounded-lg p-3 text-center aspect-square md:aspect-auto flex flex-col items-center justify-center"
          >
            <p className="text-sm text-gray-200">{stat.label}</p>
            <p className="text-xl font-bold mt-1">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{stat.unit}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2 pr-4">Article</th>
              <th className="py-2 pr-4 text-right">Balance</th>
              <th className="py-2 pr-4 text-right">Ready Stock</th>
              <th className="py-2 pr-4 text-right">Surplus</th>
              <th className="py-2 pr-4 text-right">Need to Make</th>
              <th className="py-2 text-right">Fabric +5% (yd)</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((row) => (
              <tr key={row.article} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">{row.article}</td>
                <td className="py-2 pr-4 text-right">{row.balance.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right">{row.readyStock.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right">{row.surplus.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right">{row.needToMake.toLocaleString()}</td>
                <td className="py-2 text-right">
                  {row.fabricRequired.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-400 font-semibold">
              <td className="py-2 pr-4">TOTAL</td>
              <td className="py-2 pr-4 text-right">{headline.balanceToShip.toLocaleString()}</td>
              <td className="py-2 pr-4 text-right">{headline.readyStock.toLocaleString()}</td>
              <td className="py-2 pr-4 text-right">{headline.surplusStock.toLocaleString()}</td>
              <td className="py-2 pr-4 text-right">{headline.needToMake.toLocaleString()}</td>
              <td className="py-2 text-right">{headline.fabricRequired.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DashboardCharts articles={articles} />
    </main>
  );
}