# Simplex Resolver

Tutorial interativo que ensina o método Simplex de programação linear.

## Como funciona

1. Tela inicial mostra um problema de otimização + tabela Simplex centralizada
2. Driver.js guia o usuário passo a passo
3. Cada passo: extrair dados → preencher tabela → iterar → solução

## Stack

- [TanStack Start](https://tanstack.com/start) - SSR + file-based routing
- [shadcn/ui](https://ui.shadcn.com/) - componentes (Table, Button, Card, Dialog)
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
│   ├── __root.tsx        # layout
│   └── index.tsx         # tela inicial (tabela + problema)
├── components/
│   ├── ui/               # shadcn components
│   └── simplex/
│       ├── table.tsx     # tabela Simplex
│       └── tour.tsx      # config driver.js
└── lib/
    └── simplex.ts        # logica do metodo
```

## Fluxo do tutorial

1. Problema exibido acima da tabela
2. Driver.js spotlight na celula correspondente
3. Tooltip explica o que preencher
4. Usuário confere → próximo passo
5. Iteração completa → solução encontrada
