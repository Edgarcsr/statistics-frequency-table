import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { type SimplexProblem } from '#/lib/simplex.ts'

let driverInstance: Driver | null = null

export interface CellStep {
  cell: string
  title: string
  description: string
  answer: number
}

const ORIGINAL_STEPS: Record<string, { title: string; description: string }> = {
  'c0-v0': {
    title: 'Restrição 1 → Coluna A',
    description:
      'A cadeira A gasta 2 horas de marcenaria por unidade, então colocamos 2 aqui.',
  },
  'c0-v1': {
    title: 'Restrição 1 → Coluna B',
    description:
      'A mesa B gasta 1 hora de marcenaria por unidade, então colocamos 1 aqui.',
  },
  'c0-sol': {
    title: 'Restrição 1 → Solução',
    description:
      'A fábrica tem 120 horas de marcenaria disponíveis por semana, então o total é 120.',
  },
  'c1-v0': {
    title: 'Restrição 2 → Coluna A',
    description:
      'A cadeira A gasta 1 hora de acabamento por unidade, então colocamos 1 aqui.',
  },
  'c1-v1': {
    title: 'Restrição 2 → Coluna B',
    description:
      'A mesa B gasta 3 horas de acabamento por unidade, então colocamos 3 aqui.',
  },
  'c1-sol': {
    title: 'Restrição 2 → Solução',
    description:
      'A fábrica tem 90 horas de acabamento disponíveis por semana, então o total é 90.',
  },
  'z-v0': {
    title: 'Função Objetivo → Coluna A',
    description:
      'O lucro da cadeira A é R$ 40, mas na tabela Simplex entramos com o negativo: -40.',
  },
  'z-v1': {
    title: 'Função Objetivo → Coluna B',
    description:
      'O lucro da mesa B é R$ 60, mas na tabela Simplex entramos com o negativo: -60.',
  },
}

export function generateFillSteps(problem: SimplexProblem): CellStep[] {
  const nVars = problem.varNames.length
  const nConstraints = problem.constraints.length
  const solCol = nVars + nConstraints
  const zRow = nConstraints

  const steps: CellStep[] = []

  problem.constraints.forEach((constraint, i) => {
    constraint.coefficients.forEach((coef, j) => {
      const original = ORIGINAL_STEPS[`c${i}-v${j}`]
      steps.push({
        cell: `${i}-${j}`,
        title: original?.title ?? `${constraint.label} → Coluna ${problem.varNames[j]}`,
        description:
          original?.description ??
          `O coeficiente de ${problem.varNames[j]} na restrição ${constraint.label} é ${coef}.`,
        answer: coef,
      })
    })
    const solOriginal = ORIGINAL_STEPS[`c${i}-sol`]
    steps.push({
      cell: `${i}-${solCol}`,
      title: solOriginal?.title ?? `${constraint.label} → Solução`,
      description:
        solOriginal?.description ??
        `O lado direito da restrição ${constraint.label} é ${constraint.rhs}.`,
      answer: constraint.rhs,
    })
  })

  problem.objective.forEach((coef, j) => {
    const answer = problem.maximize ? -coef : coef
    const original = ORIGINAL_STEPS[`z-v${j}`]
    steps.push({
      cell: `${zRow}-${j}`,
      title: original?.title ?? `Função Objetivo → Coluna ${problem.varNames[j]}`,
      description:
        problem.maximize
          ? (original?.description ??
            `Na linha Z, o valor de ${problem.varNames[j]} entra com o sinal invertido: ${answer}.`)
          : `Na linha Z (minimização), o coeficiente de ${problem.varNames[j]} entra como ${answer}.`,
      answer,
    })
  })

  return steps
}

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

function getCellSteps(fillSteps: CellStep[]) {
  return fillSteps.map((step) => ({
    element: `[data-cell="${step.cell}"]`,
    popover: {
      title: step.title,
      description: step.description,
      side: 'bottom' as const,
    },
  }))
}

function getZRowStep() {
  return {
    element: '[data-simplex-zrow]',
    popover: {
      title: 'Por que a linha Z começa negativa?',
      description:
        'A linha Z guarda o lucro (ou custo) de cada variável com o sinal invertido. Enquanto ' +
        'houver um coeficiente negativo ali, aumentar aquela variável ainda melhora o resultado ' +
        '— ou seja, ainda existe uma direção de melhora. Quando não sobrar nenhum coeficiente ' +
        'negativo, nenhuma variável melhora mais o resultado: a solução é ótima.',
      side: 'top' as const,
    },
  }
}

function getConfirmSteps(problem: SimplexProblem) {
  return [
    {
      element: '[data-simplex-objective]',
      popover: {
        title: 'Confirme o objetivo',
        description: problem.maximize
          ? 'Este é um problema de maximização — confirme que "Max" está selecionado antes de resolver.'
          : 'Este é um problema de minimização — confirme que "Min" está selecionado antes de resolver.',
        side: 'top' as const,
        disableButtons: [] as ('next' | 'previous' | 'close')[],
      },
    },
    {
      element: '[data-simplex-solve]',
      popover: {
        title: 'Tudo preenchido!',
        description: 'Agora clique em "Resolver" para acompanhar o simplex passo a passo.',
        side: 'top' as const,
        disableButtons: [] as ('next' | 'previous' | 'close')[],
      },
    },
  ]
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

export function startFillTour(
  problem: SimplexProblem,
  onCorrect: (step: CellStep) => void,
  onComplete: () => void,
) {
  destroyTour()

  const fillSteps = generateFillSteps(problem)

  driverInstance = driver({
    steps: [...getCellSteps(fillSteps), getZRowStep(), ...getConfirmSteps(problem)],
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
      const cellStep = fillSteps[activeIndex]
      if (cellStep) {
        onCorrect(cellStep)
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
