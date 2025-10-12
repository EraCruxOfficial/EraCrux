"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Dynamic color palette for multiple series
const COLOR_PALETTE = [
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
    xAxis?: string;
    yKeys?: string[];
    title?: string;
    description?: string;
    showAxisSelector?: boolean;
    aggregationMethod?: 'sum' | 'average' | 'count' | 'max' | 'min';
    maxDataPoints?: number;
    height?: number;
    showTrend?: boolean;
    sortBy?: 'value' | 'alphabetical' | 'none';
    sortOrder?: 'asc' | 'desc';
    convertCategorical?: boolean;
}

export default function UniversalBarChart({
    data = [],
    xAxis,
    yKeys,
    title = "Bar Chart Visualization",
    description,
    showAxisSelector = true,
    aggregationMethod = 'sum',
    maxDataPoints = 50,
    height = 350,
    showTrend = true,
    sortBy = 'none',
    sortOrder = 'desc',
    convertCategorical = true
}: Props) {
    const [selectedXAxis, setSelectedXAxis] = React.useState<string>(xAxis || "");
    const [selectedYKeys, setSelectedYKeys] = React.useState<string[]>(yKeys || []);
    const [availableColumns, setAvailableColumns] = React.useState<any[]>([]);

    // Auto-detect data structure and types
    const { processedData, xAxisKey, numericKeys, chartConfig, columnAnalysis, trendData } = React.useMemo(() => {
        if (!data || data.length === 0) {
            return {
                processedData: [],
                xAxisKey: '',
                numericKeys: [],
                chartConfig: {},
                columnAnalysis: [],
                trendData: null
            };
        }

        // Analyze columns
        const columns = Object.keys(data[0]);
        const colAnalysis = analyzeColumns(data, columns);
        setAvailableColumns(colAnalysis);

        // Determine X-axis
        let detectedXAxis = selectedXAxis || xAxis;
        if (!detectedXAxis) {
            const idColumns = colAnalysis.filter(col =>
                col.name.toLowerCase().includes('id') ||
                col.name.toLowerCase().includes('code') ||
                col.name.toLowerCase().includes('name')
            );

            if (idColumns.length > 0) {
                detectedXAxis = idColumns[0].name;
            } else {
                const categoricalCols = colAnalysis.filter(col =>
                    col.type === 'categorical' || col.type === 'text'
                );
                detectedXAxis = categoricalCols.length > 0 ? categoricalCols[0].name : columns[0];
            }

            if (!selectedXAxis) {
                setSelectedXAxis(detectedXAxis);
            }
        }

        // Determine Y-axis keys
        let finalNumericKeys = selectedYKeys.length > 0 ? selectedYKeys : (yKeys || []);
        if (finalNumericKeys.length === 0) {
            const numericColumns = colAnalysis.filter(col =>
                col.type === 'numeric' || (col.type === 'categorical' && col.isBoolean)
            );
            finalNumericKeys = numericColumns.slice(0, 6).map(col => col.name);

            if (selectedYKeys.length === 0) {
                setSelectedYKeys(finalNumericKeys);
            }
        }

        // Create chart config
        const config: ChartConfig = {};
        finalNumericKeys.forEach((key, index) => {
            config[key] = {
                label: formatLabel(key),
                color: COLOR_PALETTE[index % COLOR_PALETTE.length]
            };
        });

        // Process data
        let processedDataArray = data.map((row, index) => {
            const processedRow: any = {};

            // Process X-axis value
            const xValue = row[detectedXAxis];
            processedRow[detectedXAxis] = String(xValue || `Item ${index + 1}`);

            // Process numeric columns
            columns.forEach(key => {
                if (key === detectedXAxis) return;

                const value = row[key];
                const colInfo = colAnalysis.find(col => col.name === key);

                if (finalNumericKeys.includes(key)) {
                    processedRow[key] = convertToNumeric(value, colInfo, convertCategorical);
                }
            });

            processedRow._original = row;
            processedRow._index = index;

            return processedRow;
        });

        // Apply aggregation for duplicate X-axis values
        if (aggregationMethod !== 'count') {
            processedDataArray = aggregateData(processedDataArray, detectedXAxis, finalNumericKeys, aggregationMethod);
        }

        // Apply sorting
        if (sortBy === 'value' && finalNumericKeys.length > 0) {
            const primaryKey = finalNumericKeys[0];
            processedDataArray.sort((a, b) => {
                const valA = a[primaryKey] || 0;
                const valB = b[primaryKey] || 0;
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            });
        } else if (sortBy === 'alphabetical') {
            processedDataArray.sort((a, b) => {
                const valA = String(a[detectedXAxis] || '');
                const valB = String(b[detectedXAxis] || '');
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
        }

        // Limit data points for performance
        if (processedDataArray.length > maxDataPoints) {
            processedDataArray = processedDataArray.slice(0, maxDataPoints);
        }

        // Calculate trend data
        const trend = calculateTrend(processedDataArray, finalNumericKeys);

        return {
            processedData: processedDataArray,
            xAxisKey: detectedXAxis,
            numericKeys: finalNumericKeys,
            chartConfig: config,
            columnAnalysis: colAnalysis,
            trendData: trend
        };
    }, [data, selectedXAxis, selectedYKeys, xAxis, yKeys, aggregationMethod, maxDataPoints, convertCategorical, sortBy, sortOrder]);

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

    const dynamicDescription = description ||
        `Showing ${numericKeys.length} metric${numericKeys.length !== 1 ? 's' : ''} across ${processedData.length} categories`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{dynamicDescription}</CardDescription>
            </CardHeader>

            {/* Axis Selection Controls */}
            {showAxisSelector && availableColumns.length > 0 && (
                <CardContent className="border-b p-4">
                    <div className="grid gap-4 md:grid-cols-2">
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

            <CardContent>
                <ChartContainer config={chartConfig} className={`w-full`} style={{ height: `${height}px` }}>
                    <BarChart data={processedData} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                        <XAxis
                            dataKey={xAxisKey}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => formatXAxisTick(value)}
                            angle={processedData.length > 10 ? -45 : 0}
                            textAnchor={processedData.length > 10 ? "end" : "middle"}
                            height={processedData.length > 10 ? 80 : 50}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => formatYAxisTick(value)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dashed"
                                    labelFormatter={(value) => formatTooltipLabel(value)}
                                    formatter={(value, name) => [
                                        formatTooltipValue(value),
                                        chartConfig[name as string]?.label || name
                                    ]}
                                />
                            }
                        />
                        {numericKeys.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={chartConfig[key]?.color || COLOR_PALETTE[index]}
                                radius={[4, 4, 0, 0]}
                                opacity={0.8}
                            />
                        ))}
                    </BarChart>
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

// Helper functions
function analyzeColumns(data: any[], columns: string[]) {
    return columns.map(colName => {
        const values = data.slice(0, Math.min(100, data.length)).map(row => row[colName]).filter(v => v != null && v !== '');
        const sampleSize = values.length;

        if (sampleSize === 0) {
            return { name: colName, type: 'empty', isBoolean: false, uniqueCount: 0 };
        }

        const uniqueValues = new Set(values);
        const uniqueCount = uniqueValues.size;

        // Check if numeric
        const numericValues = values.filter(v => {
            const cleaned = String(v).replace(/[,$%]/g, '');
            return !isNaN(parseFloat(cleaned)) && isFinite(parseFloat(cleaned));
        });

        const numericRatio = numericValues.length / sampleSize;

        // Check if boolean-like categorical
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

function convertToNumeric(value: any, columnInfo: any, convertCategorical: boolean): number {
    if (value === null || value === undefined || value === '') {
        return 0;
    }

    if (typeof value === 'number' && !isNaN(value)) {
        return value;
    }

    const strValue = String(value).toLowerCase().trim();

    // Convert boolean-like values
    if (convertCategorical && columnInfo?.isBoolean) {
        if (['yes', 'true', 'y', '1'].includes(strValue)) return 1;
        if (['no', 'false', 'n', '0'].includes(strValue)) return 0;
    }

    // Try to parse as number
    const cleaned = String(value).replace(/[,$%]/g, '');
    const parsed = parseFloat(cleaned);

    return !isNaN(parsed) && isFinite(parsed) ? parsed : 0;
}

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
                    result[key] = values.reduce((a: number, b: number) => a + b, 0);
            }
        });

        return result;
    });
}

