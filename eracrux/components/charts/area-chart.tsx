"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Dynamic color palette for multiple series
const COLOR_PALETTE = [
  //   "hsl(var(--chart-1))",
  //   "hsl(var(--chart-2))",
  //   "hsl(var(--chart-3))",
  //   "hsl(var(--chart-4))",
  //   "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#87d068"
];

interface DataPoint {
  [key: string]: any;
}

interface Props {
  data: DataPoint[];
  xAxis?: string; // Which column to use for X-axis
  yKeys?: string[]; // Which columns to plot (auto-detect if not provided)
  showAxisSelector?: boolean; // Show axis selection controls
  title?: string;
  description?: string;
  timeRangeOptions?: string[]; // Custom time range options
  aggregationMethod?: 'sum' | 'average' | 'count' | 'max' | 'min';
  maxDataPoints?: number; // Limit data points for performance
  showLegend?: boolean;
  showTimeRange?: boolean;
  height?: number;
  stackedArea?: boolean; // Whether to stack areas or overlay them
  convertCategorical?: boolean; // Convert Yes/No to 1/0
}

export default function UniversalAreaChart({
  data = [],
  xAxis,
  yKeys,
  title = "📈 Data Visualization",
  description,
  timeRangeOptions = ["10", "25", "50", "all"],
  aggregationMethod = 'average',
  maxDataPoints = 1000,
  showLegend = true,
  showTimeRange = false,
  height = 300,
  stackedArea = false,
  showAxisSelector = true,
  convertCategorical = true
}: Props) {
  const [timeRange, setTimeRange] = React.useState(timeRangeOptions[timeRangeOptions.length - 1] || "all");
  const [selectedXAxis, setSelectedXAxis] = React.useState<string>(xAxis || "");
  const [selectedYKeys, setSelectedYKeys] = React.useState<string[]>(yKeys || []);
  const [availableColumns, setAvailableColumns] = React.useState<any[]>([]);

  // Handlers for axis selection
  const handleXAxisChange = (value: string) => {
    setSelectedXAxis(value);
  };

  const handleYKeyToggle = (key: string) => {
    setSelectedYKeys(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const resetToDefaults = () => {
    setSelectedXAxis("");
    setSelectedYKeys([]);
  };

  // Auto-detect data structure and types
  const { processedData, xAxisKey, numericKeys, chartConfig, columnAnalysis } = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { processedData: [], xAxisKey: '', numericKeys: [], chartConfig: {}, columnAnalysis: [] };
    }

    console.log("Input data sample:", data[0]);

    // Analyze all columns to understand data types
    const columns = Object.keys(data[0]);
    const colAnalysis = analyzeColumns(data, columns);

    console.log("Column analysis:", colAnalysis);

    // Set available columns for user selection
    setAvailableColumns(colAnalysis);

    // Determine X-axis (use user selection or auto-detect)
    let detectedXAxis = selectedXAxis || xAxis;
    if (!detectedXAxis) {
      // Auto-detect logic...
      const idColumns = colAnalysis.filter(col =>
        col.name.toLowerCase().includes('id') ||
        col.name.toLowerCase().includes('code')
      );

      if (idColumns.length > 0) {
        detectedXAxis = idColumns[0].name;
      } else {
        const categoricalCols = colAnalysis.filter(col =>
          col.type === 'categorical' || col.type === 'text'
        );
        detectedXAxis = categoricalCols.length > 0 ? categoricalCols[0].name : columns[0];
      }

      // Set the detected value in state
      if (!selectedXAxis) {
        setSelectedXAxis(detectedXAxis);
      }
    }

    // Determine Y-axis keys (use user selection or auto-detect)
    let finalNumericKeys = selectedYKeys.length > 0 ? selectedYKeys : (yKeys || []);
    if (finalNumericKeys.length === 0) {
      const numericColumns = colAnalysis.filter(col =>
        col.type === 'numeric' || (col.type === 'categorical' && col.isBoolean)
      );
      finalNumericKeys = numericColumns.slice(0, 8).map(col => col.name);

      // Set the detected values in state
      if (selectedYKeys.length === 0) {
        setSelectedYKeys(finalNumericKeys);
      }
    }

    console.log("Selected X-axis:", detectedXAxis);
    console.log("Selected Y-keys:", finalNumericKeys);

    // Create chart config
    const config: ChartConfig = {};
    finalNumericKeys.forEach((key, index) => {
      config[key] = {
        label: formatLabel(key),
        color: COLOR_PALETTE[index % COLOR_PALETTE.length]
      };
    });

    // Process and clean data
    let processedDataArray = data.map((row, index) => {
      const processedRow: any = {};

      // Process X-axis value
      let xValue = row[detectedXAxis];
      processedRow[detectedXAxis] = String(xValue || `Item ${index + 1}`);

      // Process all columns
      columns.forEach(key => {
        if (key === detectedXAxis) return; // Already processed

        let value = row[key];
        const colInfo = colAnalysis.find(col => col.name === key);

        if (finalNumericKeys.includes(key)) {
          processedRow[key] = convertToNumeric(value, colInfo, convertCategorical);
        }
      });

      // Keep original row for reference
      processedRow._original = row;
      processedRow._index = index;

      return processedRow;
    });

    console.log("Processed data sample:", processedDataArray[0]);

    // Apply aggregation if there are duplicate X-axis values
    if (aggregationMethod !== 'count') {
      processedDataArray = aggregateData(processedDataArray, detectedXAxis, finalNumericKeys, aggregationMethod);
    }

    // Limit data points for performance
    if (processedDataArray.length > maxDataPoints) {
      const step = Math.ceil(processedDataArray.length / maxDataPoints);
      processedDataArray = processedDataArray.filter((_, index) => index % step === 0);
    }

    return {
      processedData: processedDataArray,
      xAxisKey: detectedXAxis,
      numericKeys: finalNumericKeys,
      chartConfig: config,
      columnAnalysis: colAnalysis
    };
  }, [data, selectedXAxis, selectedYKeys, xAxis, yKeys, aggregationMethod, maxDataPoints, convertCategorical]);

  // Filter data based on range (for non-date data, this is just limiting items)
  const filteredData = React.useMemo(() => {
    if (!showTimeRange || timeRange === "all" || !processedData.length) {
      return processedData;
    }

    const limit = parseInt(timeRange) || processedData.length;
    return processedData.slice(0, limit);
  }, [processedData, timeRange, showTimeRange]);

  if (!data || data.length === 0) {
    return (
      <Card className="pt-0">
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

  const dynamicDescription = description ||
    `Showing ${numericKeys.length} metric${numericKeys.length !== 1 ? 's' : ''} across ${filteredData.length} data points${showTimeRange ? ` (${formatTimeRange(timeRange)})` : ''}`;

  return (
    <Card className="pt-0 w-full max-w-7xl mx-auto">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{dynamicDescription}</CardDescription>
        </div>

        {showTimeRange && timeRangeOptions.length > 1 && (
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-full sm:w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select range"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRangeOptions.map(option => (
                <SelectItem key={option} value={option} className="rounded-lg">
                  {formatTimeRange(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      {/* Axis Selection Controls */}
      {showAxisSelector && availableColumns.length > 0 && (
        <CardContent className="border-b p-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* X-Axis Selection */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  📊 X-Axis (Categories)
                </label>
              </div>
              <Select value={selectedXAxis} onValueChange={handleXAxisChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select X-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate flex-1">{formatLabel(col.name)}</span>
                        <span className="ml-2 text-xs text-gray-500 capitalize shrink-0">
                          {col.type}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Y-Axis Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700 truncate">
                  📈 Y-Axis (Metrics) - {selectedYKeys.length} selected
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="text-xs h-6 px-2 shrink-0"
                >
                  Reset
                </Button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {selectedYKeys.length > 0
                        ? `${selectedYKeys.length} metric${selectedYKeys.length > 1 ? 's' : ''} selected`
                        : "Select Y-axis columns"
                      }
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                  <div className="max-h-60 overflow-y-auto p-2">
                    {availableColumns
                      .filter(col => col.type === 'numeric' || (col.type === 'categorical' && col.isBoolean))
                      .map(col => (
                        <label key={col.name} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedYKeys.includes(col.name)}
                            onChange={() => handleYKeyToggle(col.name)}
                            className="rounded border-gray-300 shrink-0"
                          />
                          <span className="flex-1 truncate" title={formatLabel(col.name)}>
                            {formatLabel(col.name)}
                          </span>
                          {selectedYKeys.includes(col.name) && (
                            <Check className="h-3 w-3 text-green-600 shrink-0" />
                          )}
                        </label>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      )}

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className={`aspect-auto w-full`}
          style={{ height: `${height}px` }}
        >
          <AreaChart data={filteredData}>
            <defs>
              {numericKeys.map((key) => (
                <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig[key]?.color || COLOR_PALETTE[0]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[key]?.color || COLOR_PALETTE[0]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />

            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatXAxisTick(value)}
              angle={filteredData.length > 15 ? -45 : 0}
              textAnchor={filteredData.length > 15 ? "end" : "middle"}
              height={filteredData.length > 15 ? 80 : 50}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatYAxisTick(value)}
            />

            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => String(value)}
                  formatter={(value, name) => [
                    formatTooltipValue(value),
                    chartConfig[name as string]?.label || name
                  ]}
                  indicator="dot"
                />
              }
            />

            {numericKeys.map((key, index) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                fill={`url(#fill${key})`}
                stroke={chartConfig[key]?.color || COLOR_PALETTE[index]}
                strokeWidth={2}
                stackId={stackedArea ? "stack" : key}
                connectNulls={false}
              />
            ))}

            {showLegend && numericKeys.length > 1 && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Enhanced column analysis function
function analyzeColumns(data: any[], columns: string[]) {
  return columns.map(colName => {
    const values = data.slice(0, Math.min(100, data.length)).map(row => row[colName]).filter(v => v != null && v !== '');
    const sampleSize = values.length;

    if (sampleSize === 0) {
      return { name: colName, type: 'empty', isBoolean: false, uniqueCount: 0 };
    }

    // Count unique values
    const uniqueValues = new Set(values);
    const uniqueCount = uniqueValues.size;

    // Check if it's numeric
    const numericValues = values.filter(v => {
      const cleaned = String(v).replace(/[,$%]/g, '');
      return !isNaN(parseFloat(cleaned)) && isFinite(parseFloat(cleaned));
    });

    const numericRatio = numericValues.length / sampleSize;

    // Check if it's boolean-like categorical
    const booleanLike = uniqueCount <= 2 &&
      Array.from(uniqueValues).every(v =>
        ['yes', 'no', 'true', 'false', '1', '0', 'y', 'n'].includes(String(v).toLowerCase())
      );

    // Determine type
    let type: string;
    if (numericRatio > 0.8) {
      type = 'numeric';
    } else if (booleanLike || uniqueCount <= 10) {
      type = 'categorical';
    } else {
      type = 'text';
    }

    return {
      name: colName,
      type,
      isBoolean: booleanLike,
      uniqueCount,
      numericRatio,
      sampleValues: Array.from(uniqueValues).slice(0, 5)
    };
  });
}

// Enhanced numeric conversion
function convertToNumeric(value: any, columnInfo: any, convertCategorical: boolean): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  // If it's already a number
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }

  const strValue = String(value).toLowerCase().trim();

  // Convert boolean-like values
  if (convertCategorical && columnInfo?.isBoolean) {
    if (['yes', 'true', 'y', '1'].includes(strValue)) return 1;
    if (['no', 'false', 'n', '0'].includes(strValue)) return 0;
  }

  // Try to parse as number (removing common non-numeric characters)
  const cleaned = String(value).replace(/[,$%]/g, '');
  const parsed = parseFloat(cleaned);

  return !isNaN(parsed) && isFinite(parsed) ? parsed : 0;
}

// Helper functions
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

function aggregateData(data: any[], xKey: string, numericKeys: string[], method: string): any[] {
  const grouped = data.reduce((acc, item) => {
    const key = item[xKey];
    if (!acc[key]) {
      acc[key] = { items: [], ...item };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as any);

  return Object.values(grouped).map((group: any) => {
    const result = { ...group };
    delete result.items;

    numericKeys.forEach(key => {
      const values = group.items.map((item: any) => item[key]).filter((v: any) => typeof v === 'number' && !isNaN(v));

      if (values.length === 0) {
        result[key] = 0;
        return;
      }

      switch (method) {
        case 'sum':
          result[key] = values.reduce((a: number, b: number) => a + b, 0);
          break;
        case 'average':
          result[key] = values.reduce((a: number, b: number) => a + b, 0) / values.length;
          break;
        case 'max':
          result[key] = Math.max(...values);
          break;
        case 'min':
          result[key] = Math.min(...values);
          break;
        case 'count':
          result[key] = values.length;
          break;
        default:
          result[key] = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      }
    });

    return result;
  });
}

function formatTimeRange(range: string): string {
  if (range === "all") return "All Records";
  return `First ${range} Records`;
}

function formatXAxisTick(value: any): string {
  const str = String(value);
  return str.length > 10 ? str.substring(0, 8) + "..." : str;
}

function formatYAxisTick(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  if (value < 10) {
    return value.toFixed(1);
  }
  return value.toFixed(0);
}

function formatTooltipValue(value: any): string {
  if (typeof value === 'number') {
    if (value === 0 || value === 1) {
      // Likely a boolean conversion
      return value === 1 ? "Yes" : "No";
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return String(value);
}