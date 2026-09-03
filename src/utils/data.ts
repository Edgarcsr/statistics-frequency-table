export interface ExampleDataset {
  id: string
  label: string
  values: number[]
}

export const EXAMPLE_DATASETS: ExampleDataset[] = [
  {
    id: 'alturas',
    label: 'Alturas dos alunos (cm)',
    values: [
      152, 155, 156, 158, 158, 160, 160, 161, 162, 162, 163, 164, 165, 165, 166,
      167, 168, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 180, 182,
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