export interface SimplexProblem {
  objective: number[]
  constraints: { coefficients: number[]; rhs: number }[]
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
    ...Array.from({ length: nVars }, (_, i) => `x${i + 1}`),
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
      const ratio = tableau.matrix[i][tableau.matrix.length > 0 ? tableau.matrix[i].length - 1 : 0] / val
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
    description: 'Tabela inicial: identificamos as variáveis de folga e os coeficientes.',
  })

  let iteration = 0
  while (!isOptimal(tableau) && iteration < 20) {
    const pivotPos = findPivot(tableau)
    if (!pivotPos) break

    const entering = tableau.headers[pivotPos.col]
    const leaving = tableau.basis[pivotPos.row]

    tableau = { ...tableau, pivot: pivotPos, entering: pivotPos.col, leaving: pivotPos.row }

    steps.push({
      tableau,
      description: `Iteração ${iteration + 1}: variável ${entering} entra, ${leaving} sai. Pivô em (${pivotPos.row + 1}, ${pivotPos.col + 1}).`,
      highlight: [{ row: pivotPos.row, col: pivotPos.col }],
    })

    tableau = pivot(tableau, pivotPos.row, pivotPos.col)

    steps.push({
      tableau,
      description: `Após pivotear: nova tabela com ${tableau.basis[pivotPos.row]} na base.`,
    })

    iteration++
  }

  if (isOptimal(tableau)) {
    const zVal = tableau.matrix[tableau.matrix.length - 1][tableau.matrix[0].length - 1]
    steps.push({
      tableau,
      description: `Solução ótima encontrada! Z = ${zVal}`,
    })
  }

  return steps
}

export function getDefaultProblem(): SimplexProblem {
  return {
    objective: [3, 5],
    constraints: [
      { coefficients: [1, 0], rhs: 4 },
      { coefficients: [0, 1], rhs: 6 },
      { coefficients: [1, 2], rhs: 8 },
    ],
    maximize: true,
  }
}

export function formatProblem(problem: SimplexProblem): string {
  const vars = problem.objective.map((c, i) => `${c}x${i + 1}`).join(' + ')
  const lines = problem.constraints.map((c) => {
    const lhs = c.coefficients.map((val, j) => `${val}x${j + 1}`).join(' + ')
    return `  ${lhs} ≤ ${c.rhs}`
  })
  return `Maximizar Z = ${vars}\nSujeito a:\n${lines.join('\n')}\n  x₁, x₂ ≥ 0`
}
