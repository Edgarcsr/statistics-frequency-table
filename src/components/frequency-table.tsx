import { motion } from 'motion/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import type { FrequencyTable } from '#/utils/types.ts'

interface FrequencyTableProps {
  table: FrequencyTable | null
}

export function FrequencyTableView({ table }: FrequencyTableProps) {
  if (!table || table.rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem dados suficientes para montar a tabela de frequências.
      </p>
    )
  }

  const lastRow = table.rows[table.rows.length - 1]

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Classe</TableHead>
            <TableHead className="text-center">fi</TableHead>
            <TableHead className="text-center">fr</TableHead>
            <TableHead className="text-center">fr (%)</TableHead>
            <TableHead className="text-center">Fi</TableHead>
            <TableHead className="text-center">Fi (%)</TableHead>
            <TableHead className="text-center">xi</TableHead>
            <TableHead className="text-center">xi · fi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row, index) => (
            <motion.tr
              key={row.index}
              className="transition-colors hover:bg-muted/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.1 + index * 0.035,
                duration: 0.22,
                ease: 'easeOut',
              }}
            >
              <TableCell className="font-medium">{row.className}</TableCell>
              <TableCell className="text-center tabular-nums">{row.fi}</TableCell>
              <TableCell className="text-center tabular-nums">{row.fr.toFixed(2)}</TableCell>
              <TableCell className="text-center tabular-nums">{row.frPct.toFixed(1)}%</TableCell>
              <TableCell className="text-center tabular-nums">{row.Fi}</TableCell>
              <TableCell className="text-center tabular-nums">{row.FiPct.toFixed(1)}%</TableCell>
              <TableCell className="text-center tabular-nums">{row.xi.toFixed(1)}</TableCell>
              <TableCell className="text-center tabular-nums">{row.xiFi.toFixed(1)}</TableCell>
            </motion.tr>
          ))}
          <TableRow className="border-t-2 border-border font-semibold">
            <TableCell>Total</TableCell>
            <TableCell className="text-center tabular-nums">{lastRow.Fi}</TableCell>
            <TableCell className="text-center tabular-nums">1.00</TableCell>
            <TableCell className="text-center tabular-nums">
              {table.sumFiPct.toFixed(1)}%
            </TableCell>
            <TableCell className="text-center tabular-nums">—</TableCell>
            <TableCell className="text-center tabular-nums">100%</TableCell>
            <TableCell className="text-center tabular-nums">—</TableCell>
            <TableCell className="text-center tabular-nums">
              {table.sumXiFi.toFixed(1)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="mt-3 text-xs text-muted-foreground">
        {table.n} valores · {table.k} classes (regra de Sturges: k = 1 + 3,322 · log₁₀ n) ·
        amplitude da classe h = {table.h.toFixed(2)}
      </p>
    </div>
  )
}