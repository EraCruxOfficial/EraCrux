"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
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

export function ChartLineLabel() {
  const [chartData, setChartData] = useState([
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 530, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 440, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ])

  // ⏳ keep updating data every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev =>
        prev.map(item => ({
          ...item,
          desktop: Math.floor(item.desktop * (0.9 + Math.random() * 0.2 )), // random fluctuation
          mobile: Math.floor(item.mobile * (0.9 + Math.random() * 0.2 )),
        }))
      )
    }, 3000) // update every 3s

    return () => clearInterval(interval)
  }, [])

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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
