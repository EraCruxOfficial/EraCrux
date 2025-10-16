"use client";

import * as React from "react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
} from "recharts";
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
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Same color palette as UniversalBarChart
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
    maxDataPoints?: number;
    height?: number;
    showTrend?: boolean;
    showAxisSelector?: boolean;
}

export default function UniversalRadarChart({
    data = [],
    title = "Radar Chart Visualization",
    description,
    maxDataPoints = 30,
    height = 350,
    showTrend = true,
    showAxisSelector = true,
}: Props) {
    const [selectedXAxis, setSelectedXAxis] = React.useState<string>("");
    const [selectedYKeys, setSelectedYKeys] = React.useState<string[]>([]);
    const [availableColumns, setAvailableColumns] = React.useState<any[]>([]);

    const { processedData, chartConfig, xAxisKey, numericKeys, trendData, columnAnalysis } =
        React.useMemo(() => {
            if (!data || data.length === 0) {
                return {
                    processedData: [],
                    chartConfig: {},
                    xAxisKey: "",
                    numericKeys: [],
                    trendData: null,
                    columnAnalysis: [],
                };
            }

            const columns = Object.keys(data[0]);
            const colAnalysis = analyzeColumns(data, columns);
            setAvailableColumns(colAnalysis);

            // Detect X-axis
            let detectedXAxis = selectedXAxis;
            if (!detectedXAxis) {
                const textCols = colAnalysis.filter(
                    (col) => col.type === "categorical" || col.type === "text"
                );
                detectedXAxis = textCols[0]?.name || columns[0];
                setSelectedXAxis(detectedXAxis);
            }

            // Detect Y-axis
            let detectedYKeys = selectedYKeys;
            if (detectedYKeys.length === 0) {
                const numericCols = colAnalysis.filter((col) => col.type === "numeric");
                detectedYKeys = numericCols.slice(0, 5).map((col) => col.name);
                setSelectedYKeys(detectedYKeys);
            }

            // Prepare chart config
            const config: ChartConfig = {};
            detectedYKeys.forEach((key, index) => {
                config[key] = {
                    label: formatLabel(key),
                    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
                };
            });

            // Processed data
            let processed = data.map((row, i) => ({
                ...row,
                [detectedXAxis]: String(row[detectedXAxis] || `Item ${i + 1}`),
            }));

            // Limit data
            if (processed.length > maxDataPoints)
                processed = processed.slice(0, maxDataPoints);

            // Trend
            const trend = calculateTrend(processed, detectedYKeys);

            return {
                processedData: processed,
                chartConfig: config,
                xAxisKey: detectedXAxis,
                numericKeys: detectedYKeys,
                trendData: trend,
                columnAnalysis: colAnalysis,
            };
        }, [data, selectedXAxis, selectedYKeys, maxDataPoints]);

    const handleXAxisChange = (value: string) => setSelectedXAxis(value);

    const handleYKeyToggle = (key: string) => {
        setSelectedYKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const resetToDefaults = () => {
        setSelectedXAxis("");
        setSelectedYKeys([]);
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
        `Showing ${numericKeys.length} metric${numericKeys.length > 1 ? "s" : ""
        } across ${processedData.length} categories`;

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{dynamicDescription}</CardDescription>
                </div>
                <DownloadChartButton targetRef={chartRef} filename={title} />
            </CardHeader>

            {showAxisSelector && availableColumns.length > 0 && (
                <CardContent className="border-b p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* X-Axis Selector */}
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    🧭 X-Axis (Categories)
                                </label>
                            </div>
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
                        </div>

                        {/* Y-Axis Selector */}
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
                                    <Button variant="outline" className="w-full justify-between">
                                        <span className="truncate">
                                            {selectedYKeys.length > 0
                                                ? `${selectedYKeys.length} metric${selectedYKeys.length > 1 ? "s" : ""
                                                } selected`
                                                : "Select Y-axis columns"}
                                        </span>
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                                    <div className="max-h-60 overflow-y-auto p-2">
                                        {availableColumns
                                            .filter((col) => col.type === "numeric")
                                            .map((col) => (
                                                <label
                                                    key={col.name}
                                                    className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                >
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

            <CardContent>
                <ChartContainer
                    ref={chartRef}
                    config={chartConfig}
                    className="flex items-center justify-center w-full"
                    style={{
                        aspectRatio: "1 / 1",
                        height: "auto",
                        maxWidth: "100%",
                        minHeight: "250px",
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={processedData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey={xAxisKey} />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => String(value)}
                                        formatter={(value, name) => [
                                            formatTooltipValue(value),
                                            chartConfig[name as string]?.label || name,
                                        ]}
                                    />
                                }
                            />
                            {numericKeys.map((key, index) => (
                                <Radar
                                    key={key}
                                    name={String(chartConfig[key]?.label || key)}
                                    dataKey={key}
                                    stroke={chartConfig[key]?.color}
                                    fill={chartConfig[key]?.color}
                                    fillOpacity={0.5}
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>



            {showTrend && trendData && (
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">
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

/* -------------------------- Helper Functions -------------------------- */

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

function calculateTrend(data: any[], yKeys: string[]) {
    if (data.length < 2 || yKeys.length === 0) return null;
    const key = yKeys[0];
    const values = data.map((d) => d[key] || 0);
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
        description: `Based on ${formatLabel(key)} across ${data.length} items`,
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
