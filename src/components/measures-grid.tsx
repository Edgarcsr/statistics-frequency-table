import { Activity, Percent, Sigma, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'
import { Math } from '#/components/ui/math.tsx'
import { Tooltip, TooltipTrigger, TooltipContent } from '#/components/ui/tooltip.tsx'
import type { Measures } from '#/utils/types.ts'

interface MeasuresGridProps {
  measures: Measures | null
}

function fmt(n: number) {
  return n.toFixed(2)
}

export function MeasuresGrid({ measures }: MeasuresGridProps) {
  if (!measures) {
    return null
  }

  const items = [
    {
      icon: Sigma,
      label: 'Média',
      value: fmt(measures.mean),
      hint: 'Σ(xi · fi) / n',
      tooltip: String.raw`\bar{x} = \frac{\sum (x_i \cdot f_i)}{n}`,
    },
    {
      icon: Activity,
      label: 'Mediana',
      value: fmt(measures.median),
      hint: 'classe mediana',
      tooltip: String.raw`Md = L + \frac{\frac{n}{2} - F_{\text{ant}}}{f_i} \cdot h`,
    },
    {
      icon: TrendingUp,
      label: 'Moda',
      value: measures.mode === null ? '—' : fmt(measures.mode),
      hint: measures.mode === null ? 'sem moda (Czuber)' : 'fórmula de Czuber',
      tooltip: String.raw`Mo = L + \frac{d_1}{d_1 + d_2} \cdot h`,
    },
    {
      icon: Percent,
      label: 'Variância populacional',
      value: fmt(measures.variancePopulation),
      hint: 'σ²',
      tooltip: String.raw`\sigma^2 = \frac{\sum (f_i \cdot (x_i - \bar{x})^2)}{n}`,
    },
    {
      icon: Percent,
      label: 'Variância amostral',
      value: fmt(measures.varianceSample),
      hint: 's²',
      tooltip: String.raw`s^2 = \frac{\sum (f_i \cdot (x_i - \bar{x})^2)}{n - 1}`,
    },
    {
      icon: Percent,
      label: 'Desvio padrão populacional',
      value: fmt(measures.stdDeviationPopulation),
      hint: 'σ',
      tooltip: String.raw`\sigma = \sqrt{\sigma^2}`,
    },
    {
      icon: Percent,
      label: 'Desvio padrão amostral',
      value: fmt(measures.stdDeviationSample),
      hint: 's',
      tooltip: String.raw`s = \sqrt{s^2}`,
    },
  ]

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value, hint, tooltip }) => (
        <Card key={label} size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Icon className="size-4 text-primary" />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-0">
            <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{hint}</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <Math>{tooltip}</Math>
                </TooltipContent>
              </Tooltip>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}