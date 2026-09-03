import { Activity, Percent, Sigma, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'
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
    { icon: Sigma, label: 'Média', value: fmt(measures.mean), hint: 'Σ(xi · fi) / n' },
    { icon: Activity, label: 'Mediana', value: fmt(measures.median), hint: 'classe mediana' },
    {
      icon: TrendingUp,
      label: 'Moda',
      value: measures.mode === null ? '—' : fmt(measures.mode),
      hint: measures.mode === null ? 'sem moda (Czuber)' : 'fórmula de Czuber',
    },
    {
      icon: Percent,
      label: 'Variância populacional',
      value: fmt(measures.variancePopulation),
      hint: 'σ²',
    },
    {
      icon: Percent,
      label: 'Variância amostral',
      value: fmt(measures.varianceSample),
      hint: 's² (n − 1)',
    },
    {
      icon: Percent,
      label: 'Desvio padrão populacional',
      value: fmt(measures.stdDeviationPopulation),
      hint: 'σ = √σ²',
    },
    {
      icon: Percent,
      label: 'Desvio padrão amostral',
      value: fmt(measures.stdDeviationSample),
      hint: 's = √s²',
    },
  ]

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value, hint }) => (
        <Card key={label} size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Icon className="size-4 text-primary" />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-0">
            <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}