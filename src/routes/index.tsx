import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import {
  DEFAULT_HEIGHTS,
  parseHeights,
  buildFrequencyTable,
  computeMeasures,
  type FrequencyTable,
  type Measures,
} from '#/utils/index.ts'
import { HeightsInput } from '#/components/heights-input.tsx'
import { MeasuresGrid } from '#/components/measures-grid.tsx'
import { FrequencyTableView } from '#/components/frequency-table.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [{ title: 'Tabela de Frequências' }],
  }),
})

interface Result {
  table: FrequencyTable
  measures: Measures
}

function Home() {
  const [text, setText] = useState(() => DEFAULT_HEIGHTS.join(' '))
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    const heights = parseHeights(text)
    if (heights.length === 0) {
      setError('Nenhum valor válido encontrado. Digite as alturas separadas por espaço.')
      setResult(null)
      return
    }
    const table = buildFrequencyTable(heights)
    setResult({ table, measures: computeMeasures(table) })
    setError(null)
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="w-full max-w-4xl px-6 flex flex-col items-center gap-4 md:gap-8 py-6 md:py-12">
        <header className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">Tabela de Frequências</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Trabalho de Estatística: informe as alturas dos alunos da sala e o sistema monta a
            tabela de frequências completa e calcula média, moda, mediana, variância e desvio
            padrão.
          </p>
        </header>

        <HeightsInput value={text} onChange={setText} onSubmit={handleCalculate} error={error} />

        {result && (
          <>
            <MeasuresGrid measures={result.measures} />

            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="size-4 text-primary" />
                  Tabela de frequências completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FrequencyTableView table={result.table} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}