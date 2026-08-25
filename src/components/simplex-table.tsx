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
  highlight?: { row: number; col: number }[]
  step?: number
}

export function SimplexTable({ tableau, highlight = [], step }: SimplexTableProps) {
  const isHighlighted = (row: number, col: number) =>
    highlight.some((h) => h.row === row && h.col === col)

  const isPivot = (row: number, col: number) =>
    tableau.pivot?.row === row && tableau.pivot?.col === col

  return (
    <div className="flex justify-center" data-simplex-table={step}>
      <Table className="w-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center min-w-[60px]">BV</TableHead>
            {tableau.headers.map((h, j) => (
              <TableHead
                key={j}
                className="font-bold text-center min-w-[60px]"
                data-col={h}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableau.matrix.map((row, i) => (
            <TableRow
              key={i}
              className={i === tableau.matrix.length - 1 ? 'border-t-2 font-semibold' : ''}
            >
              <TableCell className="font-bold text-center">{tableau.basis[i]}</TableCell>
              {row.map((val, j) => (
                <TableCell
                  key={j}
                  className={`text-center tabular-nums ${
                    isPivot(i, j)
                      ? 'bg-primary text-primary-foreground font-bold'
                      : isHighlighted(i, j)
                        ? 'bg-muted font-medium'
                        : ''
                  }`}
                  data-row={tableau.basis[i]}
                  data-col={tableau.headers[j]}
                >
                  {Number.isInteger(val) ? val : val.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
