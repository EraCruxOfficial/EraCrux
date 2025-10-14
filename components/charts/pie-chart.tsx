"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, ChevronDown, Check } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DownloadChartButton } from "@/components/charts/DownloadChartButton"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Enhanced color palette for pie chart segments
const COLOR_PALETTE = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1",
  "#d084d0", "#87d068", "#a4de6c", "#ffb347", "#87ceeb",
  "#dda0dd", "#20b2aa", "#ff6347", "#9370db", "#3cb371",
  "#ffa07a", "#98d8c8", "#f7dc6f", "#bb8fce", "#85c1e9"
]

interface DataPoint {
  [key: string]: any
}

interface Props {
  data: DataPoint[]
  labelKey?: string
  valueKey?: string
  title?: string
  description?: string
  showAxisSelector?: boolean
  aggregationMethod?: 'sum' | 'average' | 'count' | 'max' | 'min'
  maxSlices?: number
  height?: number
  showTrend?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  sortBy?: 'value' | 'alphabetical' | 'none'
  sortOrder?: 'asc' | 'desc'
  convertCategorical?: boolean
  colors?: string[]
  innerRadius?: number
  outerRadius?: number
  showPercentages?: boolean
  minSlicePercentage?: number
  combineSmallSlices?: boolean
  legendPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none'
}

