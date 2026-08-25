import { type SimplexTableau } from '#/lib/simplex.ts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'

interface SimplexTableProps {
  tableau: SimplexTableau
  values: number[][]
  onChange?: (row: number, col: number, value: string) => void
  editable?: boolean
  highlight?: { row: number; col: number }[]
  pivotCell?: { row: number; col: number }
  filledCells?: Set<string>
  step?: number
}

export function SimplexTable({
  tableau,
  values,
  onChange,
  editable = false,
  highlight = [],
  pivotCell,
  filledCells = new Set(),
  step,
}: SimplexTableProps) {
  const isHighlighted = (row: number, col: number) =>
    highlight.some((h) => h.row === row && h.col === col)

  const isPivot = (row: number, col: number) =>
    pivotCell?.row === row && pivotCell?.col === col

  const isZRow = (row: number) => tableau.basis[row] === 'Z'

  const isFilled = (row: number, col: number) =>
    filledCells.has(`${row}-${col}`)

  const isEditableCell = (row: number, col: number) => {
    if (!editable) return false
    if (isZRow(row)) return false
    if (col === values[0].length - 1) return false
    return true
  }

  return (
    <div className="flex justify-center" data-simplex-table={step}>
      <Table className="w-auto">
        <TableHeader>
          <TableRow className="border-b-2 border-foreground/20">
            <TableHead className="font-bold text-center min-w-[80px] text-sm uppercase tracking-wider">
              Base
            </TableHead>
            {tableau.headers.map((h, j) => (
              <TableHead
                key={j}
                className="font-bold text-center min-w-[90px] text-sm uppercase tracking-wider"
                data-col={h}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map((row, i) => (
            <TableRow
              key={i}
              className={
                isZRow(i)
                  ? 'border-t-2 border-foreground/20 bg-[var(--sand)]'
                  : ''
              }
            >
              <TableCell
                className={`font-bold text-center text-base ${
                  isZRow(i) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {tableau.basis[i]}
              </TableCell>
              {row.map((val, j) => {
                const editable_ = isEditableCell(i, j)
                const filled = isFilled(i, j)
                return (
                  <TableCell
                    key={j}
                    className={`text-center tabular-nums transition-all ${
                      isPivot(i, j)
                        ? 'bg-[var(--lagoon)] text-white font-bold shadow-md scale-105'
                        : isHighlighted(i, j)
                          ? 'bg-[var(--lagoon)]/10 font-medium'
                          : isZRow(i)
                            ? 'font-semibold text-base'
                            : ''
                    }`}
                    data-row={tableau.basis[i]}
                    data-col={tableau.headers[j]}
                    data-cell={`${i}-${j}`}
                  >
                    {editable_ ? (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={val === 0 ? '' : String(Number.isInteger(val) ? val : val.toFixed(2))}
                        onChange={(e) => onChange?.(i, j, e.target.value)}
                        placeholder="?"
                        className={`w-16 h-10 text-center text-base font-mono rounded-lg border-2 transition-all outline-none ${
                          filled
                            ? 'border-[var(--lagoon)] bg-[var(--lagoon)]/5 focus:border-[var(--lagoon-deep)]'
                            : 'border-[var(--line)] bg-white/50 focus:border-[var(--lagoon)] focus:bg-white'
                        } ${isHighlighted(i, j) ? 'border-[var(--lagoon)] shadow-md' : ''}`}
                      />
                    ) : (
                      <span className="text-base">
                        {Number.isInteger(val) ? val : val.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
