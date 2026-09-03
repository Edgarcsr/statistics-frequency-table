import { Activity, Percent, Sigma, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'
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
    { icon: Sigma, label: 'Média', value: fmt(measures.mean), hint: 'Σ(xi · fi) / n', tooltip: 'x̄ = Σ(xi · fi) / n' },
    { icon: Activity, label: 'Mediana', value: fmt(measures.median), hint: 'classe mediana', tooltip: 'Md = L + ((n/2 − F_ant) / fi) · h' },
    {
      icon: TrendingUp,
      label: 'Moda',
      value: measures.mode === null ? '—' : fmt(measures.mode),
      hint: measures.mode === null ? 'sem moda (Czuber)' : 'fórmula de Czuber',
      tooltip: 'Mo = L + (d1 / (d1 + d2)) · h',
    },
    {
      icon: Percent,
      label: 'Variância populacional',
      value: fmt(measures.variancePopulation),
      hint: 'σ²',
      tooltip: 'σ² = Σ(fi · (xi − x̄)²) / n',
    },
    {
      icon: Percent,
      label: 'Variância amostral',
      value: fmt(measures.varianceSample),
      hint: 's²',
      tooltip: 's² = Σ(fi · (xi − x̄)²) / (n − 1)',
    },
    {
      icon: Percent,
      label: 'Desvio padrão populacional',
      value: fmt(measures.stdDeviationPopulation),
      hint: 'σ',
      tooltip: 'σ = √σ²',
    },
    {
      icon: Percent,
      label: 'Desvio padrão amostral',
      value: fmt(measures.stdDeviationSample),
      hint: 's',
      tooltip: 's = √s²',
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
                <TooltipContent>
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}