export default function UniversalPieChart({
  data = [],
  labelKey,
  valueKey,
  title = "Pie Chart Visualization",
  description,
  showAxisSelector = true,
  aggregationMethod = 'sum',
  maxSlices = 20,
  height = 400,
  showTrend = true,
  showLegend = true,
  showTooltip = true,
  sortBy = 'value',
  sortOrder = 'desc',
  convertCategorical = true,
  colors = COLOR_PALETTE,
  innerRadius = 0,
  outerRadius = 120,
  showPercentages = true,
  minSlicePercentage = 1,
  combineSmallSlices = true,
  legendPosition = 'bottom'
}: Props) {
  const [selectedLabelKey, setSelectedLabelKey] = React.useState<string>(labelKey || "")
  const [selectedValueKey, setSelectedValueKey] = React.useState<string>(valueKey || "")
  const [availableColumns, setAvailableColumns] = React.useState<any[]>([])

  // Comprehensive data processing and analysis
  const {
    processedData,
    finalLabelKey,
    finalValueKey,
    chartConfig,
    columnAnalysis,
    trendData,
    totalValue,
    sliceCount
  } = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        processedData: [],
        finalLabelKey: '',
        finalValueKey: '',
        chartConfig: {},
        columnAnalysis: [],
        trendData: null,
        totalValue: 0,
        sliceCount: 0
      }
    }

    // Analyze all columns in the dataset
    const columns = Object.keys(data[0])
    const colAnalysis = analyzeColumns(data, columns)
    setAvailableColumns(colAnalysis)

    // Intelligently determine label key (categorical/text columns)
    let detectedLabelKey = selectedLabelKey || labelKey
    if (!detectedLabelKey) {
      const textColumns = colAnalysis.filter(col =>
        col.type === 'categorical' || col.type === 'text' ||
        col.name.toLowerCase().includes('name') ||
        col.name.toLowerCase().includes('category') ||
        col.name.toLowerCase().includes('type')
      )
      detectedLabelKey = textColumns.length > 0 ? textColumns[0].name : columns[0]

      if (!selectedLabelKey) {
        setSelectedLabelKey(detectedLabelKey)
      }
    }

    // Intelligently determine value key (numeric columns)
    let detectedValueKey = selectedValueKey || valueKey
    if (!detectedValueKey) {
      const numericColumns = colAnalysis.filter(col =>
        col.type === 'numeric' || (col.type === 'categorical' && col.isBoolean)
      )
      detectedValueKey = numericColumns.length > 0 ? numericColumns[0].name : columns[1] || columns[0]

      if (!selectedValueKey) {
        setSelectedValueKey(detectedValueKey)
      }
    }

    // Process and transform data
    let processedDataArray = data.map((row, index) => {
      const processedRow: any = {}

      // Process label
      const labelValue = row[detectedLabelKey]
      processedRow.label = String(labelValue || `Item ${index + 1}`)
      processedRow[detectedLabelKey] = processedRow.label

      // Process value
      const colInfo = colAnalysis.find(col => col.name === detectedValueKey)
      const numericValue = convertToNumeric(row[detectedValueKey], colInfo, convertCategorical)
      processedRow.value = numericValue
      processedRow[detectedValueKey] = numericValue

      processedRow._original = row
      processedRow._index = index

      return processedRow
    }).filter(row => row.value > 0) // Remove zero/negative values for pie charts

    // Apply aggregation for duplicate labels
    if (aggregationMethod !== 'count') {
      processedDataArray = aggregateDataForPie(processedDataArray, detectedLabelKey, detectedValueKey, aggregationMethod)
    }

    // Apply sorting
    if (sortBy === 'value') {
      processedDataArray.sort((a, b) =>
        sortOrder === 'asc' ? a.value - b.value : b.value - a.value
      )
    } else if (sortBy === 'alphabetical') {
      processedDataArray.sort((a, b) => {
        const labelA = String(a.label || '')
        const labelB = String(b.label || '')
        return sortOrder === 'asc' ? labelA.localeCompare(labelB) : labelB.localeCompare(labelA)
      })
    }

    // Calculate total for percentage calculations
    const total = processedDataArray.reduce((sum, item) => sum + item.value, 0)

    // Handle small slices combination
    if (combineSmallSlices && minSlicePercentage > 0) {
      const minValue = (total * minSlicePercentage) / 100
      const largeSlices = processedDataArray.filter(item => item.value >= minValue)
      const smallSlices = processedDataArray.filter(item => item.value < minValue)

      if (smallSlices.length > 0) {
        const combinedValue = smallSlices.reduce((sum, item) => sum + item.value, 0)
        if (combinedValue > 0) {
          largeSlices.push({
            label: `Others (${smallSlices.length})`,
            value: combinedValue,
            _isCombined: true,
            _combinedItems: smallSlices
          })
        }
        processedDataArray = largeSlices
      }
    }

    // Limit number of slices for readability
    if (processedDataArray.length > maxSlices) {
      const topSlices = processedDataArray.slice(0, maxSlices - 1)
      const remainingSlices = processedDataArray.slice(maxSlices - 1)
      const remainingValue = remainingSlices.reduce((sum, item) => sum + item.value, 0)

      if (remainingValue > 0) {
        topSlices.push({
          label: `Others (${remainingSlices.length})`,
          value: remainingValue,
          _isCombined: true,
          _combinedItems: remainingSlices
        })
      }
      processedDataArray = topSlices
    }

    // Add colors and percentages to data
    processedDataArray = processedDataArray.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
      percentage: total > 0 ? ((item.value / total) * 100) : 0
    }))

    // Create chart configuration
    const config: ChartConfig = {
      [detectedValueKey]: {
        label: formatLabel(detectedValueKey)
      }
    }

    // Calculate trend data
    const trend = calculatePieTrend(processedDataArray, total)

    return {
      processedData: processedDataArray,
      finalLabelKey: detectedLabelKey,
      finalValueKey: detectedValueKey,
      chartConfig: config,
      columnAnalysis: colAnalysis,
      trendData: trend,
      totalValue: total,
      sliceCount: processedDataArray.length
    }
  }, [
    data, selectedLabelKey, selectedValueKey, labelKey, valueKey,
    aggregationMethod, maxSlices, convertCategorical, sortBy, sortOrder,
    minSlicePercentage, combineSmallSlices, colors
  ])

  // Handler functions
  const handleLabelKeyChange = (value: string) => {
    setSelectedLabelKey(value)
  }

  const handleValueKeyChange = (value: string) => {
    setSelectedValueKey(value)
  }

  const resetToDefaults = () => {
    setSelectedLabelKey("")
    setSelectedValueKey("")
  }

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-600">{data.label}</p>
          <p className="text-sm text-gray-600">
            Value: {formatTooltipValue(data.value)}
          </p>
          {!showPercentages && (
            <p className="text-sm text-gray-600">
              Percentage: {data.percentage.toFixed(1)}%
            </p>
          )}
          {data._isCombined && (
            <p className="text-xs text-gray-500">
              Combined from {data._combinedItems?.length || 0} items
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Custom legend content
  const CustomLegend = ({ payload }: any) => {
    if (!showLegend || legendPosition === 'none') return null

    return (
      <div className={`flex flex-wrap gap-2 text-sm ${legendPosition === 'bottom' || legendPosition === 'top'
        ? 'justify-center'
        : 'flex-col'
        }`}>
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate max-w-[120px]" title={entry.value}>
              {entry.label}
            </span>
            {showPercentages && (
              <span className="text-gray-500 text-xs">
                ({entry.payload.percentage?.toFixed(1)}%)
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

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
    )
  }

  const dynamicDescription = description ||
    `Showing ${sliceCount} segment${sliceCount !== 1 ? 's' : ''} with total value of ${formatTooltipValue(totalValue)}`

  const chartRef = React.useRef<HTMLDivElement>(null)

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{dynamicDescription}</CardDescription>
        </div>
        <DownloadChartButton targetRef={chartRef} filename={title} />
      </CardHeader>

      {/* Column Selection Controls */}
      {showAxisSelector && availableColumns.length > 0 && (
        <CardContent className="border-b p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Label Key Selection */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  🏷️ Labels (Categories)
                </label>
              </div>
              <Select value={selectedLabelKey} onValueChange={handleLabelKeyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select label column" />
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

            {/* Value Key Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700 truncate">
                  📊 Values (Numeric)
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
              <Select value={selectedValueKey} onValueChange={handleValueKeyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select value column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns
                    .filter(col => col.type === 'numeric' || (col.type === 'categorical' && col.isBoolean))
                    .map(col => (
                      <SelectItem key={col.name} value={col.name}>
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate flex-1">{formatLabel(col.name)}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {col.type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}

      <CardContent ref={chartRef}>
        {legendPosition === 'top' && <CustomLegend payload={processedData} />}

        <div className="flex" >
          {legendPosition === 'left' && (
            <div className="mr-4">
              <CustomLegend payload={processedData} />
            </div>
          )}

          <ChartContainer
            config={chartConfig}
            className="flex-1 flex items-center justify-center w-full"
            style={{
              height: 'auto',
              aspectRatio: '1 / 1', // ensures chart stays square
              maxWidth: '100%',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {showTooltip && <ChartTooltip content={<CustomTooltip />} />}
                <Pie
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="80%" // use percentages instead of pixels for responsiveness
                  dataKey="value"
                  nameKey="label"
                >
                  {processedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>


          {legendPosition === 'right' && (
            <div className="ml-4">
              <CustomLegend payload={processedData} />
            </div>
          )}
        </div>

        {legendPosition === 'bottom' && <CustomLegend payload={processedData} />}
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
  )
}

// Enhanced helper functions

function analyzeColumns(data: any[], columns: string[]) {
  return columns.map(colName => {
    const values = data.slice(0, Math.min(100, data.length))
      .map(row => row[colName])
      .filter(v => v != null && v !== '')
    const sampleSize = values.length

    if (sampleSize === 0) {
      return { name: colName, type: 'empty', isBoolean: false, uniqueCount: 0 }
    }

    const uniqueValues = new Set(values)
    const uniqueCount = uniqueValues.size

    // Check if numeric
    const numericValues = values.filter(v => {
      const cleaned = String(v).replace(/[,$%]/g, '')
      return !isNaN(parseFloat(cleaned)) && isFinite(parseFloat(cleaned))
    })
    const numericRatio = numericValues.length / sampleSize

    // Check if boolean-like categorical
    const booleanLike = uniqueCount <= 2 &&
      Array.from(uniqueValues).every(v =>
        ['yes', 'no', 'true', 'false', '1', '0', 'y', 'n']
          .includes(String(v).toLowerCase())
      )

    // Determine type
    let type: string
    if (numericRatio > 0.8) {
      type = 'numeric'
    } else if (booleanLike || uniqueCount <= 10) {
      type = 'categorical'
    } else {
      type = 'text'
    }

    return {
      name: colName,
      type,
      isBoolean: booleanLike,
      uniqueCount,
      numericRatio,
      sampleValues: Array.from(uniqueValues).slice(0, 5)
    }
  })
}

function convertToNumeric(value: any, columnInfo: any, convertCategorical: boolean): number {
  if (value === null || value === undefined || value === '') {
    return 0
  }

  if (typeof value === 'number' && !isNaN(value)) {
    return value
  }

  const strValue = String(value).toLowerCase().trim()

  // Convert boolean-like values
  if (convertCategorical && columnInfo?.isBoolean) {
    if (['yes', 'true', 'y', '1'].includes(strValue)) return 1
    if (['no', 'false', 'n', '0'].includes(strValue)) return 0
  }

  // Try to parse as number
  const cleaned = String(value).replace(/[,$%]/g, '')
  const parsed = parseFloat(cleaned)

  return !isNaN(parsed) && isFinite(parsed) ? parsed : 0
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim()
}

function aggregateDataForPie(
  data: any[],
  labelKey: string,
  valueKey: string,
  method: string
): any[] {
  const grouped = data.reduce((acc, item) => {
    const key = item.label || item[labelKey]
    if (!acc[key]) {
      acc[key] = { items: [], ...item }
    }
    acc[key].items.push(item)
    return acc
  }, {} as any)

  return Object.values(grouped).map((group: any) => {
    const result = { ...group }
    delete result.items

    const values = group.items
      .map((item: any) => item.value || item[valueKey])
      .filter((v: any) => typeof v === 'number' && !isNaN(v))

    if (values.length === 0) {
      result.value = 0
      return result
    }

    switch (method) {
      case 'sum':
        result.value = values.reduce((a: number, b: number) => a + b, 0)
        break
      case 'average':
        result.value = values.reduce((a: number, b: number) => a + b, 0) / values.length
        break
      case 'max':
        result.value = Math.max(...values)
        break
      case 'min':
        result.value = Math.min(...values)
        break
      case 'count':
        result.value = values.length
        break
      default:
        result.value = values.reduce((a: number, b: number) => a + b, 0)
    }

    return result
  })
}

function calculatePieTrend(data: any[], total: number) {
  if (data.length < 2) return null

  // Find the largest slice
  const sortedData = [...data].sort((a, b) => b.value - a.value)
  const largestSlice = sortedData[0]
  const secondLargestSlice = sortedData[1]

  const largestPercentage = (largestSlice.value / total) * 100
  const dominanceRatio = largestSlice.value / (secondLargestSlice?.value || 1)

  const isHighlyConcentrated = largestPercentage > 50
  const isDominated = dominanceRatio > 3

  let message = ''
  let isPositive = true

  if (isHighlyConcentrated) {
    message = `${largestSlice.label} dominates with ${largestPercentage.toFixed(1)}%`
    isPositive = true
  } else if (isDominated) {
    message = `${largestSlice.label} leads significantly`
    isPositive = true
  } else {
    message = `Relatively balanced distribution across ${data.length} segments`
    isPositive = false
  }

  return {
    isPositive,
    message,
    description: `Total value: ${formatTooltipValue(total)} across ${data.length} segments`
  }
}

function formatTooltipValue(value: any): string {
  if (typeof value === 'number') {
    if (Math.abs(value) >= 1000000) {
      return (value / 1000000).toFixed(1) + "M"
    }
    if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + "K"
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return String(value)
}

