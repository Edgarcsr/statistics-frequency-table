export const DEFAULT_VALUES = [
  152, 155, 156, 158, 158, 160, 160, 161, 162, 162, 163, 164, 165, 165, 166,
  167, 168, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 180, 182,
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