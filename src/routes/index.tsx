import { useState, useCallback, useMemo, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { flushSync } from 'react-dom'
import {
  getDefaultProblem,
  buildInitialTableau,
  solveStepByStep,
  type SimplexProblem,
  type SimplexStep,
} from '#/lib/simplex.ts'
import { SimplexTable } from '#/components/simplex-table.tsx'
import { startIntroTour, startFillTour, FILL_STEPS, destroyTour } from '#/components/tour.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'
import { Tooltip, TooltipTrigger, TooltipContent } from '#/components/ui/tooltip.tsx'
import { GraduationCap, Play, Eraser, SquarePlus, X } from 'lucide-react'
import { cn } from '#/lib/utils.ts'

export const Route = createFileRoute('/')({ component: Home })

function blankTourCells(matrix: number[][]): number[][] {
  return matrix.map((row) => row.map(() => 0))
}

function normalizeProblem(p: SimplexProblem): SimplexProblem {
  return {
    ...p,
    objectiveFn: `Z = ${p.varNames.map((name, j) => `${p.objective[j]}${name}`).join(' + ')}`,
  }
}

function ObjectiveToggle({
  maximize,
  onChange,
}: {
  maximize: boolean
  onChange: (maximize: boolean) => void
}) {
  return (
    <div className="flex items-center rounded-md bg-muted p-0.5" role="group" aria-label="Objetivo da função">
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={maximize}
        className={cn(
          'h-7 rounded-[min(var(--radius-md),8px)] px-3 text-xs font-medium transition-colors',
          maximize
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Max
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!maximize}
        className={cn(
          'h-7 rounded-[min(var(--radius-md),8px)] px-3 text-xs font-medium transition-colors',
          !maximize
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Min
      </button>
    </div>
  )
}

function Home() {
  const [problem, setProblem] = useState<SimplexProblem>(() =>
    normalizeProblem(getDefaultProblem()),
  )
  const tableau = useMemo(() => buildInitialTableau(problem), [problem])

  const [values, setValues] = useState<number[][]>(() => blankTourCells(tableau.matrix))
  const [filledCells, setFilledCells] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<'idle' | 'filling' | 'ready' | 'solving'>('idle')
  const [steps, setSteps] = useState<SimplexStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [highlight, setHighlight] = useState<{ row: number; col: number }[]>([])
  const [introTourActive, setIntroTourActive] = useState(false)

  useEffect(() => {
    setValues(blankTourCells(tableau.matrix))
    setFilledCells(new Set())
  }, [tableau])

  const handleToggleMaximize = useCallback((maximize: boolean) => {
    setProblem((prev) => normalizeProblem({ ...prev, maximize }))
  }, [])

  const handleAddVariable = useCallback(() => {
    setProblem((prev) => {
      if (prev.varNames.length >= 10) return prev
      const nextIndex = prev.varNames.length
      const name = nextIndex < 26 ? String.fromCharCode(65 + nextIndex) : `V${nextIndex + 1}`
      return normalizeProblem({
        ...prev,
        varNames: [...prev.varNames, name],
        objective: [...prev.objective, 0],
        constraints: prev.constraints.map((c) => ({
          ...c,
          coefficients: [...c.coefficients, 0],
        })),
      })
    })
  }, [])

  const handleRemoveVariable = useCallback(() => {
    setProblem((prev) => {
      if (prev.varNames.length <= 2) return prev
      const last = prev.varNames.length - 1
      return normalizeProblem({
        ...prev,
        varNames: prev.varNames.slice(0, last),
        objective: prev.objective.slice(0, last),
        constraints: prev.constraints.map((c) => ({
          ...c,
          coefficients: c.coefficients.slice(0, last),
        })),
      })
    })
  }, [])

  const handleAddConstraint = useCallback(() => {
    setProblem((prev) => {
      if (prev.constraints.length >= 10) return prev
      return normalizeProblem({
        ...prev,
        constraints: [
          ...prev.constraints,
          {
            coefficients: new Array(prev.varNames.length).fill(0),
            label: `R${prev.constraints.length + 1}`,
            rhs: 0,
          },
        ],
      })
    })
  }, [])

  const handleRemoveConstraint = useCallback(() => {
    setProblem((prev) => {
      if (prev.constraints.length <= 1) return prev
      return normalizeProblem({
        ...prev,
        constraints: prev.constraints.slice(0, -1),
      })
    })
  }, [])

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
    setPhase('idle')
    setSteps([])
    setCurrentStep(0)
    setHighlight([])
    setIntroTourActive(false)
    destroyTour()
  }, [])

  const handleClear = useCallback(() => {
    setValues(blankTourCells(tableau.matrix))
    setFilledCells(new Set())
  }, [tableau])

  const isOptimal = steps.length > 0 && currentStep === steps.length - 1

  const canEditStructure = phase === 'idle' || phase === 'filling'

  const currentTableau =
    phase === 'solving' && steps[currentStep]
      ? steps[currentStep].tableau
      : tableau

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col items-center">
      <div className="my-auto -translate-y-12 w-full max-w-4xl py-12 px-6 flex flex-col items-center gap-8">
        {/* Problema */}
        {(introTourActive || phase === 'filling') && (
          <Card className="w-full max-w-2xl gap-0 py-3" data-simplex-problem>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">{problem.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {problem.context && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {problem.context}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabela */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
          <h2 className="text-lg font-bold">Tabela Simplex</h2>
          <p className="text-sm text-muted-foreground -mt-1.5">
            Preencha as células com os dados do problema.
          </p>
          <div className="mt-3 flex items-stretch gap-1.5">
            <Card className="flex-1 min-w-0 py-0 overflow-hidden">
              <div className="overflow-x-auto">
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
              </div>
            </Card>

            {canEditStructure && (
              <div className="flex flex-col justify-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Adicionar variável"
                      disabled={problem.varNames.length >= 10}
                      onClick={handleAddVariable}
                    >
                      <SquarePlus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Adicionar variável</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remover variável"
                      disabled={problem.varNames.length <= 2}
                      onClick={handleRemoveVariable}
                    >
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remover variável</TooltipContent>
                </Tooltip>

                <div className="mx-1.5 h-px bg-border" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Adicionar restrição"
                      disabled={problem.constraints.length >= 10}
                      onClick={handleAddConstraint}
                    >
                      <SquarePlus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Adicionar restrição</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remover restrição"
                      disabled={problem.constraints.length <= 1}
                      onClick={handleRemoveConstraint}
                    >
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remover restrição</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="w-full flex flex-col items-center gap-3">
          {phase === 'idle' && (
            <div className="flex w-full max-w-4xl justify-between items-center">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleStartTour}>
                  Iniciar Tutorial
                  <GraduationCap />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Limpar
                  <Eraser />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <ObjectiveToggle maximize={problem.maximize} onChange={handleToggleMaximize} />
                <Button size="sm" onClick={handleSolve}>
                  Resolver
                  <Play />
                </Button>
              </div>
            </div>
          )}

          {phase === 'filling' && (
            <div className="flex w-full max-w-4xl justify-between">
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
