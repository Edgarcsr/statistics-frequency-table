import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

let driverInstance: Driver | null = null

export function getTourSteps() {
  return [
    {
      element: '[data-simplex-problem]',
      popover: {
        title: 'Problema de Otimização',
        description:
          'Este é nosso problema: maximizar Z sujeito a restrições. Vamos extrair os dados para montar a tabela.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[data-col="x1"], [data-col="x2"]',
      popover: {
        title: 'Variáveis de Decisão',
        description:
          'x₁ e x₂ são as variáveis que queremos determinar. Os coeficientes vêm da função objetivo.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[data-col="s1"]',
      popover: {
        title: 'Variáveis de Folga',
        description:
          's₁, s₂, s₃ convertem desigualdades em igualdades. Cada restrição recebe uma folga.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[data-col="Sol"]',
      popover: {
        title: 'Lado Direito',
        description:
          'O valor do lado direito de cada restrição. É o limite da nossa restrição.',
        side: 'left' as const,
      },
    },
    {
      element: '[data-row="Z"]',
      popover: {
        title: 'Função Objetivo',
        description:
          'A linha Z mostra os coeficientes negativos da função objetivo. Quando todos forem ≥ 0, encontramos o ótimo.',
        side: 'top' as const,
      },
    },
    {
      element: '[data-simplex-start]',
      popover: {
        title: 'Resolver!',
        description:
          'Clique para iniciar a resolução passo a passo. Cada iteração mostra a variável que entra e sai da base.',
        side: 'top' as const,
      },
    },
  ]
}

export function startTour() {
  if (driverInstance) {
    driverInstance.destroy()
  }

  driverInstance = driver({
    steps: getTourSteps(),
    animate: true,
    overlayColor: 'rgba(23, 58, 64, 0.6)',
    overlayOpacity: 0.7,
    stagePadding: 8,
    stageRadius: 8,
    allowClose: true,
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
  })

  driverInstance.drive()
}

export function destroyTour() {
  if (driverInstance) {
    driverInstance.destroy()
    driverInstance = null
  }
}
