import { useState } from 'react'
import { Calculator, Ruler } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card.tsx'

interface HeightsInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  error: string | null
}

export function HeightsInput({ value, onChange, onSubmit, error }: HeightsInputProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    onSubmit()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Ruler className="size-4 text-primary" />
          Alturas dos alunos (cm)
        </CardTitle>
        <CardDescription>
          Digite as alturas em centímetros, separadas por <strong>espaço</strong>. Depois clique
          em "Calcular".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label="Alturas dos alunos em centímetros, separadas por espaço"
          aria-invalid={submitted && error !== null}
          rows={4}
          placeholder="ex.: 152 155 158 160 163 165"
          className={cnTextarea(submitted && error !== null)}
        />
        {submitted && error && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button size="sm" className="mt-3 w-full sm:w-auto" onClick={handleSubmit}>
          <Calculator />
          Calcular
        </Button>
      </CardContent>
    </Card>
  )
}

function cnTextarea(invalid: boolean) {
  return [
    'mt-1 w-full resize-y rounded-md border bg-background px-3 py-2',
    'font-mono text-sm leading-relaxed outline-none transition-colors',
    'focus-visible:ring-2 focus-visible:ring-ring',
    invalid ? 'border-destructive' : 'border-input',
  ].join(' ')
}