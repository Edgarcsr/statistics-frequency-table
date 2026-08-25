export interface SimplexProblem {
  title: string
  context: string
  objective: number[]
  objectiveFn: string
  varNames: string[]
  constraints: {
    coefficients: number[]
    label: string
    rhs: number
  }[]
  maximize: boolean
}

export interface SimplexTableau {
  matrix: number[][]
  basis: string[]
  headers: string[]
  pivot?: { row: number; col: number }
  entering?: number
  leaving?: number
}

export interface SimplexStep {
  tableau: SimplexTableau
  description: string
  highlight?: { row: number; col: number }[]
}

const EPSILON = 1e-10

export function buildInitialTableau(problem: SimplexProblem): SimplexTableau {
  const nVars = problem.objective.length
  const nConstraints = problem.constraints.length
  const cols = nVars + nConstraints + 1

  const matrix: number[][] = []
  const basis: string[] = []

  for (let i = 0; i < nConstraints; i++) {
    const row = new Array(cols).fill(0)
    for (let j = 0; j < nVars; j++) {
      row[j] = problem.constraints[i].coefficients[j]
    }
    row[nVars + i] = 1
    row[cols - 1] = problem.constraints[i].rhs
    matrix.push(row)
    basis.push(`s${i + 1}`)
  }

  const zRow = new Array(cols).fill(0)
  for (let j = 0; j < nVars; j++) {
    zRow[j] = problem.maximize ? -problem.objective[j] : problem.objective[j]
  }
  matrix.push(zRow)
  basis.push('Z')

  const headers = [
    ...problem.varNames,
    ...Array.from({ length: nConstraints }, (_, i) => `s${i + 1}`),
    'Sol',
  ]

  return { matrix, basis, headers }
}

export function findPivot(tableau: SimplexTableau): { row: number; col: number } | null {
  const zRow = tableau.matrix[tableau.matrix.length - 1]
  const cols = zRow.length - 1

  let entering = -1
  let minVal = -EPSILON
  for (let j = 0; j < cols; j++) {
    if (zRow[j] < minVal) {
      minVal = zRow[j]
      entering = j
    }
  }

  if (entering === -1) return null

  let leaving = -1
  let minRatio = Infinity
  for (let i = 0; i < tableau.matrix.length - 1; i++) {
    const val = tableau.matrix[i][entering]
    if (val > EPSILON) {
      const ratio = tableau.matrix[i][tableau.matrix[i].length - 1] / val
      if (ratio < minRatio) {
        minRatio = ratio
        leaving = i
      }
    }
  }

  if (leaving === -1) return null

  return { row: leaving, col: entering }
}

export function pivot(tableau: SimplexTableau, row: number, col: number): SimplexTableau {
  const newMatrix = tableau.matrix.map((r) => [...r])
  const newBasis = [...tableau.basis]
  const pivotVal = newMatrix[row][col]

  for (let j = 0; j < newMatrix[row].length; j++) {
    newMatrix[row][j] /= pivotVal
  }

  for (let i = 0; i < newMatrix.length; i++) {
    if (i === row) continue
    const factor = newMatrix[i][col]
    for (let j = 0; j < newMatrix[i].length; j++) {
      newMatrix[i][j] -= factor * newMatrix[row][j]
    }
  }

  newBasis[row] = tableau.headers[col]

  return {
    matrix: newMatrix,
    basis: newBasis,
    headers: [...tableau.headers],
  }
}

export function isOptimal(tableau: SimplexTableau): boolean {
  const zRow = tableau.matrix[tableau.matrix.length - 1]
  for (let j = 0; j < zRow.length - 1; j++) {
    if (zRow[j] < -EPSILON) return false
  }
  return true
}

export function solveStepByStep(problem: SimplexProblem): SimplexStep[] {
  const steps: SimplexStep[] = []
  let tableau = buildInitialTableau(problem)

  steps.push({
    tableau,
    description:
      'Tabela inicial montada. As variáveis de folga (s₁, s₂) representam os recursos não utilizados de cada restrição.',
  })

  let iteration = 0
  while (!isOptimal(tableau) && iteration < 20) {
    const pivotPos = findPivot(tableau)
    if (!pivotPos) break

    const entering = tableau.headers[pivotPos.col]
    const leavingVar = tableau.basis[pivotPos.row]

    tableau = { ...tableau, pivot: pivotPos, entering: pivotPos.col, leaving: pivotPos.row }

    steps.push({
      tableau,
      description: `Iteração ${iteration + 1}: ${entering} entra na base (maior custo-benefício). ${leavingVar} sai (menor razão).`,
      highlight: [{ row: pivotPos.row, col: pivotPos.col }],
    })

    tableau = pivot(tableau, pivotPos.row, pivotPos.col)

    steps.push({
      tableau,
      description: `Após pivotear: ${tableau.basis[pivotPos.row]} agora está na base. Recurso alocado de forma mais eficiente.`,
    })

    iteration++
  }

  if (isOptimal(tableau)) {
    const zVal = tableau.matrix[tableau.matrix.length - 1][tableau.matrix[0].length - 1]
    const solutions = problem.varNames.map((name) => {
      const row = tableau.basis.indexOf(name)
      return row !== -1 ? tableau.matrix[row][tableau.matrix[row].length - 1] : 0
    })
    const solStr = problem.varNames
      .map((name, i) => `${name} = ${solutions[i]}`)
      .join(', ')
    steps.push({
      tableau,
      description: `Solução ótima! Produza ${solStr}. Lucro máximo: R$ ${zVal}`,
    })
  }

  return steps
}

export function getDefaultProblem(): SimplexProblem {
  return {
    title: 'Produção de Móveis',
    context:
      'Uma fábrica produz duas cadeiras (A) e mesas (B). Cada cadeira gasta 2h de marcenaria e 1h de acabamento. Cada mesa gasta 1h de marcenaria e 3h de acabamento. A fábrica tem 120h de marcenaria e 90h de acabamento disponíveis por semana. Lucro: R$ 40 por cadeira, R$ 60 por mesa.',
    objective: [40, 60],
    objectiveFn: 'Z = 40A + 60B',
    varNames: ['A', 'B'],
    constraints: [
      { coefficients: [2, 1], label: 'Marcenaria', rhs: 120 },
      { coefficients: [1, 3], label: 'Acabamento', rhs: 90 },
    ],
    maximize: true,
  }
}
