import { type StepExplain } from '#/lib/simplex.ts'

interface StepExplanationProps {
  description: string
  explain?: StepExplain
}

export function StepExplanation({ description, explain }: StepExplanationProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      {explain?.kind === 'choose-pivot' && (
        <div className="space-y-3 border-t border-border/50 pt-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              1. Coluna entrante (linha Z)
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Entre os coeficientes negativos da linha Z, escolhe-se o mais negativo:
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {explain.zCandidates?.map((c) => (
                <span
                  key={c.col}
                  className={`px-2 py-0.5 rounded-md text-xs font-mono ${
                    c.header === explain.enteringVar
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {c.header} = {c.value.toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              2. Linha de saída (teste da razão)
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Para cada linha, divide-se Sol pelo coeficiente da coluna de{' '}
              <span className="font-mono font-bold">{explain.enteringVar}</span>. Vence a menor
              razão não negativa:
            </p>
            <div className="mt-1.5 space-y-1">
              {explain.ratios?.map((r) => (
                <div
                  key={r.row}
                  className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md ${
                    r.basisVar === explain.leavingVar
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="w-8">{r.basisVar}</span>
                  <span>
                    {r.coef > 0
                      ? `${r.sol.toFixed(2)} ÷ ${r.coef.toFixed(2)} = ${r.ratio?.toFixed(2)}`
                      : `coeficiente ${r.coef.toFixed(2)} ≤ 0 → não entra na disputa`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {explain?.kind === 'after-pivot' && (
        <div className="space-y-2 border-t border-border/50 pt-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Eliminação de Gauss-Jordan aplicada
          </p>
          <div className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary">
            nova linha {explain.leavingVar} → {explain.enteringVar} = linha antiga ÷{' '}
            {explain.pivotValue?.toFixed(2)} (elemento pivô)
          </div>
          <div className="space-y-1">
            {explain.factors?.map((f) => (
              <div
                key={f.row}
                className="flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md text-muted-foreground"
              >
                <span className="w-8">{f.basisVar}</span>
                <span>
                  nova linha = linha antiga − ({f.factor.toFixed(2)}) × nova linha{' '}
                  {explain.enteringVar}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
