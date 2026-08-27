import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/metodo')({
  component: Metodo,
  head: () => ({
    meta: [{ title: 'Simplex Resolver | Método' }],
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

        <h1 className="mt-6 text-3xl font-bold tracking-tight">O Método Simplex</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Algoritmo clássico de programação linear. Caminha de vértice em vértice da região viável,
          sempre melhorando o resultado, até que não haja mais como melhorar.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">O problema</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Maximizamos uma função objetivo sujeita a restrições lineares. No nosso exemplo, uma
            fábrica decide quantas cadeiras (A) e mesas (B) produzir para maximizar o lucro, com
            horas limitadas de marcenaria e acabamento:
          </p>
          <CodeBlock>
            {`Max Z = 40A + 60B
2A + 1B ≤ 120   (marcenaria)
1A + 3B ≤ 90    (acabamento)
A, B ≥ 0`}
          </CodeBlock>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Forma padrão e variáveis de folga</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            As desigualdades viram igualdades com variáveis de folga, que representam o recurso
            não usado de cada restrição. Elas começam na base, na solução inicial (nada produzido):
          </p>
          <CodeBlock>
            {`2A + 1B + s₁ = 120
1A + 3B + s₂ = 90
s₁ = 120, s₂ = 90`}
          </CodeBlock>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Por que o número negativo na linha da função objetivo
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Escrevemos a função objetivo como uma equação, com a variável <Code>Z</Code> à esquerda
            e todo o resto à direita:
          </p>
          <CodeBlock>{`Z = 40A + 60B   →   Z − 40A − 60B = 0`}</CodeBlock>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            A linha da função objetivo da tabela guarda os coeficientes dessa equação. Por isso o
            lucro de R$ 40 e R$ 60 aparecem como <Code>−40</Code> e <Code>−60</Code>: é o lucro
            &quot;trazido&quot; para o lado esquerdo.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Esse sinal é o que move o algoritmo:
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed list-disc pl-5 text-foreground/90">
            <li>
              Enquanto existir coeficiente <strong>negativo</strong> na linha <Code>Z</Code>,
              aumentar essa variável <strong>aumenta</strong> o lucro — ainda dá para melhorar.
            </li>
            <li>
              A coluna com o valor <strong>mais negativo</strong> (maior custo-benefício) é a que
              entra na base.
            </li>
            <li>
              Quando não há mais nenhum negativo, nenhuma variável melhora o resultado: a solução é{' '}
              <strong>ótima</strong>.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Pivotagem</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            A variável que entra é a coluna mais negativa da linha <Code>Z</Code>. A que sai usa a{' '}
            <strong>regra da razão mínima</strong>: divide o lado direito pelo coeficiente da coluna
            entrante (só valores positivos) e escolhe a menor razão. Depois, eliminação gaussiana na
            coluna do pivô: 1 no pivô, 0 nas demais linhas.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Parada</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Quando a linha <Code>Z</Code> não tem coeficiente negativo, paramos. As variáveis da
            base são as produzidas, e a célula <Code>Z</Code> guarda o lucro máximo.
          </p>
        </section>
      </article>
    </div>
  )
}