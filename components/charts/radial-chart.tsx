"use client";

import * as React from "react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ChevronDown, Check } from "lucide-react";
import { DownloadChartButton } from "@/components/charts/DownloadChartButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const COLOR_PALETTE = [
  "#1E90FF", // Dodger Blue
  "#00BFFF", // Deep Sky Blue
  "#4682B4", // Steel Blue
  "#5F9EA0", // Cadet Blue
  "#6495ED", // Cornflower Blue
  "#4169E1", // Royal Blue
  "#87CEEB", // Sky Blue
  "#6CA0DC", // Medium Light Blue
  "#7B68EE", // Medium Slate Blue
  "#3A75C4", // Blue Crayola
  "#00CED1", // Dark Turquoise (bluish tone)
  "#4686E7", // Soft Bright Blue
  "#4A90E2", // Calm Blue
  "#355C7D", // Muted Deep Blue
  "#0096FF", // Vivid Blue
  "#5DADE2", // Gentle Sky Blue
  "#1C86EE", // Bright Royal Blue
  "#73C2FB", // Light Azure
  "#0D47A1", // Deep Navy Blue
  "#82CAFF"  // Baby Blue
];


interface Props {
  data: any[];
  title?: string;
  description?: string;
  height?: number;
  showTrend?: boolean;
  showAxisSelector?: boolean;
}

