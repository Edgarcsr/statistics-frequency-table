import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart.tsx'
import type { FrequencyTable } from '#/utils/types.ts'

const chartConfig = {
  fi: {
    label: 'Frequência',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

interface FrequencyChartProps {
  table: FrequencyTable
}

export function FrequencyChart({ table }: FrequencyChartProps) {
  const data = table.rows.map((row) => ({
    classLabel: row.classLabel,
    fi: row.frequency,
  }))

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
        Histograma — frequência por classe
      </h3>
      <ChartContainer
        config={chartConfig}
        className="h-72 aspect-auto"
        initialDimension={{ width: 640, height: 288 }}
      >
        <BarChart accessibilityLayer data={data} margin={{ top: 24 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="classLabel"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={24}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="fi" fill="var(--color-fi)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}