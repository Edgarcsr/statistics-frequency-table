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
    id: 'idades',
    label: 'Idades dos alunos (anos)',
    values: [17, 18, 18, 19, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 25],
  },
  {
    id: 'pesos',
    label: 'Pesos dos alunos (kg)',
    values: [52, 55, 57, 58, 60, 61, 62, 63, 65, 66, 68, 70, 72, 75, 78, 80, 82, 85],
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