export interface ExampleDataset {
  id: string
  label: string
  values: number[]
}

export const EXAMPLE_DATASETS: ExampleDataset[] = [
  {
    id: 'alturas',
    label: 'Alturas dos alunos (m)',
    values: [
      1.7, 1.69, 1.82, 1.8, 1.79, 1.74, 1.8, 1.93, 1.9, 1.67, 1.8, 1.85, 1.75,
      1.75, 1.79, 1.93, 1.67, 1.79, 1.75, 1.79, 1.74, 1.7, 2.03, 1.83, 1.68, 1.7,
      1.72, 1.7, 1.58, 1.84,
    ],
  },
  {
    id: 'temperaturas',
    label: 'Temperaturas máximas (ºC)',
    values: [20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 29, 30, 31, 32],
  },
  {
    id: 'precos',
    label: 'Preços de produtos (R$)',
    values: [19, 24, 27, 31, 35, 38, 42, 45, 49, 52, 55, 58, 61, 64, 68, 71, 75, 79],
  },
]

export function parseValues(input: string): number[] {
  const withDecimalPoint = input.replace(/(\d),(\d)/g, '$1.$2')
  const parts = withDecimalPoint.split(/[\s,;]+/)
  const values: number[] = []
  for (const part of parts) {
    if (!part) continue
    const num = Number(part)
    if (Number.isFinite(num) && num > 0) values.push(num)
  }
  return values
}