export default function UniversalRadialChart({
  data = [],
  title = "Radial Chart Visualization",
  description,
  height = 350,
  showTrend = true,
  showAxisSelector = true,
}: Props) {
  const [selectedXAxis, setSelectedXAxis] = React.useState<string>("");
  const [selectedYKey, setSelectedYKey] = React.useState<string>("");
  const [availableColumns, setAvailableColumns] = React.useState<any[]>([]);

  const { processedData, chartConfig, xAxisKey, yKey, trendData } = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        processedData: [],
        chartConfig: {},
        xAxisKey: "",
        yKey: "",
        trendData: null,
      };
    }

    const columns = Object.keys(data[0]);
    const colAnalysis = analyzeColumns(data, columns);
    setAvailableColumns(colAnalysis);

    // Determine X-axis (categorical)
    let detectedXAxis = selectedXAxis;
    if (!detectedXAxis) {
      const catCols = colAnalysis.filter(
        (col) => col.type === "categorical" || col.type === "text"
      );
      detectedXAxis = catCols[0]?.name || columns[0];
      setSelectedXAxis(detectedXAxis);
    }

    // Determine Y-axis (numeric)
    let detectedYKey = selectedYKey;
    if (!detectedYKey) {
      const numCols = colAnalysis.filter((col) => col.type === "numeric");
      detectedYKey = numCols[0]?.name || columns.find((c) => c !== detectedXAxis) || "";
      setSelectedYKey(detectedYKey);
    }

    // Chart config
    const config: ChartConfig = {
      [detectedYKey]: {
        label: formatLabel(detectedYKey),
        color: COLOR_PALETTE[0],
      },
    };

    // Processed data
    // Sort and limit top 5
    const processed = data
      .map((row, i) => ({
        [detectedXAxis]: String(row[detectedXAxis] || `Item ${i + 1}`),
        [detectedYKey]: Number(row[detectedYKey]) || 0,
        fill: COLOR_PALETTE[i % COLOR_PALETTE.length],
      }))
      .sort(
        (a, b) =>
          Number(b[detectedYKey] ?? 0) - Number(a[detectedYKey] ?? 0)
      )// sort descending
      .slice(0, 10); // show only top 5


    const trend = calculateTrend(processed, detectedYKey);

    return {
      processedData: processed,
      chartConfig: config,
      xAxisKey: detectedXAxis,
      yKey: detectedYKey,
      trendData: trend,
    };
  }, [data, selectedXAxis, selectedYKey]);

  const handleXAxisChange = (value: string) => setSelectedXAxis(value);
  const handleYKeyChange = (value: string) => setSelectedYKey(value);
  const resetToDefaults = () => {
    setSelectedXAxis("");
    setSelectedYKey("");
  };

  const chartRef = React.useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">Please provide data to visualize</p>
        </CardContent>
      </Card>
    );
  }

  const dynamicDescription =
    description ||
    `Showing metric "${formatLabel(yKey)}" across ${processedData.length} categories`;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{dynamicDescription}</CardDescription>
        </div>
        <DownloadChartButton targetRef={chartRef} filename={title} />
      </CardHeader>

      {showAxisSelector && availableColumns.length > 0 && (
        <CardContent className="border-b p-4">
          <div className="grid gap-4 md:grid-cols-1">
            {/* X-Axis Selector */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                🧭 X-Axis (Categories)
              </label>
              <Select value={selectedXAxis} onValueChange={handleXAxisChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select X-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {formatLabel(col.name)}{" "}
                      <span className="text-xs text-gray-400">
                        ({col.type})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Y-Axis Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  📈 Metric
                </label>
                <div className="pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToDefaults}
                    className="text-xs h-6 px-2 shrink-0"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <Select value={selectedYKey} onValueChange={handleYKeyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Y-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns
                    .filter((col) => col.type === "numeric")
                    .map((col) => (
                      <SelectItem key={col.name} value={col.name}>
                        {formatLabel(col.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      )}

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          ref={chartRef}
          config={chartConfig}
          className="flex items-center justify-center w-full mx-auto aspect-square"
          style={{
            height: "auto",
            aspectRatio: "1 / 1",
            maxWidth: "100%",
            minHeight: "250px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={processedData}
              innerRadius="20%"
              outerRadius="100%"
              barSize={15}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey={xAxisKey}
                    formatter={(value: any, name?: any) =>
                      `${chartConfig[yKey]?.label || name}: ${formatTooltipValue(value)}`
                    }
                  />
                }
              />
              <RadialBar
                dataKey={yKey}
                background
                // fill={chartConfig[yKey]?.color}
                // fillOpacity={0.5}

                // stroke={chartConfig[yKey]?.color}
                fill={chartConfig[yKey]?.color}
              // fillOpacity={0.5}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      {showTrend && trendData && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            {trendData.isPositive ? (
              <>
                {trendData.message} <TrendingUp className="h-4 w-4" />
              </>
            ) : (
              <>
                {trendData.message} <TrendingDown className="h-4 w-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground leading-none">
            {trendData.description}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

/* ---------------- Helper Functions ---------------- */

function analyzeColumns(data: any[], columns: string[]) {
  return columns.map((name) => {
    const values = data
      .slice(0, 100)
      .map((r) => r[name])
      .filter((v) => v != null && v !== "");
    const numeric = values.filter((v) => !isNaN(parseFloat(v)));
    const numericRatio = numeric.length / values.length;
    const unique = new Set(values);
    const isBoolean =
      unique.size <= 2 &&
      Array.from(unique).every((v) =>
        ["true", "false", "yes", "no", "1", "0"].includes(String(v).toLowerCase())
      );

    let type: string = "text";
    if (numericRatio > 0.8) type = "numeric";
    else if (isBoolean || unique.size <= 10) type = "categorical";

    return { name, type, isBoolean, uniqueCount: unique.size };
  });
}

function calculateTrend(data: any[], yKey: string) {
  if (data.length < 2 || !yKey) return null;
  const values = data.map((d) => d[yKey] || 0);
  const half = Math.ceil(values.length / 2);
  const firstAvg = avg(values.slice(0, half));
  const secondAvg = avg(values.slice(half));
  const change = ((secondAvg - firstAvg) / (firstAvg || 1)) * 100;
  return {
    isPositive: change > 0,
    message:
      change > 0
        ? `Trending up by ${change.toFixed(1)}%`
        : `Trending down by ${Math.abs(change).toFixed(1)}%`,
    description: `Based on ${formatLabel(yKey)} across ${data.length} data points`,
  };
}

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

function formatTooltipValue(value: any) {
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
