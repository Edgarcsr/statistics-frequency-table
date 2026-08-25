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

  const isEditableCell = (_row: number, col: number) => {
    if (!editable) return false
    if (col === values[0].length - 1) return false
    return true
  }

  return (
    <div data-simplex-table={step}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50">
            <TableHead className="font-bold text-center min-w-[80px] text-xs uppercase tracking-widest text-muted-foreground">
              Base
            </TableHead>
            {tableau.headers.map((h, j) => (
              <TableHead
                key={j}
                className="font-bold text-center min-w-[100px] text-xs uppercase tracking-widest text-muted-foreground"
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
                  ? 'border-t border-border/50 bg-muted/30'
                  : 'border-border/30'
              }
            >
              <TableCell
                className={`font-bold text-center text-sm ${
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
                    className={`text-center tabular-nums transition-all duration-150 ${
                      isPivot(i, j)
                        ? 'bg-primary text-primary-foreground font-bold'
                        : isHighlighted(i, j)
                          ? 'bg-muted/50'
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
                        className={`w-16 h-9 text-center text-sm font-mono rounded-md outline-none transition-all duration-150 ${
                          filled
                            ? 'bg-muted/40 text-foreground focus:ring-2 focus:ring-primary'
                            : 'bg-muted/20 text-muted-foreground focus:ring-2 focus:ring-primary'
                        } ${isHighlighted(i, j) ? 'bg-primary/5' : ''}`}
                      />
                    ) : (
                      <span className="text-sm">
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
