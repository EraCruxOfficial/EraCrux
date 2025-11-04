"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

interface DataPoint {
  [key: string]: any;
}

interface Props {
  data: DataPoint[];
  title?: string;
}

export default function KpiDashboard({ data, title = "Key Performance Indicators" }: Props) {
  const [selectedMetric, setSelectedMetric] = React.useState<string>("");
  const [numericColumns, setNumericColumns] = React.useState<string[]>([]);
  const [stats, setStats] = React.useState<any>(null);

  // Detect numeric columns
  React.useEffect(() => {
    if (!data || data.length === 0) return;

    const columns = Object.keys(data[0]);
    const numericCols = columns.filter(col => {
      return data.some(row => {
        const val = parseFloat(row[col]);
        return !isNaN(val) && isFinite(val);
      });
    });

    setNumericColumns(numericCols);
    if (numericCols.length > 0 && !selectedMetric) {
      setSelectedMetric(numericCols[0]);
    }
  }, [data]);

  // Compute KPI stats
  React.useEffect(() => {
    if (!selectedMetric || data.length === 0) return;

    const values = data
      .map(row => parseFloat(row[selectedMetric]))
      .filter(v => !isNaN(v));

    if (values.length === 0) {
      setStats(null);
      return;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const count = values.length;
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
    const stdDev = Math.sqrt(
      values.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b, 0) / values.length
    );

    setStats({ sum, avg, max, min, count, median, stdDev });
  }, [selectedMetric, data]);

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm border rounded-lg">
        No data available to show KPIs
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {numericColumns.length > 0 && (
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[220px] border border-gray-200 dark:border-gray-700 bg-transparent">
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
              {numericColumns.map(col => (
                <SelectItem key={col} value={col}>
                  {formatLabel(col)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats ? (
          <>
            <KpiCard label="Sum" value={formatNumber(stats.sum)} />
            <KpiCard label="Average" value={formatNumber(stats.avg)} />
            <KpiCard label="Max" value={formatNumber(stats.max)} />
            <KpiCard label="Min" value={formatNumber(stats.min)} />
            {/* <KpiCard label="Median" value={formatNumber(stats.median)} />
            <KpiCard label="Std Dev" value={formatNumber(stats.stdDev)} /> */}
            <KpiCard label="Count" value={stats.count.toLocaleString()} />
          </>
        ) : (
          <p className="col-span-full text-gray-500 text-sm">
            No numeric data available for {selectedMetric}
          </p>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

// Utility functions
function formatNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (Math.abs(num) >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toFixed(2);
}

function formatLabel(key: string): string {
  return key
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}
