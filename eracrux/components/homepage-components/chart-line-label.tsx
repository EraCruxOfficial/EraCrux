"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
}

// ✅ Hardcoded states
const chartStates = [
  [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 530, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 440, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ],
  [
    { month: "January", desktop: 210, mobile: 95 },
    { month: "February", desktop: 200, mobile: 220 },
    { month: "March", desktop: 260, mobile: 110 },
    { month: "April", desktop: 340, mobile: 210 },
    { month: "May", desktop: 230, mobile: 145 },
    { month: "June", desktop: 250, mobile: 150 },
  ],
  [
    { month: "January", desktop: 190, mobile: 100 },
    { month: "February", desktop: 250, mobile: 210 },
    { month: "March", desktop: 250, mobile: 140 },
    { month: "April", desktop: 300, mobile: 185 },
    { month: "May", desktop: 215, mobile: 135 },
    { month: "June", desktop: 230, mobile: 160 },
  ],
  [
    { month: "January", desktop: 200, mobile: 90 },
    { month: "February", desktop: 520, mobile: 205 },
    { month: "March", desktop: 240, mobile: 125 },
    { month: "April", desktop: 550, mobile: 195 },
    { month: "May", desktop: 220, mobile: 150 },
    { month: "June", desktop: 245, mobile: 155 },
  ],
  [
    { month: "January", desktop: 205, mobile: 85 },
    { month: "February", desktop: 300, mobile: 215 },
    { month: "March", desktop: 255, mobile: 130 },
    { month: "April", desktop: 430, mobile: 200 },
    { month: "May", desktop: 225, mobile: 140 },
    { month: "June", desktop: 235, mobile: 145 },
  ],
]

export function ChartLineLabel() {
  const [index, setIndex] = useState(0)
  const [chartData, setChartData] = useState(chartStates[0])
  const [prevTotal, setPrevTotal] = useState(0)
  const [trend, setTrend] = useState<{ percent: number; isUp: boolean }>({ percent: 0, isUp: true })

  // 🔄 Rotate through predefined states
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % chartStates.length
      const nextData = chartStates[nextIndex]

      // calculate totals
      const total = nextData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)

      if (prevTotal > 0) {
        const diff = ((total - prevTotal) / prevTotal) * 100
        setTrend({ percent: Math.abs(diff), isUp: diff >= 0 })
      }

      setPrevTotal(total)
      setIndex(nextIndex)
      setChartData(nextData)
    }, 3000)

    return () => clearInterval(interval)
  }, [index, prevTotal])

  return (
    <Card style={{ background: "transparent", border: "none" }}>
      <CardHeader />
      <CardContent>
        <ChartContainer config={chartConfig} style={{ background: "transparent", border: "none" }}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{ fill: "var(--color-desktop)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {trend.isUp ? "Trending up" : "Trending down"} by{" "}
          {trend.percent.toFixed(1)}% this month{" "}
          {trend.isUp ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