function calculateTrend(data: any[], numericKeys: string[]) {
    if (data.length < 2 || numericKeys.length === 0) return null;

    const primaryKey = numericKeys[0];
    const values = data.map(d => d[primaryKey] || 0);
    const firstHalf = values.slice(0, Math.ceil(values.length / 2));
    const secondHalf = values.slice(Math.ceil(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const percentChange = firstAvg !== 0 ? ((secondAvg - firstAvg) / Math.abs(firstAvg)) * 100 : 0;
    const isPositive = percentChange > 0;

    return {
        isPositive,
        message: isPositive
            ? `Trending up by ${Math.abs(percentChange).toFixed(1)}%`
            : `Trending down by ${Math.abs(percentChange).toFixed(1)}%`,
        description: `Based on ${formatLabel(primaryKey)} across ${data.length} data points`
    };
}

function formatXAxisTick(value: any): string {
    const str = String(value);
    return str.length > 15 ? str.substring(0, 12) + "..." : str;
}

function formatYAxisTick(value: number): string {
    if (Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(1) + "M";
    }
    if (Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(1) + "K";
    }
    if (value < 10 && value > 0) {
        return value.toFixed(1);
    }
    return value.toFixed(0);
}

function formatTooltipLabel(value: any): string {
    return String(value);
}

function formatTooltipValue(value: any): string {
    if (typeof value === 'number') {
        if (value === 0 || value === 1) {
            return value === 1 ? "Yes" : "No";
        }
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return String(value);
}