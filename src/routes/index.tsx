import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  getDefaultProblem,
  buildInitialTableau,
  solveStepByStep,
  type SimplexTableau,
  type SimplexStep,
} from '#/lib/simplex.ts'
import { SimplexTable } from '#/components/simplex-table.tsx'
import { startIntroTour, startFillTour, FILL_STEPS, destroyTour } from '#/components/tour.tsx'
import { Button } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const problem = getDefaultProblem()
  const initialTableau = buildInitialTableau(problem)

  const [tableau] = useState<SimplexTableau>(initialTableau)
  const [values, setValues] = useState<number[][]>(() =>
    initialTableau.matrix.map((row) => [...row]),
  )
  const [filledCells, setFilledCells] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<'idle' | 'filling' | 'ready' | 'solving'>('idle')
  const [steps, setSteps] = useState<SimplexStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [highlight, setHighlight] = useState<{ row: number; col: number }[]>([])
  const [_isCorrect, setIsCorrect] = useState<Record<string, boolean>>({})

  const handleStartTour = useCallback(() => {
    startIntroTour(() => {
      setPhase('filling')
      setTimeout(() => {
        startFillTour(
          (index) => {
            const cellStep = FILL_STEPS[index]
            if (cellStep) {
              const [r, c] = cellStep.cell.split('-').map(Number)
              setValues((prev) => {
                const next = prev.map((row) => [...row])
                next[r][c] = cellStep.answer
                return next
              })
              setFilledCells((prev) => new Set([...prev, cellStep.cell]))
              setIsCorrect((prev) => ({ ...prev, [cellStep.cell]: true }))
            }
          },
          () => setPhase('ready'),
        )
      }, 400)
    })
  }, [])

  const handleManualFill = useCallback((row: number, col: number, raw: string) => {
    const num = raw === '' ? 0 : parseFloat(raw)
    if (!isNaN(num)) {
      setValues((prev) => {
        const next = prev.map((r) => [...r])
        next[row][col] = num
        return next
      })
      setFilledCells((prev) => new Set([...prev, `${row}-${col}`]))
    }
  }, [])

  const handleSolve = useCallback(() => {
    const problem = getDefaultProblem()
    const result = solveStepByStep(problem)
    setSteps(result)
    setCurrentStep(0)
    setPhase('solving')
    if (result.length > 0) {
      setHighlight(result[0].highlight ?? [])
    }
  }, [])

  const handleNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1
      setCurrentStep(next)
      setHighlight(steps[next].highlight ?? [])
    }
  }, [currentStep, steps])

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      setHighlight(steps[prev].highlight ?? [])
    }
  }, [currentStep, steps])

  const handleReset = useCallback(() => {
    setValues(initialTableau.matrix.map((row) => [...row]))
    setFilledCells(new Set())
    setPhase('idle')
    setSteps([])
    setCurrentStep(0)
    setHighlight([])
    setIsCorrect({})
    destroyTour()
  }, [initialTableau])

  const isOptimal = steps.length > 0 && currentStep === steps.length - 1

  const currentTableau =
    phase === 'solving' && steps[currentStep]
      ? steps[currentStep].tableau
      : tableau

  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-wrap w-full py-10 px-6 flex flex-col flex-1">
        {/* Header compacto */}
        <header className="text-center mb-8 rise-in">
          <h1 className="display-title text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Simplex Resolver
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Monte a tabela Simplex guiado passo a passo
          </p>
        </header>

        {/* Problema - compacto */}
        <div
          className="island-shell rounded-xl p-5 mb-6 rise-in max-w-2xl mx-auto w-full"
          style={{ animationDelay: '60ms' }}
          data-simplex-problem
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)] shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="display-title text-base font-bold text-foreground">{problem.title}</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {problem.context}
              </p>
              <div className="mt-3 rounded-lg bg-[var(--sand)] border border-[var(--line)] px-3 py-2">
                <p className="text-xs font-mono text-foreground">
                  <span className="text-[var(--kicker)] font-semibold">Max</span> {problem.objectiveFn}
                </p>
                <div className="text-xs font-mono text-muted-foreground mt-1 space-y-0.5">
                  {problem.constraints.map((c, i) => (
                    <p key={i}>
                      {c.label}: {c.coefficients.map((val, j) => `${val}${problem.varNames[j]}`).join(' + ')} ≤ {c.rhs}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela - elemento dominante */}
        <div
          className="flex-1 flex items-start justify-center rise-in"
          style={{ animationDelay: '120ms' }}
        >
          <div className="island-shell rounded-2xl p-6 md:p-8 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Tabela Simplex</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {phase === 'idle' && 'Inicie o tutorial para preencher célula por célula'}
                  {phase === 'filling' && 'Siga o tour e preencha os valores'}
                  {phase === 'ready' && 'Tabela completa! Pronta para resolver'}
                  {phase === 'solving' && `Passo ${currentStep + 1} de ${steps.length}`}
                </p>
              </div>
              {phase === 'filling' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--lagoon-deep)] bg-[var(--lagoon)]/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--lagoon)] animate-pulse" />
                  Preenchendo
                </span>
              )}
              {phase === 'solving' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--lagoon-deep)] bg-[var(--lagoon)]/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--lagoon)] animate-pulse" />
                  Resolvendo
                </span>
              )}
            </div>

            <SimplexTable
              tableau={currentTableau}
              values={values}
              onChange={handleManualFill}
              editable={phase === 'idle' || phase === 'filling'}
              highlight={highlight}
              pivotCell={phase === 'solving' ? steps[currentStep]?.tableau.pivot : undefined}
              filledCells={filledCells}
              step={currentStep}
            />
          </div>
        </div>

        {/* Controles */}
        <div
          className="flex flex-col items-center gap-4 mt-8 rise-in"
          style={{ animationDelay: '200ms' }}
        >
          {phase === 'idle' && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button size="lg" onClick={handleStartTour} className="px-8">
                Iniciar Tutorial
              </Button>
              <Button size="lg" variant="outline" onClick={() => setPhase('ready')}>
                Preencher Manual
              </Button>
            </div>
          )}

          {phase === 'filling' && (
            <Button size="lg" variant="ghost" onClick={handleReset}>
              Reiniciar
            </Button>
          )}

          {phase === 'ready' && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button size="lg" onClick={handleSolve} className="px-8">
                Resolver →
              </Button>
              <Button size="lg" variant="ghost" onClick={handleReset}>
                Reiniciar
              </Button>
            </div>
          )}

          {phase === 'solving' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="lg" onClick={handlePrevStep} disabled={currentStep === 0}>
                  ← Anterior
                </Button>
                <Button size="lg" onClick={handleNextStep} disabled={isOptimal} className="px-8">
                  {isOptimal ? 'Concluído ✓' : 'Próximo →'}
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reiniciar do início
              </Button>
            </div>
          )}
        </div>

        {/* Descrição do passo */}
        {phase === 'solving' && steps[currentStep] && (
          <div className="mt-6 max-w-2xl mx-auto rise-in" key={currentStep}>
            <div className="rounded-xl bg-[var(--sand)] border border-[var(--line)] p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
