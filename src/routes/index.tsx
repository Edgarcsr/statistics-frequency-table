import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import {
  EXAMPLE_DATASETS,
  parseValues,
  buildFrequencyTable,
  computeMeasures,
  type FrequencyTable,
  type Measures,
} from '#/utils/index.ts'
import { ValuesInput } from '#/components/values-input.tsx'
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
  const [text, setText] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    const values = parseValues(text)
    if (values.length === 0) {
      setError('Nenhum valor válido encontrado. Digite os valores separados por espaço.')
      setResult(null)
      return
    }
    const table = buildFrequencyTable(values)
    setResult({ table, measures: computeMeasures(table) })
    setError(null)
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="w-full max-w-4xl px-6 flex flex-col items-center gap-4 md:gap-8 py-6 md:py-12">
        <motion.div
          className="flex w-full flex-col items-center gap-4 md:gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.header
            className="w-full max-w-2xl text-center"
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Tabela de Frequências</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Informe qualquer conjunto de dados e o sistema monta a tabela de frequências
              completa e calcula média, moda, mediana, variância e desvio padrão.
            </p>
          </motion.header>

          <motion.div
            className="flex w-full justify-center"
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <ValuesInput value={text} onChange={setText} onSubmit={handleCalculate} error={error} examples={EXAMPLE_DATASETS} />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              className="flex w-full max-w-2xl flex-col items-center gap-4 md:gap-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="w-full">
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

              <MeasuresGrid measures={result.measures} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}