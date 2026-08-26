import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

let driverInstance: Driver | null = null

interface CellStep {
  cell: string
  title: string
  description: string
  answer: number
}

export const FILL_STEPS: CellStep[] = [
  {
    cell: '0-0',
    title: 'Restrição 1 → Coluna A',
    description:
      'A cadeira A gasta 2 horas de marcenaria por unidade, então colocamos 2 aqui.',
    answer: 2,
  },
  {
    cell: '0-1',
    title: 'Restrição 1 → Coluna B',
    description:
      'A mesa B gasta 1 hora de marcenaria por unidade, então colocamos 1 aqui.',
    answer: 1,
  },
  {
    cell: '0-4',
    title: 'Restrição 1 → Solução',
    description:
      'A fábrica tem 120 horas de marcenaria disponíveis por semana, então o total é 120.',
    answer: 120,
  },
  {
    cell: '1-0',
    title: 'Restrição 2 → Coluna A',
    description:
      'A cadeira A gasta 1 hora de acabamento por unidade, então colocamos 1 aqui.',
    answer: 1,
  },
  {
    cell: '1-1',
    title: 'Restrição 2 → Coluna B',
    description:
      'A mesa B gasta 3 horas de acabamento por unidade, então colocamos 3 aqui.',
    answer: 3,
  },
  {
    cell: '1-3',
    title: 'Restrição 2 → Solução',
    description:
      'A fábrica tem 90 horas de acabamento disponíveis por semana, então o total é 90.',
    answer: 90,
  },
  {
    cell: '2-0',
    title: 'Função Objetivo → Coluna A',
    description:
      'O lucro da cadeira A é R$ 40, mas na tabela Simplex entramos com o negativo: -40.',
    answer: -40,
  },
  {
    cell: '2-1',
    title: 'Função Objetivo → Coluna B',
    description:
      'O lucro da mesa B é R$ 60, mas na tabela Simplex entramos com o negativo: -60.',
    answer: -60,
  },
]

export function getIntroSteps() {
  return [
    {
      element: '[data-simplex-problem]',
      popover: {
        title: 'O Problema',
        description:
          'Leia com atenção: a fábrica quer maximizar o lucro produzindo cadeiras e mesas, com limites de horas.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[data-simplex-table]',
      popover: {
        title: 'A Tabela Simplex',
        description:
          'Esta é a tabela que vamos preencher juntos. Cada célula representa um dado do problema.',
        side: 'top' as const,
      },
    },
  ]
}

export function getCellSteps() {
  return FILL_STEPS.map((step) => ({
    element: `[data-cell="${step.cell}"]`,
    popover: {
      title: step.title,
      description: step.description,
      side: 'bottom' as const,
    },
  }))
}

export function startIntroTour(onDone: () => void, onStepChange?: (index: number) => void) {
  destroyTour()

  driverInstance = driver({
    steps: getIntroSteps(),
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.8)',
    overlayOpacity: 0.85,
    stagePadding: 10,
    stageRadius: 12,
    allowClose: true,
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Vamos preencher!',
    onHighlightStarted: (_element, _step, opts) => {
      onStepChange?.(opts.state.activeIndex ?? 0)
    },
    onDestroyed: () => {
      onDone()
    },
  })

  driverInstance.drive()
}

export function startFillTour(onCorrect: (index: number) => void, onComplete: () => void) {
  destroyTour()

  const steps = getCellSteps()

  driverInstance = driver({
    steps,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.8)',
    overlayOpacity: 0.85,
    stagePadding: 12,
    stageRadius: 12,
    allowClose: true,
    showProgress: true,
    progressText: 'Célula {{current}} de {{total}}',
    nextBtnText: 'Avançar',
    prevBtnText: 'Voltar',
    doneBtnText: 'Resolver!',
    disableButtons: ['next'],
    onNextClick: (_element, _step, opts) => {
      const activeIndex = opts.state.activeIndex ?? 0
      const cellStep = FILL_STEPS[activeIndex]
      if (cellStep) {
        onCorrect(activeIndex)
      }
      opts.driver.moveNext()
    },
    onDestroyed: () => {
      onComplete()
    },
  })

  driverInstance.drive()
}

export function destroyTour() {
  if (driverInstance) {
    driverInstance.destroy()
    driverInstance = null
  }
}
