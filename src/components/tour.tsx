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
      'Cada cadeira gasta 2h de marcenaria. Qual o coeficiente de A na primeira restrição?',
    answer: 2,
  },
  {
    cell: '0-1',
    title: 'Restrição 1 → Coluna B',
    description:
      'Cada mesa gasta 1h de marcenaria. Qual o coeficiente de B na primeira restrição?',
    answer: 1,
  },
  {
    cell: '0-3',
    title: 'Restrição 1 → Solução',
    description:
      'Total de horas disponíveis de marcenaria: 120h. Preencha o lado direito.',
    answer: 120,
  },
  {
    cell: '1-0',
    title: 'Restrição 2 → Coluna A',
    description:
      'Cada cadeira gasta 1h de acabamento. Qual o coeficiente de A na segunda restrição?',
    answer: 1,
  },
  {
    cell: '1-1',
    title: 'Restrição 2 → Coluna B',
    description:
      'Cada mesa gasta 3h de acabamento. Qual o coeficiente de B na segunda restrição?',
    answer: 3,
  },
  {
    cell: '1-3',
    title: 'Restrição 2 → Solução',
    description:
      'Total de horas disponíveis de acabamento: 90h. Preencha o lado direito.',
    answer: 90,
  },
  {
    cell: '2-0',
    title: 'Função Objetivo → Coluna A',
    description:
      'Lucro por cadeira: R$ 40. Na tabela Simplex, colocamos o negativo. Qual valor?',
    answer: -40,
  },
  {
    cell: '2-1',
    title: 'Função Objetivo → Coluna B',
    description:
      'Lucro por mesa: R$ 60. Negativo na tabela. Qual valor?',
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

export function startIntroTour(onDone: () => void) {
  destroyTour()

  driverInstance = driver({
    steps: getIntroSteps(),
    animate: true,
    overlayColor: 'rgba(23, 58, 64, 0.65)',
    overlayOpacity: 0.7,
    stagePadding: 10,
    stageRadius: 12,
    allowClose: true,
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Vamos preencher!',
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
    overlayColor: 'rgba(23, 58, 64, 0.65)',
    overlayOpacity: 0.7,
    stagePadding: 12,
    stageRadius: 12,
    allowClose: true,
    showProgress: true,
    progressText: 'Célula {{current}} de {{total}}',
    nextBtnText: 'Confirmar',
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
