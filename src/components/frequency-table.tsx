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

  const sumSquaredDeviation = table.rows.reduce(
    (sum, row) => sum + row.squaredDeviationTimesFrequency,
    0,
  )

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>i</TableHead>
            <TableHead>x1</TableHead>
            <TableHead className="text-center">fi</TableHead>
            <TableHead className="text-center">fa</TableHead>
            <TableHead className="text-center">fr(%)</TableHead>
            <TableHead className="text-center">fra(%)</TableHead>
            <TableHead className="text-center">xm</TableHead>
            <TableHead className="text-center">xm · fi</TableHead>
            <TableHead className="text-center">x̄</TableHead>
            <TableHead className="text-center">(xm−x̄)² · f</TableHead>
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
              <TableCell className="font-medium">{row.index}</TableCell>
              <TableCell>{row.classLabel}</TableCell>
              <TableCell className="text-center tabular-nums">{row.frequency}</TableCell>
              <TableCell className="text-center tabular-nums">
                {row.cumulativeFrequency}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.relativePct.toFixed(2)}%
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.cumulativeRelativePct.toFixed(2)}%
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.midpoint.toFixed(2)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.midpointTimesFrequency.toFixed(2)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {table.mean.toFixed(2)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.squaredDeviationTimesFrequency.toFixed(4)}
              </TableCell>
            </motion.tr>
          ))}
          <TableRow className="border-t-2 border-border font-semibold">
            <TableCell>Total</TableCell>
            <TableCell>—</TableCell>
            <TableCell className="text-center tabular-nums">{table.sumFi}</TableCell>
            <TableCell className="text-center tabular-nums">{table.n}</TableCell>
            <TableCell className="text-center tabular-nums">100%</TableCell>
            <TableCell className="text-center tabular-nums">100%</TableCell>
            <TableCell className="text-center tabular-nums">—</TableCell>
            <TableCell className="text-center tabular-nums">
              {table.sumXiFi.toFixed(2)}
            </TableCell>
            <TableCell className="text-center tabular-nums">—</TableCell>
            <TableCell className="text-center tabular-nums">
              {sumSquaredDeviation.toFixed(4)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="mt-3 text-xs text-muted-foreground">
        {table.n} valores · {table.k} classes (k = ⌈√n⌉) · amplitude da classe h ={' '}
        {table.h.toFixed(2)}
      </p>
    </div>
  )
}