# Simplex Resolver

Tutorial interativo que ensina o método Simplex de programação linear.

## Problema exemplo

Uma fábrica produz cadeiras (A) e mesas (B). Cada cadeira gasta 2h de marcenaria e 1h de acabamento. Cada mesa gasta 1h de marcenaria e 3h de acabamento. Disponível: 120h marcenaria, 90h acabamento. Lucro: R$ 40/cadeira, R$ 60/mesa.

## Como funciona

1. Tela mostra o problema com contexto real + tabela Simplex
2. "Iniciar Tutorial" → driver.js spotlight em cada parte da tabela
3. "Resolver Passo a Passo" → iterações com navegação anterior/próximo
4. Cada passo descreve o que mudou e por quê

## Stack

- [TanStack Start](https://tanstack.com/start) - SSR + file-based routing
- [shadcn/ui](https://ui.shadcn.com/) - Table, Button
- [driver.js](https://driver.js.org/) - spotlight tours interativos
- [Tailwind CSS](https://tailwindcss.com/) - estilos

## Run

```bash
bun install
bun --bun run dev
```

## Estrutura

```
src/
├── routes/
│   ├── __root.tsx           # layout
│   └── index.tsx            # página inicial
├── components/
│   ├── ui/                  # shadcn (table, button, card)
│   ├── simplex-table.tsx    # tabela Simplex com highlights
│   └── tour.tsx             # config driver.js
└── lib/
    └── simplex.ts           # lógica do método
```
