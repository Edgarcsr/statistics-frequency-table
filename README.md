# Shadcn Tour - Tutorial Interativo

Site que ensina usar componentes shadcn/ui com guias interativos via driver.js.

## Stack

- [TanStack Start](https://tanstack.com/start) - SSR framework
- [shadcn/ui](https://ui.shadcn.com/) - componentes React
- [driver.js](https://driver.js.org/) - spotlight tours
- [Tailwind CSS](https://tailwindcss.com/) - estilos

## Componentes cobertos

- Button
- Card
- Dialog
- Form (Input, Label, Select, Checkbox)
- Table
- Tabs
- Toast/Sonner
- Dropdown Menu
- Sheet

## Run

```bash
bun install
bun --bun run dev
```

## Estrutura

```
src/
├── routes/
│   ├── __root.tsx          # layout + nav
│   ├── index.tsx           # home
│   └── components/
│       ├── button.tsx      # demo + tour Button
│       ├── card.tsx        # demo + tour Card
│       ├── dialog.tsx      # demo + tour Dialog
│       ├── form.tsx        # demo + tour Form
│       └── ...
├── components/
│   ├── ui/                 # shadcn components
│   └── tour/
│       └── driver.ts       # config driver.js
└── styles.css
```

## Tour flow

1. User clica "Start Tour" no componente
2. Driver.js spotlight no elemento
3. Tooltip explica props/uso
4. Próximo componente

## Dev

```bash
# add shadcn component
pnpm dlx shadcn@latest add button

# build
bun --bun run build
```
