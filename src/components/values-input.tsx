import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Calculator, Database, Ruler, ShoppingBag, TextSearch, Thermometer } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx'
import type { ExampleDataset } from '#/utils/index.ts'

interface ValuesInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  error: string | null
  examples: ExampleDataset[]
}

export function ValuesInput({ value, onChange, onSubmit, error, examples }: ValuesInputProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    onSubmit()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="size-4 text-primary" />
          Dados
        </CardTitle>
        <CardDescription>
          Digite os valores, separados por <strong>espaço</strong>. Depois clique em "Calcular".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label="Valores separados por espaço"
          aria-invalid={submitted && error !== null}
          rows={4}
          placeholder="ex.: 1,70 1,69 1,82 1,80 1,79 1,74"
          className={cnTextarea(submitted && error !== null)}
        />
        <AnimatePresence>
          {submitted && error && (
            <motion.p
              key={error}
              role="alert"
              className="mt-2 text-xs text-destructive"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="mt-3 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Carregar exemplo">
                <TextSearch />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuLabel>Exemplos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {examples.map((example) => (
                <DropdownMenuItem
                  key={example.id}
                  onClick={() => onChange(example.values.join(' '))}
                >
                  <ExampleIcon id={example.id} />
                  {example.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="flex-1" onClick={handleSubmit}>
            <Calculator />
            Calcular
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const EXAMPLE_ICONS: Record<string, typeof Ruler> = {
  alturas: Ruler,
  temperaturas: Thermometer,
  precos: ShoppingBag,
}

function ExampleIcon({ id }: { id: string }) {
  const Icon = EXAMPLE_ICONS[id] ?? Ruler
  return <Icon className="size-4 text-primary" />
}

function cnTextarea(invalid: boolean) {
  return [
    'mt-1 w-full resize-y rounded-md border bg-background px-3 py-2',
    'font-mono text-sm leading-relaxed outline-none transition-colors',
    'focus-visible:ring-2 focus-visible:ring-primary/40',
    invalid ? 'border-destructive' : 'border-input',
  ].join(' ')
}