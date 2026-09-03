import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/metodo')({
  component: Metodo,
  head: () => ({
    meta: [{ title: 'Tabela de Frequências | Método' }],
  }),
})

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  )
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-[13px] leading-relaxed text-foreground">
      {children}
    </pre>
  )
}

function Metodo() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <article className="w-full max-w-2xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Método</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Resumo das fórmulas usadas para agrupar os dados em classes e calcular as medidas de
          tendência central e de dispersão.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Agrupamento em classes</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Com os dados brutos, calculamos o número de classes pela{' '}
            <strong>regra de Sturges</strong>:
          </p>
          <CodeBlock>{`k = 1 + 3,322 · log₁₀ n

h = (máx − mín) / k`}</CodeBlock>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Cada classe recebe frequência absoluta <Code>fi</Code>, frequência relativa{' '}
            <Code>fr = fi / n</Code>, frequência acumulada <Code>Fi</Code>, ponto médio{' '}
            <Code>xi = (limite inferior + limite superior) / 2</Code> e o produto{' '}
            <Code>xi · fi</Code>.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Média</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Para dados agrupados, a média usa os pontos médios das classes:
          </p>
          <CodeBlock>{`x̄ = Σ(xi · fi) / n`}</CodeBlock>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Mediana</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Localizamos a classe cuja frequência acumulada ultrapassa <Code>n / 2</Code> e
            aplicamos a interpolação:
          </p>
          <CodeBlock>{`Md = L + ( (n/2 − F_ant) / fi ) · h`}</CodeBlock>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Onde <Code>L</Code> é o limite inferior da classe mediana, <Code>F_ant</Code> a
            frequência acumulada anterior e <Code>h</Code> a amplitude da classe.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Moda</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Usamos a fórmula de <strong>Czuber</strong>, sobre a classe de maior frequência (
            <Code>d1</Code> = diferença para a classe anterior, <Code>d2</Code> = diferença para a
            seguinte):
          </p>
          <CodeBlock>{`Mo = L + ( d1 / (d1 + d2) ) · h`}</CodeBlock>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Variância e desvio padrão</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            A variância mede a dispersão em torno da média. Para dados agrupados:
          </p>
          <CodeBlock>{`σ² = Σ( fi · (xi − x̄)² ) / n        (populacional)
s² = Σ( fi · (xi − x̄)² ) / (n − 1)  (amostral)`}</CodeBlock>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            O desvio padrão é a raiz quadrada da variância, na mesma unidade dos dados:
          </p>
          <CodeBlock>{`σ = √σ²    s = √s²`}</CodeBlock>
        </section>
      </article>
    </div>
  )
}