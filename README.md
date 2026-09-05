<p align="center">
<img alt="Tabela de Frequências" src="https://shieldcn.dev/header/graph.svg?title=Tabela+de+Frequ%C3%AAncias&subtitle=+Trabalho+de+Estat%C3%ADstica+com+tabela+de+frequ%C3%AAncias+e+medidas+de+tend%C3%AAncia+central+e+dispers%C3%A3o.&mode=dark">
</p>

<p align="center">
  <img alt="built in" src="https://shieldcn.dev/flag/br.svg" />
  <a href="https://github.com/Edgarcsr/statistics-frequency-table"><img alt="repo views" src="https://shieldcn.dev/views/repo/Edgarcsr/statistics-frequency-table.svg?variant=outline" /></a>
  <a href="https://edgarcsr.github.io/statistics-frequency-table/"><img alt="badge" src="https://shieldcn.dev/badge/Access Website.svg?logo=github" /></a>
</p>
## Fork

Este projeto é um **fork** do [simplex-resolver](https://github.com/Edgarcsr/simplex-resolver), de
Edgarcsr. A estrutura (TanStack Start, shadcn/ui, layout) foi reaproveitada e o conteúdo substituído:
o tema lime virou teal e o resolvedor Simplex virou um trabalho de Estatística com tabela de
frequências e medidas de tendência central e dispersão.

## Overview

Projeto de Estatística que, a partir das alturas dos alunos de uma sala (dados editáveis), agrupa os valores em classes e monta a **tabela de frequências completa** — frequência absoluta, relativa, acumulada, ponto médio e produto xi·fi — e calcula **média, moda, mediana, variância (populacional e amostral) e desvio padrão**. Interface em português brasileiro.

## Como funciona

1. Digite as alturas em cm (separadas por espaço, vírgula ou quebra de linha) — já vem com dados de exemplo.
2. O sistema agrupa em classes pela regra da raiz quadrada: `k = ⌈√n⌉`.
3. Monta a tabela de frequências completa e recalcula as medidas ao vivo.
4. A página "Documentação" explica cada fórmula usada.

## Stack

- [TanStack Start](https://tanstack.com/start) - SSR + file-based routing
- [shadcn/ui](https://ui.shadcn.com/) - Table, Card, Button
- [Tailwind CSS](https://tailwindcss.com/) - styles (tema teal)
- [Vitest](https://vitest.dev/) - testes da lógica estatística

## Run

```bash
bun install
bun --bun run dev
```

## Structure

```
src/
├── routes/
│   ├── __root.tsx           # layout
│   ├── index.tsx            # home: input + medidas + tabela
│   └── metodo.tsx           # fórmulas
├── components/
│   ├── ui/                  # shadcn (table, card, button, chart)
│   ├── values-input.tsx    # editor de alturas
│   ├── measures-grid.tsx    # cards de resultados
│   ├── frequency-table.tsx  # tabela de frequências
│   └── frequency-chart.tsx  # histograma
└── utils/                   # lógica de cálculo
    ├── math.ts              # contas (classes, média, mediana, moda, variância)
    ├── data.ts              # dados de exemplo + parser
    ├── types.ts             # tipos compartilhados
    └── cn.ts                # utilitário de classes
```
