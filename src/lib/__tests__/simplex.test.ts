import { buildInitialTableau, findPivot, pivot, isOptimal, getDefaultProblem } from '../simplex'

describe('Simplex Mathematics', () => {
  describe('buildInitialTableau', () => {
    it('builds tableau with 2 variables and 2 constraints', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      expect(tableau.matrix.length).toBe(3)
      expect(tableau.matrix[0].length).toBe(5)
      expect(tableau.basis).toEqual(['s1', 's2', 'Z'])
    })

    it('builds tableau with 3 variables and 1 constraint', () => {
      const problem = {
        title: 'Test',
        context: '',
        objective: [3, 4, 5],
        objectiveFn: 'Z = 3A + 4B + 5C',
        varNames: ['A', 'B', 'C'],
        constraints: [{ coefficients: [1, 2, 3], label: 'c1', rhs: 10 }],
        maximize: true,
      }
      const tableau = buildInitialTableau(problem)
      expect(tableau.matrix.length).toBe(2)
      expect(tableau.matrix[0].length).toBe(5)
    })
  })

  describe('findPivot', () => {
    it('finds pivot for default problem', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      const choice = findPivot(tableau)
      expect(choice).not.toBeNull()
      expect(choice?.col).toBe(1)
      expect(choice?.row).toBe(1)
    })

    it('returns null when already optimal', () => {
      const problem = {
        title: 'Test',
        context: '',
        objective: [1, 2],
        objectiveFn: 'Z = 1A + 2B',
        varNames: ['A', 'B'],
        constraints: [{ coefficients: [0, 0], label: 'c1', rhs: 5 }],
        maximize: true,
      }
      const tableau = buildInitialTableau(problem)
      const choice = findPivot(tableau)
      expect(choice).toBeNull()
    })
  })

  describe('pivot', () => {
    it('performs pivot operation', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      const choice = findPivot(tableau)
      expect(choice).not.toBeNull()
      const result = pivot(tableau, choice!.row, choice!.col)
      expect(result.tableau).toBeDefined()
      expect(result.pivotValue).toBeGreaterThan(0)
    })

    it('updates basis after pivot', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      const choice = findPivot(tableau)
      const result = pivot(tableau, choice!.row, choice!.col)
      expect(result.tableau.basis[choice!.row]).toBe('B')
    })
  })

  describe('isOptimal', () => {
    it('returns false when not optimal', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      expect(isOptimal(tableau)).toBe(false)
    })

    it('returns false after single pivot (needs more iterations)', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      const choice = findPivot(tableau)
      const result = pivot(tableau, choice!.row, choice!.col)
      expect(isOptimal(result.tableau)).toBe(false)
    })

    it('returns true after enough pivots reaches optimum', () => {
      const problem = getDefaultProblem()
      const tableau = buildInitialTableau(problem)
      let choice = findPivot(tableau)
      let result = pivot(tableau, choice!.row, choice!.col)
      let iteration = 1
      while (!isOptimal(result.tableau) && iteration < 10) {
        choice = findPivot(result.tableau)!
        result = pivot(result.tableau, choice!.row, choice!.col)
        iteration++
      }
      expect(isOptimal(result.tableau)).toBe(true)
    })
  })
})