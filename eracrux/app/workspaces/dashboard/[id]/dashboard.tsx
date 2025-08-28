"use client";

import { useEffect, useState } from "react";
import { parseAndCleanCSV } from "@/lib/csv";
// import KPI from "@/components/KPI";
import UniversalAreaChart from "@/components/charts/area-chart";
import ChartBarMultiple from "@/components/charts/bar-chart";
import CustomPieChart from "@/components/charts/pie-chart";
// import MapView from "@/components/MapView";

export default function Dashboard({ id }: { id: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/uploads/${id}.csv`);
        const csv = await res.text();
        const parsed = parseAndCleanCSV(csv);
        console.log(id)
        console.log("Parsed Data:", parsed);
        setData(parsed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data.length) return <p>No data available</p>;

  return (
    <div className="space-y-6 p-4 w-full max-w-7xl mx-auto">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="space-y-4">
        {/* Area chart spanning full width */}
        <div className="w-full">
          <UniversalAreaChart data={data} title="🗠 Area Performance Analytics" height={400} />
        </div>
        
        {/* Bar charts in a row below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartBarMultiple data={data}/>
          <CustomPieChart data={data}  showPercentages= {false} />
        </div>
      </div>
    </div>
  );
}