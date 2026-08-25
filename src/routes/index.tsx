import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  getDefaultProblem,
  formatProblem,
  buildInitialTableau,
  solveStepByStep,
  type SimplexTableau,
  type SimplexStep,
} from '#/lib/simplex.ts'
import { SimplexTable } from '#/components/simplex-table.tsx'
import { startTour } from '#/components/tour.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card.tsx'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const problem = getDefaultProblem()
  const [tableau, setTableau] = useState<SimplexTableau>(() =>
    buildInitialTableau(problem),
  )
  const [steps, setSteps] = useState<SimplexStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isSolving, setIsSolving] = useState(false)
  const [highlight, setHighlight] = useState<{ row: number; col: number }[]>([])

  const handleStartTour = useCallback(() => {
    startTour()
  }, [])

  const handleSolve = useCallback(() => {
    const result = solveStepByStep(problem)
    setSteps(result)
    setCurrentStep(0)
    setIsSolving(true)
    if (result.length > 0) {
      setTableau(result[0].tableau)
      setHighlight(result[0].highlight ?? [])
    }
  }, [problem])

  const handleNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1
      setCurrentStep(next)
      setTableau(steps[next].tableau)
      setHighlight(steps[next].highlight ?? [])
    }
  }, [currentStep, steps])

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      setTableau(steps[prev].tableau)
      setHighlight(steps[prev].highlight ?? [])
    }
  }, [currentStep, steps])

  const handleReset = useCallback(() => {
    setTableau(buildInitialTableau(problem))
    setSteps([])
    setCurrentStep(0)
    setIsSolving(false)
    setHighlight([])
  }, [problem])

  const isOptimal = steps.length > 0 && currentStep === steps.length - 1

  return (
    <div className="page-wrap py-12 px-4">
      <header className="text-center mb-12 rise-in">
        <h1 className="display-title text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Simplex Resolver
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Aprenda o método Simplex de forma interativa. Visualize o problema,
          monte a tabela e resolva passo a passo.
        </p>
      </header>

      <Card
        className="mb-8 island-shell rise-in"
        style={{ animationDelay: '100ms' }}
        data-simplex-problem
      >
        <CardHeader>
          <CardTitle className="text-lg">Problema de Otimização</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed">
            {formatProblem(problem)}
          </pre>
        </CardContent>
      </Card>

      <div
        className="island-shell rounded-xl p-6 mb-8 rise-in overflow-x-auto"
        style={{ animationDelay: '200ms' }}
      >
        <SimplexTable tableau={tableau} highlight={highlight} step={currentStep} />
      </div>

      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 rise-in"
        style={{ animationDelay: '300ms' }}
      >
        {!isSolving ? (
          <>
            <Button size="lg" onClick={handleStartTour} data-simplex-start>
              Iniciar Tutorial
            </Button>
            <Button size="lg" variant="outline" onClick={handleSolve}>
              Resolver Direto
            </Button>
          </>
        ) : (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            <Button
              size="lg"
              onClick={handleNextStep}
              disabled={isOptimal}
            >
              {isOptimal ? 'Ótimo Encontrado' : 'Próximo Passo'}
            </Button>
            <Button size="lg" variant="ghost" onClick={handleReset}>
              Reiniciar
            </Button>
          </>
        )}
      </div>

      {isSolving && steps[currentStep] && (
        <Card className="mt-8 max-w-2xl mx-auto rise-in">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {steps[currentStep].description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
