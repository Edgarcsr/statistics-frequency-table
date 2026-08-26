import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { flushSync } from 'react-dom'
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
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'
import { GraduationCap, Play, Eraser } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function blankTourCells(matrix: number[][]): number[][] {
  return matrix.map((row) => row.map(() => 0))
}

function Home() {
  const problem = getDefaultProblem()
  const initialTableau = buildInitialTableau(problem)

  const [tableau] = useState<SimplexTableau>(initialTableau)
  const [values, setValues] = useState<number[][]>(() => blankTourCells(initialTableau.matrix))
  const [filledCells, setFilledCells] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<'idle' | 'filling' | 'ready' | 'solving'>('idle')
  const [steps, setSteps] = useState<SimplexStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [highlight, setHighlight] = useState<{ row: number; col: number }[]>([])
  const [introTourActive, setIntroTourActive] = useState(false)

  const handleStartTour = useCallback(() => {
    flushSync(() => setIntroTourActive(true))
    startIntroTour(
      () => {
        setIntroTourActive(false)
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
              }
            },
            () => setPhase('ready'),
          )
        }, 400)
      },
    )
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
    const result = solveStepByStep(problem)
    setSteps(result)
    setCurrentStep(0)
    setPhase('solving')
    if (result.length > 0) {
      setHighlight(result[0].highlight ?? [])
    }
  }, [problem])

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
    setValues(blankTourCells(initialTableau.matrix))
    setFilledCells(new Set())
    setPhase('idle')
    setSteps([])
    setCurrentStep(0)
    setHighlight([])
    setIntroTourActive(false)
    destroyTour()
  }, [initialTableau])

  const handleClear = useCallback(() => {
    setValues(blankTourCells(initialTableau.matrix))
    setFilledCells(new Set())
  }, [initialTableau])

  const isOptimal = steps.length > 0 && currentStep === steps.length - 1

  const currentTableau =
    phase === 'solving' && steps[currentStep]
      ? steps[currentStep].tableau
      : tableau

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col items-center">
      <div className="my-auto -translate-y-12 w-full max-w-4xl py-12 px-6 flex flex-col items-center gap-8">
        {/* Problema */}
        {(introTourActive || phase === 'filling') && (
          <Card
            className="w-full max-w-2xl gap-0 py-3"
            data-simplex-problem
          >
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">{problem.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {problem.context}
              </p>
              <div className="rounded-md bg-muted p-2 font-mono text-xs space-y-1">
                <p className="font-semibold">Max {problem.objectiveFn}</p>
                {problem.constraints.map((c, i) => (
                  <p key={i} className="text-muted-foreground">
                    {c.label}: {c.coefficients.map((val, j) => `${val}${problem.varNames[j]}`).join(' + ')} ≤ {c.rhs}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela */}
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
          <h2 className="text-lg font-bold">Tabela Simplex</h2>
          <p className="text-sm text-muted-foreground -mt-1.5">
            Preencha as células com os dados do problema.
          </p>
          <div className="mt-3">
            <Card className="w-full py-0 overflow-hidden">
<SimplexTable
              tableau={currentTableau}
              values={phase === 'solving' ? currentTableau.matrix : values}
              onChange={handleManualFill}
                editable={phase === 'idle' || phase === 'filling'}
                highlight={highlight}
                pivotCell={phase === 'solving' ? steps[currentStep]?.tableau.pivot : undefined}
                filledCells={filledCells}
                step={currentStep}
              />
            </Card>
          </div>
        </div>

        {/* Controles */}
        <div className="w-full flex flex-col items-center gap-3">
          {phase === 'idle' && (
            <div className="flex w-full max-w-3xl justify-between">
              <Button variant="ghost" size="sm" onClick={handleStartTour}>
                Iniciar Tutorial
                <GraduationCap />
              </Button>
              <Button size="sm" onClick={handleSolve}>
                Resolver
                <Play />
              </Button>
            </div>
          )}

          {phase === 'filling' && (
            <div className="flex w-full max-w-3xl justify-between">
              <Button variant="ghost" size="sm" onClick={handleStartTour}>
                Iniciar Tutorial
                <GraduationCap />
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Limpar
                <Eraser />
              </Button>
            </div>
          )}

          {phase === 'ready' && (
            <div className="flex gap-3">
              <Button size="sm" onClick={handleSolve}>Resolver</Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reiniciar
              </Button>
            </div>
          )}

          {phase === 'solving' && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
                  Anterior
                </Button>
                <Button onClick={handleNextStep} disabled={isOptimal}>
                  {isOptimal ? 'Concluído' : 'Próximo'}
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reiniciar
              </Button>
            </div>
          )}
        </div>

        {/* Descrição do passo */}
        {phase === 'solving' && steps[currentStep] && (
          <Card className="w-full max-w-2xl" key={currentStep}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {steps[currentStep].description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
